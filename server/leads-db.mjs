// Cloudflare Workers KV backup for validated leads (binding LEADS_KV). Runtime-neutral: no node: imports,
// no console (a log line here would be personal data). A storage error must not escape to the caller.
// One key per event_id: lead:<event_id>. Metadata {s:event_slug,r:received_at} lets the export filter without reading every value.
export const LEAD_COLUMNS=['event_id','lead_id','received_at','updated_at','event','event_slug','event_tag','language','name','phone','email','city','procedure','procedure_label','procedure_interest','procedure_interest_label','companion','form_id','page_path','page_url','utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','ip_country','webhook_status','webhook_http_status','payload_json'];
// Columns returned by GET /api/leads.csv. payload_json stays in KV only.
export const CSV_COLUMNS=['received_at','lead_id','event_id','event','event_slug','event_tag','language','name','phone','email','city','procedure','procedure_label','procedure_interest','procedure_interest_label','companion','form_id','page_path','utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','ip_country','webhook_status','webhook_http_status'];
const DB_MS=2500;

const text=v=>v==null?'':String(v);
export function eventSlug(eventTag,pagePath){return /doral/i.test(`${eventTag||''} ${pagePath||''}`)?'doral':'';}
export function leadRecord(payload,{ipCountry=''}={}){
 const country=/^[A-Za-z]{2}$/.test(ipCountry)?ipCountry.toUpperCase():'';
 const row={
  event_id:text(payload.event_id),lead_id:text(payload.lead_id),received_at:text(payload.received_at),updated_at:text(payload.received_at),
  event:text(payload.event),event_slug:eventSlug(payload.event_tag,payload.page_path),event_tag:text(payload.event_tag),language:text(payload.language),
  name:text(payload.name),phone:text(payload.phone),email:text(payload.email),city:text(payload.city),
  procedure:text(payload.procedure),procedure_label:text(payload.procedure_label),procedure_interest:text(payload.procedure_interest),procedure_interest_label:text(payload.procedure_interest_label),
  companion:text(payload.companion),form_id:text(payload.form_id),page_path:text(payload.page_path),page_url:text(payload.page_url),
  utm_source:text(payload.utm_source),utm_medium:text(payload.utm_medium),utm_campaign:text(payload.utm_campaign),utm_term:text(payload.utm_term),utm_content:text(payload.utm_content),
  gclid:text(payload.gclid),gbraid:text(payload.gbraid),wbraid:text(payload.wbraid),fbclid:text(payload.fbclid),
  ip_country:country,webhook_status:'pending',webhook_http_status:null,payload_json:JSON.stringify(payload)
 };
 return row;
}
function within(p){
 let timer;
 const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('leads_db_timeout')),DB_MS);});
 return Promise.race([p,timeout]).finally(()=>clearTimeout(timer));
}
async function write(kv,row){
 if(!kv||typeof kv.put!=='function'||!row.event_id)return false;
 const value=Object.fromEntries(LEAD_COLUMNS.map(c=>[c,row[c]??null]));
 try{await within(kv.put('lead:'+row.event_id,JSON.stringify(value),{metadata:{s:row.event_slug||'',r:row.received_at||''}}));return true;}catch{return false;}
}
// Insert (or replace) the row before the webhook call. Never throws.
export function storeLead(db,row){return write(db,{...row,webhook_status:'pending',webhook_http_status:null});}
// After the webhook call. status is forwarded or webhook_failed. Never throws.
export function markLead(db,row,status,httpStatus){
 const code=Number.isInteger(httpStatus)&&httpStatus>=100&&httpStatus<=599?httpStatus:null;
 return write(db,{...row,webhook_status:status,webhook_http_status:code,updated_at:new Date().toISOString()});
}
export function exportFilter(url){
 const event=url.searchParams.get('event')??'',from=url.searchParams.get('from')??'';
 if(event&&!/^[a-z0-9-]{1,40}$/.test(event))return {error:'bad_filter'};
 if(from&&!/^\d{4}-\d{2}-\d{2}$/.test(from))return {error:'bad_filter'};
 return {event,from};
}
function csvCell(v){const s=v==null?'':String(v);return /[",\n\r]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;}
export async function leadsCsv(kv,{event='',from=''}={}){
 if(!kv||typeof kv.list!=='function')throw Error('not_configured');
 const keys=[];let cursor;
 do{const page=await kv.list({prefix:'lead:',cursor});for(const k of page.keys||[]){const m=k.metadata||{};if(event&&m.s!==event)continue;if(from&&String(m.r||'')<from)continue;keys.push(k.name);}cursor=page.list_complete?undefined:page.cursor;}while(cursor&&keys.length<10000);
 const rows=(await Promise.all(keys.slice(0,10000).map(async k=>{try{return JSON.parse(await kv.get(k)||'null');}catch{return null;}}))).filter(Boolean);
 rows.sort((a,b)=>String(a.received_at)<String(b.received_at)?-1:1);
 const lines=[CSV_COLUMNS.join(','),...rows.map(row=>CSV_COLUMNS.map(c=>csvCell(row[c])).join(','))];
 return {body:'\uFEFF'+lines.join('\r\n')+'\r\n',truncated:rows.length>=10000};
}
// Constant-time secret compare. SHA-256 makes the inputs the same length, then every byte is XOR'd.
// Workers have no timingSafeEqual. Do not replace this with ===.
export async function sameSecret(a,b){
 const enc=new TextEncoder();
 const [da,db]=await Promise.all([crypto.subtle.digest('SHA-256',enc.encode(String(a))),crypto.subtle.digest('SHA-256',enc.encode(String(b)))]);
 const x=new Uint8Array(da),y=new Uint8Array(db);let out=0;for(let i=0;i<x.length;i++)out|=x[i]^y[i];return out===0;
}
