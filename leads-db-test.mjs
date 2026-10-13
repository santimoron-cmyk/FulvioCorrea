// KV backup and private CSV export. The store is in-memory; nothing here touches NinjaSuite or Cloudflare.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {onRequest}=await import('./functions/api/lead.js');
const {onRequest:exportCsv}=await import('./functions/api/leads.csv.js');
const {CSV_COLUMNS,sameSecret}=await import('./server/leads-db.mjs');
const {robotsTxt}=await import('./site-env.mjs');
for(const f of ['functions/api/leads.csv.js','server/leads-db.mjs','server/lead-handler.mjs'])assert.ok(!/from ['"]node:|require\(/.test(fs.readFileSync(f,'utf8')),f+' must not import node: modules');
for(const f of ['app.js','contact-widget.js','event-signup.js','event-aromas-view.mjs','event-view.mjs','render.mjs'])assert.ok(!fs.readFileSync(f,'utf8').includes('/api/leads.csv'),f+' must not link the export');
const logs=[];
for(const k of ['log','info','warn','error','debug']){const orig=console[k].bind(console);console[k]=(...a)=>{logs.push(a.map(v=>typeof v==='string'?v:JSON.stringify(v)).join(' '));orig(...a);};}
function memoryDb(failWrites=0){
 const store=new Map(),rows=new Map();let writes=0;
 return {rows,
  async put(key,value,opts){writes++;if(writes<=failWrites)throw Error('kv unavailable');store.set(key,{value,metadata:opts?.metadata});const row=JSON.parse(value);rows.set(row.event_id,row);},
  async get(key){return store.get(key)?.value??null;},
  async list({prefix='',cursor}={}){const all=[...store.keys()].filter(k=>k.startsWith(prefix)).sort();const start=cursor?Number(cursor):0;const page=all.slice(start,start+2);const next=start+2;return {keys:page.map(name=>({name,metadata:store.get(name).metadata})),list_complete:next>=all.length,cursor:next>=all.length?undefined:String(next)};}
 };
}
const procedures=(await import('./functions/_shared/lead-procedures.js')).default;
const site='https://fulviocorrea.com',token='test-export-token';
const db=memoryDb();
const env={LEAD_CAPTURE_ENABLED:'true',LEAD_WEBHOOK_URL:'https://services.leadconnectorhq.com/hooks/EXAMPLE/webhook-trigger/EXAMPLE',LEADS_KV:db,LEADS_EXPORT_TOKEN:token};
let fetches=0;
globalThis.fetch=async()=>{fetches++;const pending=[...db.rows.values()].at(-1);assert.equal(pending.webhook_status,'pending','row is stored before the webhook');return new Response('{}',{status:200});};
const base={name:'María José López',phone:'+573001234567',phone_country:'CO',phone_country_code:'+57',procedure:procedures[0],procedure_label:'Liposucción',language:'es',contact_consent:true,consent_version:'contact-consent-2026-09-27',consent_text:'Acepto',page_url:site+'/es/procedures/liposuction/',utm_source:'google',utm_medium:'cpc',utm_campaign:'lipo-es',form_id:'contact-widget'};
const post=(body,headers={})=>onRequest({request:new Request(site+'/api/lead',{method:'POST',headers:{'content-type':'application/json',origin:site,'idempotency-key':body.event_id,'CF-IPCountry':'us',...headers},body:JSON.stringify(body)}),env});
const lead={...base,event:'lead_created',lead_id:'lead-d1-regular01',event_id:'lead-d1-regular01-created'};
let res=await post(lead);assert.equal(res.status,200);assert.equal(fetches,1);
let row=db.rows.get(lead.event_id);
assert.equal(row.webhook_status,'forwarded');assert.equal(row.webhook_http_status,200);assert.equal(row.ip_country,'US');assert.equal(row.event_slug,'');assert.equal(row.language,'es');assert.equal(row.utm_source,'google');assert.equal(row.utm_campaign,'lipo-es');
assert.equal(JSON.parse(row.payload_json).phone,'+573001234567');
const before=db.rows.size;
res=await post({...lead,event_id:'lead-d1-badphone1',lead_id:'lead-d1-badphone1',phone:'300'});assert.equal(res.status,422);assert.equal(db.rows.size,before,'rejected leads are not stored');
res=await onRequest({request:new Request(site+'/api/lead',{method:'POST',headers:{'content-type':'application/json',origin:site,'idempotency-key':'lead-d1-off-created'},body:JSON.stringify({...lead,event_id:'lead-d1-off-created',lead_id:'lead-d1-off'})}),env:{...env,LEAD_CAPTURE_ENABLED:'false'}});assert.equal(res.status,503);assert.equal(db.rows.size,before,'unconfigured capture is not stored');
const doral={...base,procedure:'mommy-makeover',procedure_label:'Mommy Makeover',procedure_interest:'breast',email:'ana@example.com',city:'Doral',companion:'yes',event_tag:'conversatorio-belleza-estetica-doral-nov2026',form_id:'event-signup',page_url:site+'/es/conversatorio-belleza-estetica-doral/',language:'es',event:'lead_created',lead_id:'lead-d1-doral0001',event_id:'lead-d1-doral0001-created'};
res=await post(doral);assert.equal(res.status,200);
row=db.rows.get(doral.event_id);
assert.equal(row.event_slug,'doral');assert.equal(row.procedure_interest,'breast');assert.equal(row.procedure_interest_label,'Cirugía de busto / Breast surgery');assert.equal(row.event_tag,'conversatorio-belleza-estetica-doral-nov2026');assert.equal(row.page_path,'/es/conversatorio-belleza-estetica-doral/');assert.equal(row.city,'Doral');
const down=memoryDb(1);let downFetches=0;
globalThis.fetch=async()=>{downFetches++;return new Response('no',{status:500});};
const downEnv={...env,LEADS_KV:down};
res=await onRequest({request:new Request(site+'/api/lead',{method:'POST',headers:{'content-type':'application/json',origin:site,'idempotency-key':'lead-d1-failhook1-created','CF-IPCountry':'CO'},body:JSON.stringify({...doral,lead_id:'lead-d1-failhook1',event_id:'lead-d1-failhook1-created'})}),env:downEnv});
assert.equal(res.status,502);assert.equal(downFetches,1,'webhook still runs when the first write fails');
assert.equal(down.rows.get('lead-d1-failhook1-created').webhook_status,'webhook_failed');assert.equal(down.rows.get('lead-d1-failhook1-created').webhook_http_status,500);
const dead={async put(){throw Error('kv offline '+base.phone);},async get(){throw Error('kv offline '+base.phone);},async list(){throw Error('kv offline '+base.phone);}};
globalThis.fetch=async()=>new Response('{}',{status:200});
res=await onRequest({request:new Request(site+'/api/lead',{method:'POST',headers:{'content-type':'application/json',origin:site,'idempotency-key':'lead-d1-nodb0001-created'},body:JSON.stringify({...lead,lead_id:'lead-d1-nodb0001',event_id:'lead-d1-nodb0001-created'})}),env:{...env,LEADS_KV:dead}});
assert.equal(res.status,200,'a dead database does not block NinjaSuite');
const csvUrl=(q='')=>site+'/api/leads.csv'+q;
const csvCall=(headers={},q='')=>exportCsv({request:new Request(csvUrl(q),{headers}),env});
res=await csvCall();assert.equal(res.status,401);assert.equal(res.headers.get('cache-control'),'no-store');assert.equal(res.headers.get('x-robots-tag'),'noindex, nofollow');
res=await csvCall({'x-leads-export-token':'nope'});assert.equal(res.status,401);
res=await exportCsv({request:new Request(csvUrl('?event=doral&key=nope')),env});assert.equal(res.status,401);assert.equal(res.headers.get('cache-control'),'no-store');assert.match(res.headers.get('x-robots-tag'),/noindex/);
res=await csvCall({authorization:'Bearer '+token});assert.equal(res.status,200);assert.equal(res.headers.get('cache-control'),'no-store');assert.match(res.headers.get('x-robots-tag'),/noindex/);
const bytes=new Uint8Array(await res.arrayBuffer());
assert.deepEqual([...bytes.slice(0,3)],[0xEF,0xBB,0xBF],'UTF-8 BOM for Excel');
let body=new TextDecoder().decode(bytes);assert.ok(body.includes(CSV_COLUMNS.join(',')));assert.ok(body.includes('lead-d1-doral0001'));assert.ok(body.includes('lead-d1-regular01'));assert.ok(!body.includes(token));
res=await csvCall({'x-leads-export-token':token},'?event=doral');body=await res.text();assert.ok(body.includes('lead-d1-doral0001'));assert.ok(!body.includes('lead-d1-regular01'));assert.match(body,/breast/);
res=await csvCall({'x-leads-export-token':token},'?from=2099-01-01');body=await res.text();assert.equal(body.split('\r\n').filter(Boolean).length,1,'future from-date returns only the header');
res=await exportCsv({request:new Request(csvUrl('?token='+token+'&event=doral&from=2000-01-01')),env});assert.equal(res.status,200);body=await res.text();assert.ok(body.includes('ana@example.com'));assert.ok(body.includes('lead-d1-doral0001'));
res=await exportCsv({request:new Request(csvUrl('?event=doral&key='+encodeURIComponent(token))),env});assert.equal(res.status,200);assert.equal(res.headers.get('cache-control'),'no-store');assert.match(res.headers.get('x-robots-tag'),/noindex/);body=await res.text();assert.ok(body.includes('lead-d1-doral0001'));assert.ok(!body.includes('lead-d1-regular01'));assert.ok(!body.includes(token));
res=await exportCsv({request:new Request(csvUrl('?event=doral&key=wrong'),{headers:{authorization:'Bearer '+token}}),env});assert.equal(res.status,200,'Bearer still authorizes when key does not match');
assert.equal(await sameSecret(token,token),true);
assert.equal(await sameSecret(token+'x',token),false);
assert.equal(await sameSecret(token.slice(0,-1)+'!',token),false);
assert.equal(await sameSecret('',token),false);
const prodRobots=robotsTxt(true,site);
assert.equal((prodRobots.match(/^Disallow: \/api\/leads\.csv$/gm)||[]).length,(prodRobots.match(/^User-agent:/gm)||[]).length,'every production crawler group disallows the export');
assert.match(robotsTxt(false,site),/^User-agent: \*\nDisallow: \/\s*$/,'preview robots still disallow the whole site');
res=await csvCall({'x-leads-export-token':token},'?event=Doral');assert.equal(res.status,400);
res=await csvCall({'x-leads-export-token':token},'?from=07-10-2026');assert.equal(res.status,400);
res=await exportCsv({request:new Request(csvUrl(),{method:'POST',headers:{authorization:'Bearer '+token}}),env});assert.equal(res.status,405);
res=await exportCsv({request:new Request(csvUrl(),{headers:{authorization:'Bearer '+token}}),env:{LEADS_EXPORT_TOKEN:token}});assert.equal(res.status,503);
res=await exportCsv({request:new Request(csvUrl(),{headers:{authorization:'Bearer '+token}}),env:{LEADS_EXPORT_TOKEN:token,LEADS_KV:dead}});assert.equal(res.status,503);
assert.ok(!logs.some(line=>/573001234567|ana@example.com|María José/.test(line)),'no personal data in console');
console.log('PASS: KV lead backup stores before the webhook, keeps webhook_failed, ignores a dead database, and the CSV export stays private.');
