// Event landing (event-view.mjs): both languages built, noindex + out of sitemap, hreflang pair, Event schema, copy rules and form fields.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin=JSON.parse(fs.readFileSync('config.json','utf8')).origin;
const pages={es:{file:'dist/es/charla-mommy-makeover-doral/index.html',path:'/es/charla-mommy-makeover-doral/',line:'Cualquier valoración médica se realiza directamente con el cirujano, de forma individual.',host:'no realiza el procedimiento'},en:{file:'dist/mommy-makeover-talk-doral/index.html',path:'/mommy-makeover-talk-doral/',line:'Any medical evaluation is done directly with the surgeon, individually.',host:'does not perform the Mommy Makeover procedure'}};
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
for(const [lang,p] of Object.entries(pages)){
 const h=fs.readFileSync(p.file,'utf8'),main=h.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
 assert.match(h,/<meta name="robots" content="noindex, nofollow">/,lang+' noindex');assert.ok(!sitemap.includes(p.path),lang+' not in sitemap');
 assert.ok(h.includes(`hreflang="es" href="${origin}${pages.es.path}"`)&&h.includes(`hreflang="en" href="${origin}${pages.en.path}"`)&&h.includes(`hreflang="x-default" href="${origin}${pages.en.path}"`),lang+' hreflang pair');
 const ev=JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]).find(x=>x['@type']==='Event');
 assert.ok(ev,lang+' Event schema');assert.equal(ev.location.name,'Aromas Med Spa Doral');assert.equal(ev.location.address.postalCode,'33178');assert.equal(ev.url,origin+p.path);
 assert.ok(main.includes(p.line),lang+' medical-evaluation line');assert.ok(main.includes(p.host),lang+' Aromas does not perform the procedure');
 assert.ok(main.includes('27')&&main.includes('29')&&/por confirmar|to be confirmed/.test(main),lang+' tentative dates');
 for(const href of ['https://www.instagram.com/drfulviocorrea/','https://aromaslaser.com/','https://fulviocorrea.com/'])assert.ok(main.includes('href="'+href),lang+' link '+href);
 // Copy rules: no board-certified / virtual assistant, prices, guarantees or US-practice statements.
 const text=main.replace(/<[^>]+>/g,' ');
 assert.doesNotMatch(text,/board[- ]certified|certificad[oa] por la junta|virtual assistant|asistente virtual|\$\s?\d|US\$|USD|COP|garant|guarantee|licen[cs]/i,lang+' banned copy');
 for(const name of ['name','whatsapp','email','city','companion','contact_consent','website'])assert.ok(main.includes(`name="${name}"`),lang+' field '+name);
 assert.ok(main.includes('data-event-tag="charla-mommy-makeover-doral-oct2026"'),lang+' event tag');assert.ok(h.includes('<script defer src="/event-signup.js"></script></body>'),lang+' form script');
 assert.ok(main.includes('/assets/alberto-nader-aromas-med-spa-doral-480.avif')&&main.includes('/assets/aromas-med-spa-doral-logo-white.webp'),lang+' partner images');
}
console.log('PASS: event landing ES/EN — noindex, no sitemap, hreflang pair, Event schema (Aromas Med Spa Doral), copy rules, form fields, event tag and script.');
