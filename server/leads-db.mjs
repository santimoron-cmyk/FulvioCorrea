// Cloudflare D1 backup for validated leads. Runtime-neutral: no node: imports, no console
// (a log line here would be personal data). A database error must not escape to the caller.
// Keep d1/leads.sql identical to SCHEMA so `wrangler d1 execute --file` matches the runtime.
export const SCHEMA=`CREATE TABLE IF NOT EXISTS leads (
  event_id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  received_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  event TEXT NOT NULL,
  event_slug TEXT NOT NULL DEFAULT '',
  event_tag TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  procedure TEXT NOT NULL DEFAULT '',
  procedure_label TEXT NOT NULL DEFAULT '',
  procedure_interest TEXT NOT NULL DEFAULT '',
  procedure_interest_label TEXT NOT NULL DEFAULT '',
  companion TEXT NOT NULL DEFAULT '',
  form_id TEXT NOT NULL DEFAULT '',
  page_path TEXT NOT NULL DEFAULT '',
  page_url TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  utm_term TEXT NOT NULL DEFAULT '',
  utm_content TEXT NOT NULL DEFAULT '',
  gclid TEXT NOT NULL DEFAULT '',
  gbraid TEXT NOT NULL DEFAULT '',
  wbraid TEXT NOT NULL DEFAULT '',
  fbclid TEXT NOT NULL DEFAULT '',
  ip_country TEXT NOT NULL DEFAULT '',
  webhook_status TEXT NOT NULL DEFAULT 'pending',
  webhook_http_status INTEGER,
  payload_json TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS leads_received_at ON leads (received_at);
CREATE INDEX IF NOT EXISTS leads_event_slug ON leads (event_slug);
`;

export const LEAD_COLUMNS=['event_id','lead_id','received_at','updated_at','event','event_slug','event_tag','language','name','phone','email','city','procedure','procedure_label','procedure_interest','procedure_interest_label','companion','form_id','page_path','page_url','utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','ip_country','webhook_status','webhook_http_status','payload_json'];
// Columns returned by GET /api/leads.csv. payload_json stays in D1 only.
export const CSV_COLUMNS=['received_at','lead_id','event_id','event','event_slug','event_tag','language','name','phone','email','city','procedure','procedure_label','procedure_interest','procedure_interest_label','companion','form_id','page_path','utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','ip_country','webhook_status','webhook_http_status'];
const UPSERT=`INSERT INTO leads (${LEAD_COLUMNS.join(',')}) VALUES (${LEAD_COLUMNS.map(()=>'?').join(',')}) ON CONFLICT(event_id) DO UPDATE SET ${LEAD_COLUMNS.filter(c=>c!=='event_id').map(c=>c+'=excluded.'+c).join(',')}`;
const SELECT=`SELECT ${CSV_COLUMNS.join(',')} FROM leads WHERE (? = '' OR event_slug = ?) AND (? = '' OR received_at >= ?) ORDER BY received_at ASC LIMIT 10000`;
const DB_MS=2500;
const schemas=new WeakMap();

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
function ensure(db){
 let pending=schemas.get(db);
 if(!pending){pending=db.exec(SCHEMA).then(()=>true,err=>{schemas.delete(db);throw err;});schemas.set(db,pending);}
 return pending;
}
function within(p){
 let timer;
 const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('leads_db_timeout')),DB_MS);});
 return Promise.race([p,timeout]).finally(()=>clearTimeout(timer));
}
async function write(db,row){
 if(!db||!row.event_id)return false;
 try{await within(ensure(db).then(()=>db.prepare(UPSERT).bind(...LEAD_COLUMNS.map(c=>row[c]??null)).run()));return true;}catch{return false;}
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
export async function leadsCsv(db,{event='',from=''}={}){
 await ensure(db);
 const queried=await db.prepare(SELECT).bind(event,event,from,from).all();
 const results=queried?.results||[];
 const lines=[CSV_COLUMNS.join(','),...results.map(row=>CSV_COLUMNS.map(c=>csvCell(row[c])).join(','))];
 return {body:'\uFEFF'+lines.join('\r\n')+'\r\n',truncated:results.length>=10000};
}
export async function sameSecret(a,b){
 const enc=new TextEncoder();
 const [da,db]=await Promise.all([crypto.subtle.digest('SHA-256',enc.encode(String(a))),crypto.subtle.digest('SHA-256',enc.encode(String(b)))]);
 const x=new Uint8Array(da),y=new Uint8Array(db);let out=0;for(let i=0;i<x.length;i++)out|=x[i]^y[i];return out===0;
}
