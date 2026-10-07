// Event landing: Aromas shell on the public URLs, previous Fulvio shell at -v1.
// Both languages, noindex + out of sitemap, hreflang stays inside each pair.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin=JSON.parse(fs.readFileSync('config.json','utf8')).origin;
const live={
 es:{file:'dist/es/charla-mommy-makeover-doral/index.html',path:'/es/charla-mommy-makeover-doral/',line:'Cualquier valoración médica se realiza directamente con el cirujano, de forma individual.',host:'no realiza el procedimiento',cta:'Reservar mi cupo',bio:'+15 años de experiencia'},
 en:{file:'dist/mommy-makeover-talk-doral/index.html',path:'/mommy-makeover-talk-doral/',line:'Any medical evaluation is done directly with the surgeon, individually.',host:'does not perform the Mommy Makeover procedure',cta:'Save my spot',bio:'15+ years of experience'}
};
const backup={
 es:{file:'dist/es/charla-mommy-makeover-doral-v1/index.html',path:'/es/charla-mommy-makeover-doral-v1/',line:live.es.line,host:live.es.host},
 en:{file:'dist/mommy-makeover-talk-doral-v1/index.html',path:'/mommy-makeover-talk-doral-v1/',line:live.en.line,host:live.en.host}
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
  assert.ok(main.includes('27')&&main.includes('29')&&/por confirmar|to be confirmed/.test(main),label+' '+lang+' tentative dates');
  const text=main.replace(/<[^>]+>/g,' ');
  assert.doesNotMatch(text,/board[- ]certified|certificad[oa] por la junta|virtual assistant|asistente virtual|\$\s?\d|US\$|USD|COP|garant|guarantee|licen[cs]|antes y después|before[- ]and[- ]after/i,label+' '+lang+' banned copy');
  for(const name of ['name','whatsapp','email','city','companion','contact_consent','website'])assert.ok(main.includes(`name="${name}"`),label+' '+lang+' field '+name);
  assert.ok(main.includes('data-event-tag="charla-mommy-makeover-doral-oct2026"'),label+' '+lang+' event tag');
  assert.ok(h.includes('<script defer src="/event-signup.js"></script></body>'),label+' '+lang+' form script');
  assert.ok(main.includes('data-consent-version="event-doral-consent-2026-09-30"'),label+' '+lang+' consent version');
  p.html=h;p.main=main;
 }
}
pair(live,'live');
pair(backup,'backup');
for(const [lang,p] of Object.entries(live)){
 assert.ok(p.html.includes('data-event-shell="aromas"'),lang+' aromas shell');
 assert.ok(p.main.includes(p.cta)&&p.html.includes(`class="sticky"`),lang+' reserve CTA');
 assert.ok(p.main.includes('/assets/alberto-nader-aromas-med-spa-doral-480.avif')&&p.main.includes('/assets/dr-fulvio-correa-plastic-surgeon-cartagena-768.webp'),lang+' both doctor photos');
 assert.ok(p.html.includes('/assets/aromas-logo-original.svg')&&p.html.includes('/assets/aromas-logo-white.svg'),lang+' aromas logos');
 assert.ok(p.main.includes(p.bio),lang+' concept bio');
 assert.ok(!/no se envió|Concept preview|no data was sent/i.test(p.main),lang+' real form, not the concept preview');
 const hero=p.main.slice(0,p.main.indexOf('id="registro"'));
 assert.ok(hero.includes(p.cta)&&hero.includes('alberto-nader')&&hero.includes('dr-fulvio-correa'),lang+' photos and CTA in the hero');
}
for(const [lang,p] of Object.entries(backup)){
 assert.ok(p.main.includes('class="event-hero'),lang+' fulvio shell');
 assert.ok(!p.html.includes('data-event-shell="aromas"'),lang+' backup is not the aromas shell');
 for(const href of ['https://www.instagram.com/drfulviocorrea/','https://aromaslaser.com/','https://fulviocorrea.com/'])assert.ok(p.main.includes('href="'+href),lang+' link '+href);
 assert.ok(p.main.includes('/assets/aromas-med-spa-doral-logo-white.webp'),lang+' v1 partner logo');
}
console.log('PASS: Aromas event landing ES/EN and Fulvio v1 backups — noindex, no sitemap, separate hreflang pairs, Event schema, copy rules, live form.');
