import fs from 'node:fs';import assert from 'node:assert/strict';
import {procedureRoute} from './routes.mjs';
const keys={'mommy-makeover':'mommy',facelift:'facelift',rhinoplasty:'rhinoplasty','breast-augmentation':'mammoplasty','breast-lift-reduction':'mammoplasty'};
for(const [slug,key] of Object.entries(keys))for(const lang of ['en','es']){
 const html=fs.readFileSync('dist'+procedureRoute(lang,slug)+'index.html','utf8');assert.match(html,/<video controls playsinline preload="none"/);assert.ok(!/<video[^>]*autoplay/.test(html));assert.match(html,/"@type":"VideoObject"/);assert.match(html,new RegExp(`${key}-${lang}.vtt" srclang="${lang}" label="[^"]+" default`));
 for(const l of ['en','es']){const vtt=fs.readFileSync(`dist/assets/${key}-${l}.vtt`,'utf8');assert.ok(vtt.startsWith('WEBVTT'));assert.ok(vtt.includes('-->'));}assert.equal((html.match(/<h1\b/g)||[]).length,1);
}
for(const lang of ['en','es']){const h=fs.readFileSync(`dist/${lang}/index.html`,'utf8');for(const name of ['Jennifer Mendoza','Adriana Rojas','Yarima Marquez','Eileen'])assert.ok(h.includes(name));assert.ok(!h.includes('contact-copy'));assert.ok(!h.includes('contact-message'));}
assert.ok(!fs.readFileSync('contact-widget.js','utf8').includes('fetch('));console.log('PASS: bilingual procedure videos, native subtitles, schema, complete team and messaging-only widget.');
