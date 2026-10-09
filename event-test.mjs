// Event landing: Aromas shell on the public URLs, previous Fulvio shell at -v1.
// Both languages, noindex + out of sitemap, hreflang stays inside each pair.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const origin=JSON.parse(fs.readFileSync('config.json','utf8')).origin;
const live={
 es:{file:'dist/es/conversatorio-belleza-estetica-doral/index.html',path:'/es/conversatorio-belleza-estetica-doral/',line:'Cualquier valoración médica se realiza directamente con el cirujano, de forma individual.',host:'no realizamos los procedimientos',cta:'Reservar mi cupo',bio:'+15 años de experiencia',chosen:'te elegimos para este encuentro exclusivo',eyebrow:'Para nuestras clientas preferidas',journey:'Aprender y decidir, con calma.',bites:'vino y picadas',free:'orientación educativa y gratuita',date:'viernes 6 de noviembre de 2026, 6:00 p. m.',travel:'Muchos pacientes del Dr. Correa viajan desde Estados Unidos',unsure:'Aún no lo sé',guest:'Invitado especial',access:'Acceso directo',nonsurgical:'tratamientos no quirúrgicos de belleza y estética',cartagena:'Operarte en Cartagena.',title:'Conversatorio de belleza 2026 · Aromas Med Spa Doral'},
 en:{file:'dist/beauty-aesthetics-talk-doral/index.html',path:'/beauty-aesthetics-talk-doral/',line:'Any medical evaluation is done directly with the surgeon, individually.',host:'do not perform the plastic surgery procedures',cta:'Save my spot',bio:'15+ years of experience',chosen:'we chose you for this exclusive gathering',eyebrow:'For our preferred clients',journey:'Learn and decide, calmly.',bites:'wine and light bites',free:'free educational orientation',date:'Friday, November 6, 2026, 6:00 PM',travel:'Many of Dr. Correa’s patients travel from the United States',unsure:'Not sure yet',guest:'Special guest',access:'Direct access',nonsurgical:'non-surgical beauty and aesthetics treatments',cartagena:'Surgery in Cartagena.',title:'Beauty and aesthetics talk 2026 · Aromas Med Spa Doral'}
};
const backup={
 es:{file:'dist/es/charla-mommy-makeover-doral-v1/index.html',path:'/es/charla-mommy-makeover-doral-v1/',line:live.es.line,host:'no realiza el procedimiento'},
 en:{file:'dist/mommy-makeover-talk-doral-v1/index.html',path:'/mommy-makeover-talk-doral-v1/',line:live.en.line,host:'does not perform the Mommy Makeover procedure'}
};
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
function pair(pages,label){
 for(const [lang,p] of Object.entries(pages)){
  const h=fs.readFileSync(p.file,'utf8'),main=h.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  assert.match(h,/<meta name="robots" content="noindex, nofollow">/,label+' '+lang+' noindex');
  assert.ok(!sitemap.includes(p.path),label+' '+lang+' not in sitemap');
  assert.ok(h.includes(`hreflang="es" href="${origin}${pages.es.path}"`)&&h.includes(`hreflang="en" href="${origin}${pages.en.path}"`)&&h.includes(`hreflang="x-default" href="${origin}${pages.en.path}"`),label+' '+lang+' hreflang pair');
  const foreign=pages===live?backup:live;
  assert.ok(!h.includes(`hreflang="en" href="${origin}${foreign.en.path}"`)&&!h.includes(`hreflang="es" href="${origin}${foreign.es.path}"`),label+' '+lang+' hreflang stays in its pair');
  const ev=JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]).find(x=>x['@type']==='Event');
  assert.ok(ev,label+' '+lang+' Event schema');assert.equal(ev.location.name,'Aromas Med Spa Doral');assert.equal(ev.location.address.postalCode,'33178');assert.equal(ev.url,origin+p.path);
  assert.ok(main.includes(p.line),label+' '+lang+' medical-evaluation line');assert.ok(main.includes(p.host),label+' '+lang+' Aromas does not perform the procedure');
  const text=main.replace(/<[^>]+>/g,' ');
  assert.doesNotMatch(text,/board[- ]certified|certificad[oa] por la junta|virtual assistant|asistente virtual|\$\s?\d|US\$|USD|COP|garant|guarantee|licen[cs]|antes y después|before[- ]and[- ]after|\bbest\b/i,label+' '+lang+' banned copy');
  for(const name of ['name','whatsapp','email','city','companion','contact_consent','website'])assert.ok(main.includes(`name="${name}"`),label+' '+lang+' field '+name);
  assert.ok(h.includes('<script defer src="/event-signup.js"></script></body>'),label+' '+lang+' form script');
  assert.ok(main.includes('data-consent-version="event-doral-consent-2026-09-30"'),label+' '+lang+' consent version');
  p.html=h;p.main=main;p.event=ev;
 }
}
pair(live,'live');
pair(backup,'backup');
for(const [lang,p] of Object.entries(live)){
 assert.ok(p.html.includes('data-event-shell="aromas"'),lang+' aromas shell');
 assert.ok(p.main.includes('data-event-tag="conversatorio-belleza-estetica-doral-nov2026"'),lang+' event tag');
 assert.ok(p.main.includes(p.cta)&&p.html.includes(`class="sticky"`),lang+' reserve CTA');
 assert.ok(p.main.includes('/assets/alberto-nader-aromas-med-spa-doral-480.avif')&&p.main.includes('/assets/dr-fulvio-correa-plastic-surgeon-cartagena-768.webp'),lang+' both doctor photos');
 assert.ok(p.html.includes('/assets/aromas-logo-original.svg')&&p.html.includes('/assets/aromas-logo-white.svg'),lang+' aromas logos');
 assert.ok(p.main.includes(p.bio),lang+' concept bio');
 assert.ok(!/no se envió|Concept preview|no data was sent/i.test(p.main),lang+' real form, not the concept preview');
 const hero=p.main.slice(0,p.main.indexOf('id="registro"'));
 const h1=hero.match(/<h1>[\s\S]*?<\/h1>/)[0];
 assert.ok(!/mommy makeover/i.test(h1),lang+' Mommy Makeover is not the headline');
 assert.ok(hero.includes(p.cta)&&hero.includes('alberto-nader')&&hero.includes('dr-fulvio-correa'),lang+' photos and CTA in the hero');
 assert.ok(hero.includes(p.eyebrow)&&hero.includes(p.chosen)&&hero.includes(p.free)&&hero.includes(p.bites)&&hero.includes(p.date),lang+' preferred-client intro and confirmed date in the hero');
 assert.ok(!/27 al 29|October 27|por confirmar|to be confirmed|bebidas y pasabocas|drinks and light bites/i.test(p.html),lang+' old date and drinks wording are gone');
 assert.equal(p.event.startDate,'2026-11-06T18:00:00-05:00',lang+' Event start');
 assert.ok(p.event.description.includes(p.date),lang+' JSON-LD description uses Friday');
 assert.ok(p.html.includes(`<meta name="description" content="${p.event.description.replaceAll('"','&quot;')}">`),lang+' meta description');
 assert.ok(p.html.includes(`property="og:description" content="${p.event.description.replaceAll('"','&quot;')}"`),lang+' OG description');
 assert.ok(!/jueves 6 de noviembre de 2026|Thursday, November 6, 2026/.test(p.html),lang+' Thursday wording is gone');
 assert.ok(!String(p.event.endDate||'').includes('2026-10'),lang+' October window removed');
 assert.ok(p.event.name===p.title,lang+' schema name');
 assert.ok(p.html.includes(`<title>${p.title}</title>`),lang+' title');
 assert.ok(p.html.includes(p.date)&&p.html.includes(p.bites),lang+' date and wine in meta or body');
 assert.ok(p.main.includes(lang==='es'?'Cirujano plástico en Cartagena':'Plastic surgeon in Cartagena'),lang+' Fulvio stays in third person');
 assert.ok(p.main.includes(p.guest),lang+' Fulvio is the special guest');
 assert.ok(p.main.includes('id="que-es"')&&p.main.includes(p.journey)&&p.main.includes(p.bites)&&p.main.includes(p.nonsurgical)&&p.main.includes(lang==='es'?'No es una consulta médica':'not a medical consultation'),lang+' educational explanation');
 const heroH1=p.main.slice(0,p.main.indexOf('id="registro"')).match(/<h1>[\s\S]*?<\/h1>/)[0];
 assert.ok(!/Cartagena/i.test(heroH1),lang+' Cartagena is not the headline');
 const card=p.main.slice(p.main.indexOf('id="otros"'),p.main.indexOf('id="charla"'));
 assert.ok(card.includes(p.cartagena)&&card.includes(p.travel),lang+' Cartagena is one short card');
 assert.ok(p.main.includes(p.access),lang+' direct access');
 assert.ok(p.main.includes('name="procedure_interest"')&&!/name="procedure_interest"[^>]*required/.test(p.main),lang+' optional interest select');
 for(const value of ['non-surgical','breast','abdomen-contour','face','mommy-makeover','undecided'])assert.ok(p.main.includes(`value="${value}"`),lang+' interest option '+value);
 assert.ok(!/value="lipo-contour"|value="other"|value="abdomen"/.test(p.main),lang+' old interest values are gone');
 assert.ok(p.main.includes(p.unsure),lang+' not sure yet option');
 assert.ok(!hero.includes('bio-photo'),lang+' hero portraits stay arched');
 const bios=p.main.slice(p.main.indexOf('class="bios"'));
 assert.ok(bios.includes('class="bio-photo bio-fulvio"')&&bios.includes('class="bio-photo bio-nader"'),lang+' circular bio frames');
 assert.match(p.html,/\.bio-photo\{[^}]*width:120px;height:120px;[^}]*border-radius:50%/,lang+' equal circular bio size');
 assert.match(p.html,/\.bio-photo img\{[^}]*object-fit:cover/,lang+' bio photos cover without stretch');
 assert.match(p.html,/\.bio-fulvio img\{object-position:center 8%\}/,lang+' Fulvio face position');
 assert.match(p.html,/\.bio-nader img\{object-position:center 4%\}/,lang+' Nader face position');
 assert.ok(p.main.includes(lang==='es'?'Te recibimos en Aromas Med Spa, Doral.':'We welcome you at Aromas Med Spa, Doral.'),lang+' Aromas welcomes you in Doral');
}
const signup=fs.readFileSync('event-signup.js','utf8');
assert.ok(signup.includes('viernes 6 de noviembre de 2026, 6:00 p. m.')&&signup.includes('vino y picadas'),'ES confirmation');
assert.ok(signup.includes('Friday, November 6, 2026, 6:00 PM')&&signup.includes('wine and light bites'),'EN confirmation');
assert.ok(!/jueves 6 de noviembre de 2026|Thursday, November 6, 2026/.test(signup),'confirmation weekday is Friday');
assert.ok(signup.includes("hasInterest?(labels[picked]?picked:'undecided'):''")&&signup.includes("procedure=hasInterest?interest:'mommy-makeover'"),'live procedure follows interest; v1 stays mommy-makeover');
assert.ok(signup.includes("if(hasInterest)body.procedure_interest=interest")&&signup.includes("UTM_KEY='fc_event_utm'"),'procedure_interest always sent; landing UTMs persist');
for(const [lang,p] of Object.entries(backup)){
 assert.ok(p.main.includes('data-event-tag="charla-mommy-makeover-doral-oct2026"'),lang+' backup keeps its event tag');
 assert.ok(p.main.includes('27')&&p.main.includes('29')&&/por confirmar|to be confirmed/.test(p.main),lang+' backup keeps tentative dates');
 assert.ok(!p.html.includes('id="que-es"')&&!p.main.includes('id="otros"')&&!p.main.includes('name="procedure_interest"'),lang+' backup keeps the previous copy');
 assert.ok(p.main.includes('class="event-hero'),lang+' fulvio shell');
 assert.ok(!p.html.includes('data-event-shell="aromas"'),lang+' backup is not the aromas shell');
 assert.ok(!p.html.includes('viernes 6 de noviembre de 2026')&&!p.html.includes('Friday, November 6, 2026'),lang+' backup keeps its own dates');
 for(const href of ['https://www.instagram.com/drfulviocorrea/','https://aromaslaser.com/','https://fulviocorrea.com/'])assert.ok(p.main.includes('href="'+href),lang+' link '+href);
 assert.ok(p.main.includes('/assets/aromas-med-spa-doral-logo-white.webp'),lang+' v1 partner logo');
 assert.ok(!fs.existsSync(lang==='es'?'dist/es/charla-mommy-makeover-doral/index.html':'dist/mommy-makeover-talk-doral/index.html'),lang+' old live path is not a page');
 assert.ok(!fs.existsSync(lang==='es'?'dist/es/charla-cirugia-cartagena-doral/index.html':'dist/plastic-surgery-cartagena-talk-doral/index.html'),lang+' previous staging path is not a page');
}
const rules=JSON.parse(fs.readFileSync('migration/redirects.json','utf8')).redirects;
assert.equal(rules.find(r=>r.from==='/mommy-makeover-talk-doral/')?.to,'/beauty-aesthetics-talk-doral/');
assert.equal(rules.find(r=>r.from==='/es/charla-mommy-makeover-doral/')?.to,'/es/conversatorio-belleza-estetica-doral/');
assert.equal(rules.find(r=>r.from==='/plastic-surgery-cartagena-talk-doral/')?.to,'/beauty-aesthetics-talk-doral/');
assert.equal(rules.find(r=>r.from==='/es/charla-cirugia-cartagena-doral/')?.to,'/es/conversatorio-belleza-estetica-doral/');
assert.equal(rules.find(r=>r.from==='/en/plastic-surgery-cartagena-talk-doral/')?.to,'/beauty-aesthetics-talk-doral/');
assert.equal(rules.find(r=>r.from==='/es/charla-mommy-makeover-doral-v1/')?.to,undefined,'v1 Spanish path is the page, not a redirect away');
console.log('PASS: Aromas event landing ES/EN and Fulvio v1 backups — noindex, no sitemap, separate hreflang pairs, Event schema, copy rules, live form.');

