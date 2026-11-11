import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {procedureRoute} from './routes.mjs';

const keys = {'mommy-makeover': 'mommy', facelift: 'facelift', rhinoplasty: 'rhinoplasty', 'breast-augmentation': 'mammoplasty', 'breast-lift-reduction': 'mammoplasty'};
for (const [slug, key] of Object.entries(keys)) for (const lang of ['en', 'es']) {
  const html = fs.readFileSync('dist' + procedureRoute(lang, slug) + 'index.html', 'utf8');
  assert.match(html, /<video controls playsinline preload="none"/);
  assert.ok(!/<video[^>]*autoplay/.test(html));
  assert.match(html, /"@type":"VideoObject"/);
  assert.match(html, new RegExp(`${key}-${lang}.vtt" srclang="${lang}" label="[^"]+" default`));
  for (const l of ['en', 'es']) {
    const vtt = fs.readFileSync(`dist/assets/${key}-${l}.vtt`, 'utf8');
    assert.ok(vtt.startsWith('WEBVTT'));
    assert.ok(vtt.includes('-->'));
  }
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
}

// Current practice team (data/team.json). Yarima Marquez is no longer on it.
const team = JSON.parse(fs.readFileSync('data/team.json', 'utf8'));
assert.deepEqual(team.members.map(m => m.name), ['Dr. Fulvio Correa', 'Dra. Jennifer Mendoza', 'Dra. Adriana Rojas', 'Eileen']);
for (const lang of ['en', 'es']) {
  const h = fs.readFileSync(`dist/${lang}/index.html`, 'utf8');
  for (const member of team.members) {
    const name = lang === 'en' ? member.name.replace(/^Dra\. /, 'Dr. ') : member.name;
    assert.ok(h.includes(name), `${lang} home is missing ${name}`);
  }
  assert.ok(!h.includes('Yarima'), `${lang} home still names Yarima`);
  assert.ok(!h.includes('contact-copy'));
  assert.ok(!h.includes('contact-message'));
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, {recursive: true, withFileTypes: true})
    .filter(d => d.isFile() && d.name.endsWith('.html'))
    .map(d => path.join(d.parentPath ?? d.path, d.name));
}
for (const file of htmlFiles('dist')) {
  const html = fs.readFileSync(file, 'utf8');
  assert.ok(!/yarima/i.test(html), `${file} still names Yarima`);
}
assert.ok(!fs.readdirSync('dist/assets').some(name => /yarima/i.test(name)), 'a Yarima portrait was copied into dist/assets');
// The native widget posts the lead to the configured endpoint and does not fetch anything else.
const widget = fs.readFileSync('contact-widget.js', 'utf8');
assert.deepEqual(widget.match(/fetch\(/g), ['fetch(']);
assert.match(widget, /fetch\(config\.leadEndpoint,/);
console.log('PASS: bilingual procedure videos, native subtitles, schema, current team and lead-only widget fetch.');
