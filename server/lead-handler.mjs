// Runtime-neutral (Node 20+, Cloudflare Workers/Pages Functions): Web Crypto + fetch only, no node: imports.
// Events (see LEAD-WEBHOOK.md): lead_created (visitor taps "Choose how to connect") and channel_selected
// (visitor picks WhatsApp / call / SMS / Instagram / Facebook). Both carry the same lead_id and phone so the
// CRM workflow updates one contact. The payload forwarded to LEAD_WEBHOOK_URL is flat JSON (easy to map).
// Call events add call_due_at / call_due_at_iso / call_window_colombia from the server clock (call-due.mjs).
import {callSchedule} from './call-due.mjs';
import {journeyFields} from './journey.mjs';
const sha256=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export const LEAD_EVENTS=['lead_created','channel_selected'];
export const LEAD_CHANNELS=['whatsapp','call','sms','instagram','facebook'];
// Event sign-ups (event landing pages): only these tags are accepted, so GHL tags stay clean and traceable.
export const EVENT_TAGS={'charla-mommy-makeover-doral-oct2026':'Charla Mommy Makeover · Aromas Med Spa Doral (oct 2026)'};
export const COMPANION={yes:'Sí / Yes',no:'No'};
// Labels are bilingual because the CRM task is read by the care team; times are the visitor's local time.
export const CALL_TIMES={asap:'Lo antes posible / As soon as possible',morning:'Mañana / Morning (8:00–12:00)',afternoon:'Tarde / Afternoon (12:00–17:00)',evening:'Noche / Evening (17:00–20:00)'};
const CHANNEL_LABELS={whatsapp:'WhatsApp',call:'Llamada / Phone call',sms:'SMS',instagram:'Instagram',facebook:'Facebook'};
const ATTRIBUTION=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid'];
const cleanUrl=v=>{if(typeof v!=='string'||!v)return '';try{const u=new URL(v);return /^https?:$/.test(u.protocol)?(u.origin+u.pathname).slice(0,1000):'';}catch{return '';}};
// Per-instance protections supplement hosting limits; durable contact deduplication belongs in the CRM workflow (keyed on phone).
export function createLeadHandler({env=globalThis.process?.env||{},send=(...args)=>fetch(...args),clock=()=>Date.now(),procedures=[]}={}){
 const rate=new Map(),receipts=new Map();
 return async function handle(request,{ip='unknown'}={}){
 if(request.method!=='POST')return json({accepted:false,error:'method_not_allowed'},405);
 const url=new URL(request.url),origin=request.headers.get('origin');if(!origin||origin!==url.origin||request.headers.get('sec-fetch-site')==='cross-site')return json({accepted:false,error:'origin_not_allowed'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({accepted:false,error:'json_required'},415);
 if(Number(request.headers.get('content-length'))>20000)return json({accepted:false,error:'too_large'},413);
 let raw='',reader=request.body?.getReader();if(!reader)return json({accepted:false,error:'empty'},400);let bytes=0;const decoder=new TextDecoder();while(true){const r=await reader.read();if(r.done)break;bytes+=r.value.length;if(bytes>20000){await reader.cancel();return json({accepted:false,error:'too_large'},413);}raw+=decoder.decode(r.value,{stream:true});}raw+=decoder.decode();
 let input;try{input=JSON.parse(raw);}catch{return json({accepted:false,error:'invalid_json'},400);}if(!input||typeof input!=='object'||Array.isArray(input))return json({accepted:false,error:'invalid_data'},400);
 if(input.website)return json({accepted:false,error:'invalid_data'},400);
 const string=(key,max=500)=>typeof input[key]==='string'?input[key].trim().slice(0,max):'';
 const yes=v=>v===true||v==='true'||v==='on';
 const name=string('name',100).replace(/\s+/g,' '),phone=string('phone',30).replace(/[\s().-]/g,''),email=string('email',254),procedure=string('procedure',60),id=string('lead_id',100);
 const event=string('event',40)||'lead_created',eventId=string('event_id',140)||id,channel=string('channel',20),callTime=string('preferred_call_time',20);
 const timezone=/^(?:UTC|[A-Za-z]+(?:\/[-+\w]+){1,2})$/.test(string('timezone',64))?string('timezone',64):'';
 const consentVersion=/^[-\w.]{1,60}$/.test(string('consent_version',60))?string('consent_version',60):'';
 const eventTag=string('event_tag',80),city=string('city',100).replace(/\s+/g,' '),companion=string('companion',5);
 if(eventTag&&(!EVENT_TAGS[eventTag]||!email||!city||!COMPANION[companion])||!eventTag&&companion)return json({accepted:false,error:'invalid_fields'},422);
 if(!name||!/^\+[1-9]\d{6,14}$/.test(phone)||!yes(input.contact_consent)||!['en','es'].includes(input.language)||!['other','undecided',...procedures].includes(procedure)||!/^[-\w]{8,100}$/.test(id)||!/^[-\w]{8,140}$/.test(eventId)||request.headers.get('idempotency-key')!==eventId||email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ||!LEAD_EVENTS.includes(event)||(event==='channel_selected'?!LEAD_CHANNELS.includes(channel):channel&&!LEAD_CHANNELS.includes(channel))||channel==='call'&&!CALL_TIMES[callTime])return json({accepted:false,error:'invalid_fields'},422);
 // Attribution: flat fields from the widget, or first_touch/last_touch objects (legacy consultation form).
 const touch=v=>{if(typeof v==='string'){try{v=JSON.parse(v);}catch{return {};}}return v&&typeof v==='object'&&!Array.isArray(v)?v:{};};
 const first=touch(input.first_touch),last=touch(input.last_touch),t=(o,k)=>typeof o[k]==='string'?o[k].trim().slice(0,500):'';
 const attribution={};for(const k of ATTRIBUTION){const l=string(k+'_last')||t(last,k);attribution[k]=string(k)||l;attribution[k+'_first']=string(k+'_first')||t(first,k);attribution[k+'_last']=l;}
 const now=clock(),received=new Date(now).toISOString(),[firstName,...rest]=name.split(' '),label=string('procedure_label',100)||procedure;
 const preference=channel||'pending',callLabel=channel==='call'?CALL_TIMES[callTime]:'';
 const schedule=channel==='call'?callSchedule(now,callTime,timezone):{call_due_at:'',call_due_at_iso:'',call_window_colombia:''};
 const page=cleanUrl(input.page_url)||cleanUrl(input.conversion_page),path=page?new URL(page).pathname:'';
 const source=[attribution.utm_source,attribution.utm_medium,attribution.utm_campaign].filter(Boolean).join(' / ')||(attribution.gclid||attribution.gbraid||attribution.wbraid?'google ads (click id)':attribution.fbclid?'meta (fbclid)':cleanUrl(input.referrer)?'referral: '+new URL(cleanUrl(input.referrer)).hostname:'direct');
 const headline=eventTag&&event==='lead_created'?'Registro evento: '+EVENT_TAGS[eventTag]:event==='lead_created'?'Nuevo lead web (canal pendiente)':channel==='call'?'Solicitud de llamada':'Eligió '+CHANNEL_LABELS[channel];
 const summary=[headline,name,phone,eventTag&&email?'Email: '+email:'',eventTag?'Ciudad: '+city:'',eventTag?'Acompañante: '+COMPANION[companion]:'',eventTag?'Tag: '+eventTag:'','Procedimiento: '+label,channel==='call'?`Horario preferido: ${callLabel}, hora local del paciente${timezone?' ('+timezone+')':''}`:'',timezone&&channel!=='call'?'Zona horaria: '+timezone:'','Idioma: '+input.language.toUpperCase(),'Fuente: '+source,path?'Página: '+path:'','Lead ID: '+id,channel==='call'?'Llamar: '+schedule.call_window_colombia:''].filter(Boolean).join(' | ');
 const payload={
  event,event_id:eventId,lead_id:id,received_at:received,client_timestamp:string('client_timestamp',40),
  name,full_name:name,first_name:firstName,last_name:rest.join(' '),phone,phone_country:string('phone_country',2),phone_country_code:string('phone_country_code',6),email,
  procedure,procedure_label:label,language:input.language,
  contact_preference:preference,channel,preferred_call_time:channel==='call'?callTime:'',preferred_call_time_label:callLabel,timezone,
  call_due_at:schedule.call_due_at,call_due_at_iso:schedule.call_due_at_iso,call_window_colombia:schedule.call_window_colombia,
  summary,
  page_url:page,page_path:path,page_title:string('page_title',200),button_id:string('button_id',60),form_id:string('form_id',60),
  landing_page:cleanUrl(input.landing_page)||cleanUrl(first.landing_page),referrer:cleanUrl(input.referrer)||cleanUrl(first.referrer),
  landing_url_first:cleanUrl(input.landing_url_first)||cleanUrl(first.landing_page),referrer_first:cleanUrl(input.referrer_first)||cleanUrl(first.referrer),attribution_timestamp:string('attribution_timestamp',40)||t(first,'timestamp'),
  ...attribution,
  ga_client_id:/^\d{1,12}\.\d{1,12}$/.test(string('ga_client_id',30))?string('ga_client_id',30):'',
  contact_consent:true,sms_consent:yes(input.sms_consent),consent_version:consentVersion,consent_text:string('consent_text',600),consent_timestamp:received,measurement_consent:string('measurement_consent',20),
  lead_source:'website',crm_operation:'upsert_contact',deduplication_key:phone,
  // Browsing journey (server/journey.mjs): journey_note is the text for the NinjaSuite "Add To Notes" action.
  ...journeyFields(input.journey,now)};
 // Event sign-up: flat fields for the GHL workflow (Add Tag from event_tag/tags; city and companion to custom fields).
 if(eventTag)Object.assign(payload,{event_tag:eventTag,event_label:EVENT_TAGS[eventTag],tags:eventTag,city,companion,companion_label:COMPANION[companion],lead_source_detail:'event_signup'});
 for(const k of ['country','message','conversion_page'])if(string(k))payload[k]=string(k,k==='message'?3000:1000);
 if(env.LEAD_CAPTURE_ENABLED!=='true'||!env.LEAD_WEBHOOK_URL)return json({accepted:false,error:'not_configured'},503);
 let webhook;try{webhook=new URL(env.LEAD_WEBHOOK_URL);if(webhook.protocol!=='https:')throw Error();}catch{return json({accepted:false,error:'not_configured'},503);}
 for(const[k,v]of receipts)if(v.expires<now)receipts.delete(k);for(const[k,v]of rate)if(v.expires<now)rate.delete(k);
 // Due fields and the "Llamar:" summary suffix follow the server clock, same as received_at: a retry of the same event must not 409 just because a minute passed.
 const cut=payload.summary.lastIndexOf(' | Llamar: '),stableSummary=channel==='call'&&cut>=0?payload.summary.slice(0,cut):payload.summary;
 const fingerprint=await sha256(JSON.stringify({...payload,received_at:'',consent_timestamp:'',client_timestamp:'',call_due_at:'',call_due_at_iso:'',call_window_colombia:'',summary:stableSummary,journey_visits:'',journey_first_visit:'',journey_pages_count:'',journey_pages:'',journey_note:''}));const old=receipts.get(eventId);if(old){if(old.fingerprint!==fingerprint)return json({accepted:false,error:'id_conflict'},409);return (await old.promise).clone();}
 // Two events per visitor (plus retries/extra channels) fit comfortably in 10 requests/min per IP.
 const bucket=rate.get(ip)||{count:0,expires:now+60000};if(bucket.count>=10)return json({accepted:false,error:'too_many_requests'},429);bucket.count++;rate.set(ip,bucket);
 const operation=(async()=>{const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),8000);try{const response=await send(webhook.href,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':eventId},body:JSON.stringify(payload),signal:abort.signal,redirect:'manual'});if(!response.ok)throw Error();return json({accepted:true,lead_id:id,event_id:eventId});}catch{receipts.delete(eventId);return json({accepted:false,error:'delivery_unconfirmed'},502);}finally{clearTimeout(timeout);}})();receipts.set(eventId,{fingerprint,promise:operation,expires:now+300000});const result=await operation;return result.clone();
 };}
