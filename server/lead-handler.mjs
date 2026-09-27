// Runtime-neutral (Node 20+, Cloudflare Workers/Pages Functions): Web Crypto + fetch only, no node: imports.
const sha256=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
// Per-instance protections supplement hosting limits; durable contact deduplication belongs in the CRM workflow.
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
 const name=string('name',100),phone=string('phone',30).replace(/[\s().-]/g,''),email=string('email',254),procedure=string('procedure',60),id=string('lead_id',100);
 const yes=v=>v===true||v==='true'||v==='on';
 if(!name||!/^\+[1-9]\d{6,14}$/.test(phone)||!yes(input.contact_consent)||!['en','es'].includes(input.language)||!['other','undecided',...procedures].includes(procedure)||!/^[-\w]{8,100}$/.test(id)||request.headers.get('idempotency-key')!==id||email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({accepted:false,error:'invalid_fields'},422);
 const touch=v=>{if(typeof v==='string'){try{v=JSON.parse(v);}catch{return {};}}if(!v||typeof v!=='object')return {};return Object.fromEntries(['timestamp','landing_page','referrer','utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid'].filter(k=>typeof v[k]==='string').map(k=>[k,v[k].slice(0,1000)]));};
 const payload={name,phone,email,procedure,language:input.language,lead_id:id,contact_consent:true,sms_consent:yes(input.sms_consent),consent_timestamp:new Date(clock()).toISOString(),first_touch:touch(input.first_touch),last_touch:touch(input.last_touch),crm_operation:'upsert_contact',deduplication_key:phone};
 for(const k of ['country','message','phone_country','phone_country_code','channel','form_id','utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','landing_page','referrer','conversion_page','measurement_consent'])payload[k]=string(k,k==='message'?3000:1000);
 if(env.LEAD_CAPTURE_ENABLED!=='true'||!env.LEAD_WEBHOOK_URL)return json({accepted:false,error:'not_configured'},503);
 let webhook;try{webhook=new URL(env.LEAD_WEBHOOK_URL);if(webhook.protocol!=='https:')throw Error();}catch{return json({accepted:false,error:'not_configured'},503);}
 const now=clock();for(const[k,v]of receipts)if(v.expires<now)receipts.delete(k);for(const[k,v]of rate)if(v.expires<now)rate.delete(k);
 const fingerprint=await sha256(JSON.stringify({...payload,consent_timestamp:''}));const old=receipts.get(id);if(old){if(old.fingerprint!==fingerprint)return json({accepted:false,error:'id_conflict'},409);return (await old.promise).clone();}
 const bucket=rate.get(ip)||{count:0,expires:now+60000};if(bucket.count>=5)return json({accepted:false,error:'too_many_requests'},429);bucket.count++;rate.set(ip,bucket);
 const operation=(async()=>{const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),8000);try{const response=await send(webhook.href,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':id},body:JSON.stringify(payload),signal:abort.signal,redirect:'manual'});if(!response.ok)throw Error();return json({accepted:true,lead_id:id});}catch{receipts.delete(id);return json({accepted:false,error:'delivery_unconfirmed'},502);}finally{clearTimeout(timeout);}})();receipts.set(id,{fingerprint,promise:operation,expires:now+300000});const result=await operation;return result.clone();
 };}
