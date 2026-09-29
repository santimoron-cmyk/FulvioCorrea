// Site journey: app.js records it (localStorage fc_journey, no personal data), the Sofía payload carries it
// (contact-test.mjs) and the lead Function turns it into journey_* fields + a Spanish note in Colombia time.
import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
import {journeyFields,parseJourney,colombiaTime} from './server/journey.mjs';
// 1. Client recording (built dist/app.js) with separate tab-session and durable storage.
const source=fs.readFileSync('dist/app.js','utf8'),local=new Map();let clock=Date.UTC(2026,8,28,22,30);
const store=m=>({getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)});
function visit(url,title,session){const el={hidden:false,onclick:null,getAttribute(){return 'false';},setAttribute(){},classList:{toggle(){},add(){},remove(){}}};
 const DateNow=class extends Date{static now(){return clock;}};
 vm.runInNewContext(source,{window:{SITE_CONFIG:{},dataLayer:[]},URL,URLSearchParams,Date:DateNow,Math,location:new URL(url),sessionStorage:store(session),localStorage:store(local),
  document:{title,documentElement:{lang:'es'},referrer:'',getElementById:id=>id==='consultation-form'?null:el,querySelector:s=>s==='.menu-toggle'||s==='.nav'?el:null,querySelectorAll:()=>[],addEventListener(){}}});
 return JSON.parse(local.get('fc_journey'));}
const tab1=new Map();
let j=visit('https://fulviocorrea.com/es/?utm_source=ig','Cirugía plástica en Cartagena | Dr. Fulvio Correa',tab1);
assert.equal(j.v,1);assert.deepEqual(j.p,[['/es/','Cirugía plástica en Cartagena',clock]]);assert.equal(j.f,clock);
clock+=60000;j=visit('https://fulviocorrea.com/es/procedimientos/bbl/?email=x@y.z','Aumento glúteo con grasa | Dr. Fulvio Correa',tab1);
assert.equal(j.v,1,'same tab session is the same visit');assert.equal(j.p.length,2);assert.equal(j.p[1][0],'/es/procedimientos/bbl/','path only, never the query string');
assert.ok(!JSON.stringify(j).includes('x@y.z')&&!JSON.stringify(j).includes('utm_source'),'no personal data or campaign params in the journey');
clock+=86400000;j=visit('https://fulviocorrea.com/en/procedures/bbl/','Brazilian Butt Lift in Cartagena | Dr. Fulvio Correa',new Map());
assert.equal(j.v,2,'a new tab session counts as a return visit');assert.equal(j.p.length,3);
for(let i=0;i<40;i++){clock+=1000;j=visit('https://fulviocorrea.com/en/blog/','Blog',new Map());}
assert.equal(j.p.length,30,'capped at 30 entries');assert.equal(j.v,42);
clock+=91*86400000;j=visit('https://fulviocorrea.com/en/','Home',tab1);assert.deepEqual(j.p.map(e=>e[0]),['/en/'],'entries older than 90 days are dropped');
// 2. Server formatting (Colombia time = UTC-5, no DST).
assert.equal(colombiaTime(Date.UTC(2026,8,28,22,30)),'28/09 17:30');assert.equal(colombiaTime(Date.UTC(2026,8,29,3,5),true),'28/09/2026 22:05');
const now=Date.UTC(2026,8,28,22,40),t=(d,h,m)=>Date.UTC(2026,8,d,h,m);
const raw=JSON.stringify({v:3,f:t(25,15,12),p:[['/es/','Cirugía plástica en Cartagena',t(25,15,12)],['/es/procedimientos/bbl/','Aumento glúteo con grasa',t(28,22,30)],['/en/procedures/bbl/','Brazilian Butt Lift <b>in</b> Cartagena',t(28,22,35)]]});
const f=journeyFields(raw,now);
assert.equal(f.journey_note,['Recorrido en el sitio (hora Colombia) — visitas: 3, primera visita: 25/09/2026 10:12, páginas vistas: 3',
 '• 25/09 10:12 · Cirugía plástica en Cartagena (ES) · /es/','• 28/09 17:30 · Aumento glúteo con grasa (ES) · /es/procedimientos/bbl/','• 28/09 17:35 · Brazilian Butt Lift b in /b Cartagena (EN) · /en/procedures/bbl/'].join('\n'));
assert.deepEqual({v:f.journey_visits,first:f.journey_first_visit,n:f.journey_pages_count,pages:f.journey_pages},{v:3,first:'25/09/2026 10:12',n:3,pages:'/es/ > /es/procedimientos/bbl/ > /en/procedures/bbl/'});
// Invalid or hostile input never breaks the lead: fields are empty or entries dropped.
for(const bad of ['','{',null,42,'[]',JSON.stringify({v:1,p:[]}),JSON.stringify({v:1,p:[['javascript:alert(1)','x',now]]}),JSON.stringify({v:1,p:[['/es/','x',now+5*86400000]]}),'x'.repeat(13000)])
 assert.equal(journeyFields(bad,now).journey_note,'','rejected: '+String(bad).slice(0,40));
assert.equal(parseJourney(JSON.stringify({v:-4,f:'x',p:[['/es/',{},t(28,22,0)]]}),now).visits,1);
assert.equal(parseJourney(JSON.stringify({v:2,p:Array.from({length:50},(_,i)=>['/es/','p'+i,t(28,20,i)])}),now).pages.length,30);
// 3. Through the lead Function with a mocked HighLevel webhook (no real requests).
const {onRequest}=await import('./functions/api/lead.js');const procedures=(await import('./functions/_shared/lead-procedures.js')).default;
const sent=[];globalThis.fetch=async(url,init)=>{sent.push(JSON.parse(init.body));return new Response('{}',{status:200});};
const site='https://fulviocorrea.com',env={LEAD_CAPTURE_ENABLED:'true',LEAD_WEBHOOK_URL:'https://services.leadconnectorhq.com/hooks/EXAMPLE/webhook-trigger/EXAMPLE'};
const body={event:'lead_created',lead_id:'lead-journey-0001',event_id:'lead-journey-0001-created',name:'Ana Prueba',phone:'+573001112233',procedure:procedures[0],language:'es',contact_consent:true,journey:JSON.stringify({v:2,f:Date.now()-3600000,p:[['/es/','Inicio',Date.now()-60000]]})};
const res=await onRequest({request:new Request(site+'/api/lead',{method:'POST',headers:{'content-type':'application/json',origin:site,'idempotency-key':body.event_id},body:JSON.stringify(body)}),env});
assert.equal(res.status,200);assert.equal(sent.length,1);assert.equal(sent[0].journey_visits,2);assert.match(sent[0].journey_note,/^Recorrido en el sitio \(hora Colombia\) — visitas: 2, primera visita: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}, páginas vistas: 1\n• \d{2}\/\d{2} \d{2}:\d{2} · Inicio \(ES\) · \/es\/$/);
assert.ok(!('journey' in sent[0]),'raw journey JSON is not forwarded');assert.ok(Object.values(sent[0]).every(v=>typeof v!=='object'),'payload stays flat');
console.log('PASS: journey recording (visits, 30-entry cap, 90-day window, no query strings/PII), Colombia-time note formatting, hostile input, lead Function fields.');
