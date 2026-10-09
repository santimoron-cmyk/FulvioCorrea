// Event landing: Aromas shell on the public URLs, previous Fulvio shell at -v1.
// Both languages, noindex + out of sitemap, hreflang stays inside each pair.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin=JSON.parse(fs.readFileSync('config.json','utf8')).origin;
const live={
 es:{file:'dist/es/charla-cirugia-cartagena-doral/index.html',path:'/es/charla-cirugia-cartagena-doral/',line:'Cualquier valoración médica se realiza directamente con el cirujano, de forma individual.',host:'no realizamos los procedimientos',cta:'Reservar mi cupo',bio:'+15 años de experiencia',chosen:'te elegimos para este encuentro exclusivo',eyebrow:'Para nuestras clientas preferidas',journey:'Operarte en Cartagena, con calma.',bites:'vino y picadas',free:'orientación educativa y gratuita',date:'jueves 6 de noviembre de 2026, 6:00 p. m.',travel:'Muchos pacientes del Dr. Correa viajan desde Estados Unidos',unsure:'Aún no lo sé',guest:'Invitado especial'},
 en:{file:'dist/plastic-surgery-cartagena-talk-doral/index.html',path:'/plastic-surgery-cartagena-talk-doral/',line:'Any medical evaluation is done directly with the surgeon, individually.',host:'do not perform the plastic surgery procedures',cta:'Save my spot',bio:'15+ years of experience',chosen:'we chose you for this exclusive gathering',eyebrow:'For our preferred clients',journey:'Surgery in Cartagena, calmly explained.',bites:'wine and light bites',free:'free educational orientation',date:'Thursday, November 6, 2026, 6:00 PM',travel:'Many of Dr. Correa’s patients travel from the United States',unsure:'Not sure yet',guest:'Special guest'}
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
 assert.ok(p.main.includes('data-event-tag="charla-cirugia-cartagena-doral-nov2026"'),lang+' event tag');
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
 assert.ok(!String(p.event.endDate||'').includes('2026-10'),lang+' October window removed');
 assert.ok(p.event.name=== (lang==='es'?'Cirugía en Cartagena · Aromas Med Spa Doral':'Surgery in Cartagena · Aromas Med Spa Doral'),lang+' schema name');
 assert.ok(p.html.includes(p.date)&&p.html.includes(p.bites),lang+' date and wine in meta or body');
 assert.ok(p.main.includes(lang==='es'?'Cirujano plástico en Cartagena':'Plastic surgeon in Cartagena'),lang+' Fulvio stays in third person');
 assert.ok(p.main.includes(p.guest),lang+' Fulvio is the special guest');
 assert.ok(p.main.includes('id="que-es"')&&p.main.includes(p.journey)&&p.main.includes(p.bites)&&p.main.includes(p.travel)&&p.main.includes(lang==='es'?'No es una consulta médica':'not a medical consultation'),lang+' journey explanation');
 assert.ok(p.main.includes('id="otros"')&&p.main.includes(lang==='es'?'El que tú quieres o necesitas.':'The one you want or need.'),lang+' procedure is whatever each person needs');
 for(const item of (lang==='es'?['Cirugía de busto','Abdominoplastia','Liposucción y contorno corporal','rinoplastia, párpados','Mommy Makeover']:['Breast surgery','Tummy tuck (abdominoplasty)','Liposuction and body contouring','rhinoplasty, eyelids','Mommy Makeover']))assert.ok(p.main.includes(item),lang+' lists '+item);
 assert.ok(p.main.includes('name="procedure_interest"')&&!/name="procedure_interest"[^>]*required/.test(p.main),lang+' optional interest select');
 for(const value of ['mommy-makeover','breast','abdomen','lipo-contour','face','other','undecided'])assert.ok(p.main.includes(`value="${value}"`),lang+' interest option '+value);
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
assert.ok(signup.includes('jueves 6 de noviembre de 2026, 6:00 p. m.')&&signup.includes('vino y picadas'),'ES confirmation');
assert.ok(signup.includes('Thursday, November 6, 2026, 6:00 PM')&&signup.includes('wine and light bites'),'EN confirmation');
assert.ok(signup.includes("hasInterest?(labels[interest]?interest:'undecided'):'mommy-makeover'"),'live procedure follows interest; v1 stays mommy-makeover');
for(const [lang,p] of Object.entries(backup)){
 assert.ok(p.main.includes('data-event-tag="charla-mommy-makeover-doral-oct2026"'),lang+' backup keeps its event tag');
 assert.ok(p.main.includes('27')&&p.main.includes('29')&&/por confirmar|to be confirmed/.test(p.main),lang+' backup keeps tentative dates');
 assert.ok(!p.html.includes('id="que-es"')&&!p.main.includes('id="otros"')&&!p.main.includes('name="procedure_interest"'),lang+' backup keeps the previous copy');
 assert.ok(p.main.includes('class="event-hero'),lang+' fulvio shell');
 assert.ok(!p.html.includes('data-event-shell="aromas"'),lang+' backup is not the aromas shell');
 for(const href of ['https://www.instagram.com/drfulviocorrea/','https://aromaslaser.com/','https://fulviocorrea.com/'])assert.ok(p.main.includes('href="'+href),lang+' link '+href);
 assert.ok(p.main.includes('/assets/aromas-med-spa-doral-logo-white.webp'),lang+' v1 partner logo');
 assert.ok(!fs.existsSync(lang==='es'?'dist/es/charla-mommy-makeover-doral/index.html':'dist/mommy-makeover-talk-doral/index.html'),lang+' old live path is not a page');
}
const rules=JSON.parse(fs.readFileSync('migration/redirects.json','utf8')).redirects;
assert.equal(rules.find(r=>r.from==='/mommy-makeover-talk-doral/')?.to,'/plastic-surgery-cartagena-talk-doral/');
assert.equal(rules.find(r=>r.from==='/es/charla-mommy-makeover-doral/')?.to,'/es/charla-cirugia-cartagena-doral/');
assert.equal(rules.find(r=>r.from==='/es/charla-mommy-makeover-doral-v1/')?.to,undefined,'v1 Spanish path is the page, not a redirect away');
console.log('PASS: Aromas event landing ES/EN and Fulvio v1 backups — noindex, no sitemap, separate hreflang pairs, Event schema, copy rules, live form.');