function bootSignup({lang='es',shell='aromas',href,storage=new Map(),interest}={}){
 const requests=[];const listeners={};
 const el=(value,extra={})=>({value,checked:false,disabled:false,type:'text',validation:'',validity:{customError:false},dataset:{},textContent:'',setCustomValidity(v){this.validation=v;this.validity.customError=!!v;},addEventListener(){},...extra});
 const name=el(lang==='es'?'Ana López':'Ana Lopez'),phone=el('+1 305 555 0123'),email=el('ana@example.com'),city=el('Doral'),website=el(''),companion=el('no'),consent=el('',{checked:true,type:'checkbox'}),button=el('',{type:'submit'});
 const select=interest===undefined?null:el(interest);
 const consentSpan={dataset:{consentVersion:'event-doral-consent-2026-09-30'},textContent:'contact consent'};
 const status={textContent:'',className:''};
 const elements={name,whatsapp:phone,email,city,website,companion,contact_consent:consent};
 if(select)elements.procedure_interest=select;
 const form={dataset:{eventTag:shell==='aromas'?'conversatorio-belleza-estetica-doral-nov2026':'charla-mommy-makeover-doral-oct2026'},elements,addEventListener(type,fn){listeners[type]=fn;},checkValidity(){return !phone.validation;},reportValidity(){},querySelector(sel){return sel==='[data-consent-version]'?consentSpan:null;},querySelectorAll(){return [name,phone,email,city,button,select].filter(Boolean);}};
 const sessionStorage={getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,String(v))};
 const location=new URL(href);
 const document={documentElement:{lang},body:{dataset:{eventShell:shell}},title:lang==='es'?'Cirugía en Cartagena':'Surgery in Cartagena',referrer:'',cookie:'',getElementById(id){return id==='event-signup-form'?form:id==='event-signup-status'?status:id==='event-signup-submit'?button:null;}};
 const context={document,sessionStorage,localStorage:{getItem:()=>null},location,window:{dataLayer:[]},URL,URLSearchParams,fetch:async(url,options)=>{requests.push({url,body:JSON.parse(options.body)});return {ok:true,text:async()=>JSON.stringify({accepted:true})};},AbortController,setTimeout,clearTimeout,crypto:{randomUUID:()=>'11111111-1111-4111-8111-111111111111'},Intl};
 vm.runInNewContext(fs.readFileSync('event-signup.js','utf8'),context);
 return {requests,status,storage,submit:()=>listeners.submit({preventDefault(){}})};
}
const talk='https://fulviocorrea.com/es/conversatorio-belleza-estetica-doral/?utm_source=instagram&utm_medium=social&utm_campaign=doral-nov';
let page=bootSignup({href:talk,interest:''});
assert.deepEqual(JSON.parse(page.storage.get('fc_event_utm')),{utm_source:'instagram',utm_medium:'social',utm_campaign:'doral-nov'},'landing UTMs stored for the tab');
await page.submit();
let body=page.requests[0].body;
for(const [k,v] of Object.entries({procedure_interest:'undecided',procedure:'undecided',procedure_label:'Aún no lo sé / Not sure yet',language:'es',event_tag:'conversatorio-belleza-estetica-doral-nov2026',utm_source:'instagram',utm_medium:'social',utm_campaign:'doral-nov',utm_source_last:'instagram',utm_medium_last:'social',utm_campaign_last:'doral-nov',form_id:'event-signup',event:'lead_created'}))assert.equal(body[k],v,'signup.'+k);
assert.match(page.status.textContent,/viernes 6 de noviembre de 2026, 6:00 p\. m\./,'ES confirmation after submit');
const kept=page.storage;
page=bootSignup({href:'https://fulviocorrea.com/es/conversatorio-belleza-estetica-doral/',storage:kept,interest:''});
await page.submit();
body=page.requests[0].body;
assert.equal(body.utm_source,'instagram');assert.equal(body.utm_medium,'social');assert.equal(body.utm_campaign,'doral-nov','UTMs survive a reload without the query string');
page=bootSignup({href:talk,interest:'breast'});
await page.submit();
body=page.requests[0].body;
assert.equal(body.procedure_interest,'breast');assert.equal(body.procedure,'breast');assert.equal(body.procedure_label,'Cirugía de busto / Breast surgery');
page=bootSignup({href:talk,interest:'non-surgical'});
await page.submit();
body=page.requests[0].body;
assert.equal(body.procedure_interest,'non-surgical');assert.equal(body.procedure,'non-surgical');assert.equal(body.procedure_label,'Tratamientos no quirúrgicos / Non-surgical treatments');assert.equal(body.event_tag,'conversatorio-belleza-estetica-doral-nov2026');
const prior=new Map([['fc_attribution',JSON.stringify({last_touch:{utm_source:'google',utm_medium:'cpc',utm_campaign:'search',gclid:'g1'},first_touch:{utm_source:'first'}})]]);
page=bootSignup({lang:'en',href:'https://fulviocorrea.com/beauty-aesthetics-talk-doral/',interest:'face',storage:prior});
await page.submit();
body=page.requests[0].body;
assert.equal(body.language,'en');assert.equal(body.procedure_interest,'face');assert.equal(body.procedure,'face');assert.equal(body.utm_source,'google');assert.equal(body.utm_medium,'cpc');assert.equal(body.utm_campaign,'search');assert.equal(body.gclid,'g1');assert.equal(body.utm_source_first,'first');
assert.match(page.status.textContent,/Friday, November 6, 2026, 6:00 PM/,'EN confirmation after submit');
const override=new Map(prior);
page=bootSignup({lang:'en',href:'https://fulviocorrea.com/beauty-aesthetics-talk-doral/?utm_source=meta&utm_medium=paid&utm_campaign=talk',interest:'undecided',storage:override});
await page.submit();
body=page.requests[0].body;
assert.equal(body.procedure_interest,'undecided');assert.equal(body.procedure,'undecided');assert.equal(body.procedure_label,'Aún no lo sé / Not sure yet');
assert.equal(body.utm_source,'meta');assert.equal(body.utm_medium,'paid');assert.equal(body.utm_campaign,'talk','landing query wins over an older last touch');assert.equal(body.utm_source_first,'first');
page=bootSignup({shell:'fulvio',href:'https://fulviocorrea.com/es/charla-mommy-makeover-doral-v1/'});
await page.submit();
body=page.requests[0].body;
assert.equal(body.procedure,'mommy-makeover');assert.equal(body.procedure_label,'Mommy Makeover');assert.equal(body.procedure_interest,undefined,'v1 form has no interest select');
assert.equal(body.event_tag,'charla-mommy-makeover-doral-oct2026');
assert.ok(!page.status.textContent.includes('viernes 6 de noviembre'),'v1 confirmation is unchanged');
console.log('PASS: event sign-up sends procedure_interest (default undecided), keeps procedure/procedure_label, landing UTMs, language and event_tag.');
