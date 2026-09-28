import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/app.js','utf8');
const memory=new Map();
function visit(url,{consent,procedure,lang='en',store=memory,lead=false}={}){
 const elements={};for(const n of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','landing_page','referrer','first_touch','last_touch','conversion_page','lead_id'])elements[n]={value:'',setAttribute(k,v){this[k]=v;}};
 elements.procedure={options:[{value:'breast-lift-reduction'}],value:'breast-lift-reduction'};elements.website={value:''};elements.namedItem=n=>elements[n]||null;
 const form={id:'consultation-form',elements,dataset:{form:'consultation'},addEventListener(type,fn){(this.listeners||(this.listeners={}))[type]=fn;},reportValidity(){return true;},querySelector(){return {disabled:false};}};
 const banner={hidden:false},privacy={onclick:null},accept={onclick:null},reject={onclick:null},status={textContent:''};
 const menu={getAttribute(){return 'false';},setAttribute(){},onclick:null},nav={classList:{toggle(){},add(){},remove(){}}};
 const nodes=new Map();const scripts=[];let reloaded=false;const listeners={};
 const main=procedure?{dataset:{procedure}}:null;
 const storeGet=k=>store.get(k)||null;if(consent)store.set('fc_consent',JSON.stringify(consent));
 const location=new URL(url);location.assign=href=>{location.assigned=href;};location.reload=()=>{reloaded=true;};
 const context={window:{SITE_CONFIG:lead?{leadEndpoint:'/api/lead'}:{},dataLayer:[]},URL,URLSearchParams,Date,Math,crypto:{randomUUID:()=>'test-id'},FormData:class{*[Symbol.iterator](){yield ['name','Ada Lovelace'];yield ['email','ada@example.com'];yield ['phone','+15551212'];}},AbortController,setTimeout,clearTimeout,fetch:async()=>({ok:true,text:async()=>JSON.stringify({accepted:true})}),location,sessionStorage:{getItem:storeGet,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},localStorage:{getItem:storeGet,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},document:{documentElement:{lang},referrer:'https://example.org/source?private=excluded',head:{append(n){scripts.push(n);if(n.id)nodes.set(n.id,n);}},createElement:()=>({id:'',async:false,src:''}),getElementById(id){if(id==='consultation-form')return form;if(id==='cookie-banner')return banner;if(id==='privacy-settings')return privacy;if(id==='accept-analytics')return accept;if(id==='reject-analytics')return reject;if(id==='form-status')return status;return nodes.get(id)||null;},querySelector(sel){if(sel==='.menu-toggle')return menu;if(sel==='.nav')return nav;if(sel==='main[data-procedure]')return main;return null;},querySelectorAll(){return [];},addEventListener(type,fn){listeners[type]=fn;}}};
 vm.runInNewContext(source,context);
 return {fields:elements,dataLayer:context.window.dataLayer,scripts,accept,reject,listeners,form,status,location,reloaded:()=>reloaded,banner};
}
function consentEntries(layer){return layer.filter(x=>x&&x[0]==='consent');}
function gtmScript(scripts){return scripts.find(s=>String(s.src).includes('gtm.js'));}
let fields=visit('https://practice.test/?utm_source=google&utm_campaign=launch&gclid=click123');
assert.equal(fields.fields.utm_source.value,'google');assert.equal(fields.fields.gclid.value,'click123');
assert.equal(gtmScript(fields.scripts),undefined,'app.js does not inject GTM; the head snippet does');
fields=visit('https://practice.test/book-consultation/');assert.equal(fields.fields.gclid.value,'click123');assert.equal(fields.fields.landing_page.value,'https://practice.test/');assert.equal(fields.fields.referrer.value,'https://example.org/source');
fields=visit('https://practice.test/book-consultation/?utm_source=bing&gbraid=braid123');assert.equal(JSON.parse(fields.fields.first_touch.value).utm_source,'google');assert.equal(fields.fields.utm_source.value,'bing');assert.equal(fields.fields.gbraid.value,'braid123');assert.equal(fields.fields.gclid.value,'');
console.log('Attribution passes: capture, persistence, first/last touch, clean referrer, fresh campaign.');

function boot(url,{consent}={}){
 const html=fs.readFileSync('dist/en/index.html','utf8');
 const snippet=html.match(/<head><script>([\s\S]*?)<\/script>/)[1];
 const scripts=[];const location=new URL(url);
 const session=new Map();if(consent)session.set('fc_consent',JSON.stringify(consent));
 const context={window:{},URL,JSON,Date,location,sessionStorage:{getItem:k=>session.get(k)||null},document:{head:{appendChild(n){scripts.push(n);}},createElement:()=>({id:'',async:false,src:''})}};
 context.window=context;vm.runInNewContext(snippet,context);
 return {dataLayer:context.dataLayer,scripts};
}
const off=['https://fulviocorrea.pages.dev/en/','https://localhost/en/','https://127.0.0.1/en/','https://preview.example/en/'];
for(const url of off){const run=boot(url);assert.equal(gtmScript(run.scripts),undefined,'GTM loaded on '+url);const denied=consentEntries(run.dataLayer);assert.equal(denied[0][1],'default');for(const key of ['ad_storage','ad_user_data','ad_personalization','analytics_storage'])assert.equal(denied[0][2][key],'denied');}
for(const url of ['https://fulviocorrea.com.co/en/','https://www.fulviocorrea.com.co/es/','https://localhost/en/?gtm_debug=1','https://preview.example/en/?gtm_preview=env-1']){
 const run=boot(url);const script=gtmScript(run.scripts);assert.ok(script,'GTM missing on '+url);assert.match(script.src,/id=GTM-K837M7Q6$/);
 const layer=run.dataLayer;const def=layer.findIndex(x=>x&&x[0]==='consent'&&x[1]==='default');const start=layer.findIndex(x=>x&&x.event==='gtm.js');
 assert.ok(def>=0&&def<start,'consent default must precede GTM on '+url);
}
const prior=boot('https://fulviocorrea.com.co/en/',{consent:'granted'});
const priorFlags=consentEntries(prior.dataLayer);assert.equal(priorFlags[1][1],'update');assert.equal(priorFlags[1][2].analytics_storage,'granted');assert.equal(priorFlags[1][2].ad_personalization,'granted');
assert.ok(prior.dataLayer.findIndex(x=>x&&x[1]==='update')<prior.dataLayer.findIndex(x=>x&&x.event==='gtm.js'),'stored consent updates before GTM');
const granted=visit('https://fulviocorrea.com.co/en/procedures/breast-lift-reduction/',{consent:'granted',procedure:'breast-lift-reduction',store:new Map()});
assert.equal(granted.dataLayer.find(x=>x&&x.event==='procedure_view').procedure,'breast-lift-reduction');
assert.equal(granted.dataLayer.find(x=>x&&x.event==='procedure_view').page_lang,'en');
const fresh=visit('https://fulviocorrea.com.co/en/procedures/rhinoplasty/',{procedure:'rhinoplasty',store:new Map()});
assert.equal(fresh.dataLayer.find(x=>x&&x.event==='procedure_view'),undefined,'procedure_view waits for consent');
fresh.accept.onclick();
assert.equal(fresh.dataLayer.find(x=>x&&x.event==='procedure_view').procedure,'rhinoplasty');
assert.equal(consentEntries(fresh.dataLayer).at(-1)[2].ad_user_data,'granted');
const link=(event,extra={})=>({id:extra.id||'',dataset:{event,procedure:extra.procedure||'',location:extra.location||''},matches:()=>true});
fresh.listeners.click({target:{closest:()=>link('whatsapp_click',{id:'footer-whatsapp',location:'footer',procedure:''})}});
fresh.listeners.click({target:{closest:()=>link('phone_click',{id:'header-phone',location:'header'})}});
const wa=fresh.dataLayer.find(x=>x&&x.event==='whatsapp_click');assert.equal(wa.procedure,'rhinoplasty');assert.equal(wa.page_lang,'en');assert.equal(wa.link_location,'footer');
const phone=fresh.dataLayer.find(x=>x&&x.event==='phone_click');assert.equal(phone.link_location,'header');assert.equal(phone.page_lang,'en');
const lead=visit('https://fulviocorrea.com.co/en/book-consultation/',{consent:'granted',store:new Map(),lead:true});
await lead.form.onsubmit({preventDefault(){}});
const submitted=lead.dataLayer.find(x=>x&&x.event==='lead_submit');
assert.equal(submitted.contact_preference,'consultation');assert.equal(submitted.procedure,'breast-lift-reduction');assert.equal(submitted.page_lang,'en');
assert.equal(submitted.name,undefined);assert.equal(submitted.email,undefined);assert.equal(submitted.phone,undefined);
assert.ok(!JSON.stringify(lead.dataLayer).includes('Ada Lovelace'));assert.ok(!JSON.stringify(lead.dataLayer).includes('ada@example.com'));
const html=fs.readFileSync('dist/en/index.html','utf8');
assert.match(html,/<noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-K837M7Q6" height="0" width="0" style="display:none;visibility:hidden"><\/iframe><\/noscript>/);
console.log('GTM passes: hostname gate, debug override, consent default before the container, banner update, procedure_view, whatsapp_click, phone_click, lead_submit without PII, noscript iframe.');
