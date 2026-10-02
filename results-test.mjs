import assert from 'node:assert/strict';
import fs from 'node:fs';
import {resultsViews} from './results-view.mjs';
import {localizePath,procedureRoute,publicPath} from './routes.mjs';
const saved=process.env.SITE_ENV;
const image=(file,alt)=>`<img src="/assets/${file}" alt="${alt}">`;
const specimen={authorized:true,before:'fixture-before.webp',after:'fixture-after.webp',procedure:'liposuction',title:{en:'Test case'},caption:{en:'Approved explanation'},details:{en:'Additional approved detail'},interval:{en:'Recorded follow-up interval'}};
process.env.SITE_ENV='production';
assert.equal(resultsViews('en',{authorized:false,items:[specimen]},image).hasCases,false);
assert.doesNotMatch(resultsViews('en',{authorized:true,items:[{...specimen,authorized:false}]},image).gallery,/data-result-slider|fixture-before/);
const live=resultsViews('en',{authorized:true,items:[specimen]},image);
assert.ok(live.hasCases);
for(const token of ['fixture-before.webp','fixture-after.webp','data-result-slider','Approved explanation','Additional approved detail','Recorded follow-up interval'])assert.ok(live.gallery.includes(token),token);
assert.doesNotMatch(live.gallery,/result-demo/);
process.env.SITE_ENV='preview';
assert.doesNotMatch(resultsViews('es',{authorized:false,items:[]},image).gallery,/data-result-slider|result-demo/,'preview content matches production');
process.env.RESULTS_DEMO='1';assert.match(resultsViews('es',{authorized:false,items:[]},image).gallery,/result-demo/);delete process.env.RESULTS_DEMO;
if(saved===undefined)delete process.env.SITE_ENV;else process.env.SITE_ENV=saved;
const pages=JSON.parse(fs.readFileSync('pages.json'));
for(const page of pages){const html=fs.readFileSync(page.file,'utf8');
 assert.doesNotMatch(html,/<a\b[^>]*href="\/(?:en\/book-consultation|es\/agendar-valoracion)\//,page.route+' exposes legacy form');
 if(/\/(?:book-consultation|agendar-valoracion)\//.test(page.route)){assert.ok(page.noindex);assert.match(html,/name="robots" content="noindex, nofollow"/);}
 if(page.ads)assert.doesNotMatch(html,/<form id="consultation-form"/);
 for(const a of html.matchAll(/<a\b[^>]*href="https:\/\/wa\.me\/[^>]*>/g))assert.match(a[0],/data-contact-channel|data-whatsapp="direct"/,page.route+' bypasses intake');
}
for(const lang of ['en','es']){const hub=fs.readFileSync('dist'+localizePath(`/${lang}/procedures/`)+'index.html','utf8').split('<main id="main">')[1].split('</main>')[0];
 for(const file of fs.readdirSync('content/procedures').filter(f=>f.endsWith('.'+lang+'.json'))){const p=JSON.parse(fs.readFileSync('content/procedures/'+file));if(p.offeredConfirmed)assert.ok(hub.includes(`href="${publicPath(procedureRoute(lang,p.slug))}"`),file+' missing from hub');}
}
console.log('PASS: case authorization, before/after images and clinical captions, preview matches production (demo only with RESULTS_DEMO=1), Sofia CTA routing, private noindex forms, complete bilingual procedure hubs.');
