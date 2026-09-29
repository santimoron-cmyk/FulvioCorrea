// Production routing: English is served at the site root. Preview uses the same redirects.
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function build(mode) {
  const run = spawnSync(process.execPath, ['build.mjs', '--' + mode], {stdio: 'inherit'});
  assert.equal(run.status, 0, mode + ' build failed');
}

function redirectTo(pathname, rules) {
  for (const rule of rules) {
    const star = rule.from.indexOf('*');
    if (star >= 0) {
      const prefix = rule.from.slice(0, star), suffix = rule.from.slice(star + 1);
      if (!pathname.startsWith(prefix) || (suffix && !pathname.endsWith(suffix))) continue;
      const splat = pathname.slice(prefix.length, pathname.length - suffix.length);
      return rule.to.replaceAll(':splat', splat);
    }
    if (rule.from === pathname) return rule.to;
  }
  return null;
}

function htmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function fileForPath(pathname) {
  if (pathname === '/') return 'dist/index.html';
  const rel = pathname.replace(/^\//, '').replace(/\/$/, '');
  return path.join('dist', rel, 'index.html');
}

function status(pathname, rules) {
  const dest = redirectTo(pathname, rules);
  if (dest) return {code: 301, location: dest};
  return {code: fs.existsSync(fileForPath(pathname)) ? 200 : 404, location: null};
}

const preview = spawnSync(process.execPath, ['build.mjs', '--preview'], {stdio: 'inherit'});
assert.equal(preview.status, 0, 'preview build failed');
const previewRedirects = fs.readFileSync('dist/_redirects', 'utf8');
const previewRobots = fs.readFileSync('dist/index.html', 'utf8').match(/name="robots" content="([^"]+)"/)[1];

build('production');
const productionRedirects = fs.readFileSync('dist/_redirects', 'utf8');
assert.equal(productionRedirects, previewRedirects, 'preview and production _redirects differ');
const productionRobots = fs.readFileSync('dist/index.html', 'utf8').match(/name="robots" content="([^"]+)"/)[1];
assert.equal(previewRobots, 'noindex, nofollow');
assert.equal(productionRobots, 'index, follow');

const rules = JSON.parse(fs.readFileSync('migration/redirects.json', 'utf8')).redirects;
assert.equal(redirectTo('/', rules), null, '/ must not redirect');
assert.equal(rules.some(r => r.from === '/' || r.to === '/en' || r.to.startsWith('/en/')), false, 'redirect involves /en/ the wrong way');
assert.equal(redirectTo('/en/', rules), '/');
assert.equal(redirectTo('/en', rules), '/');
assert.equal(redirectTo('/en/about/', rules), '/about/');
assert.equal(redirectTo('/en/procedures/bbl/', rules), '/procedures/bbl/');
assert.equal(redirectTo('/en/blog/', rules), '/blog/');
assert.notEqual(redirectTo('/about/', rules), '/en/about/');
assert.ok(rules.every(r => r.to !== '/en' && !String(r.to).startsWith('/en/')), 'a redirect still targets /en/');
for (const [from, to] of [
  ['/plastic-surgery-colombia-cartagena-evaluation-agenda', '/book-consultation/'],
  ['/plastic-surgery-colombia-cartagena-evaluation-agenda/', '/book-consultation/'],
  ['/mammoplasty-es', '/es/procedimientos/reduccion-y-levantamiento-de-senos/'],
  ['/mammoplasty-es/', '/es/procedimientos/reduccion-y-levantamiento-de-senos/'],
  ['/facelift-es', '/es/procedimientos/lifting-facial/'],
  ['/facelift-es/', '/es/procedimientos/lifting-facial/'],
  ['/draft-home-es', '/es/'],
  ['/draft-home-es/', '/es/'],
  ['/home-plastic-surgery-colombia-cartagena-es', '/es/'],
  ['/home-plastic-surgery-colombia-cartagena-es/', '/es/'],
]) assert.equal(redirectTo(from, rules), to, from);

const files = htmlFiles('dist');
assert.ok(files.length > 0);
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href="([^"]*)"/g)) {
    const href = match[1].split(/[?#]/)[0];
    assert.ok(!href.startsWith('/en/') && href !== '/en', file + ' href ' + match[1]);
  }
  const canon = html.match(/rel="canonical" href="([^"]+)"/);
  assert.ok(canon, file + ' missing canonical');
  const pathname = new URL(canon[1]).pathname;
  assert.ok(fs.existsSync(fileForPath(pathname)), file + ' canonical path missing ' + pathname);
  const rel = path.relative('dist', file).split(path.sep).join('/');
  if (rel.endsWith('/index.html') && !rel.startsWith('en/')) {
    const served = rel === 'index.html' ? '/' : '/' + rel.slice(0, -'index.html'.length);
    assert.equal(pathname, served, file + ' canonical is not the served URL');
  }
  const en = html.match(/hreflang="en" href="([^"]+)"/);
  const es = html.match(/hreflang="es" href="([^"]+)"/);
  if (en && es) {
    assert.ok(!new URL(en[1]).pathname.startsWith('/en'), file + ' hreflang en');
    assert.ok(new URL(es[1]).pathname.startsWith('/es/'), file + ' hreflang es');
    assert.ok(fs.existsSync(fileForPath(new URL(en[1]).pathname)), file + ' hreflang en missing');
    assert.ok(fs.existsSync(fileForPath(new URL(es[1]).pathname)), file + ' hreflang es missing');
  }
}

const home = fs.readFileSync('dist/index.html', 'utf8');
const origin = JSON.parse(fs.readFileSync('config.json', 'utf8')).origin;
assert.match(home, new RegExp('rel="canonical" href="' + origin + '/"'));
assert.match(home, new RegExp('hreflang="en" href="' + origin + '/"'));
assert.match(home, new RegExp('hreflang="es" href="' + origin + '/es/"'));
assert.match(home, new RegExp('hreflang="x-default" href="' + origin + '/"'));
assert.match(fs.readFileSync('dist/404.html', 'utf8'), /href="\/"/);
assert.doesNotMatch(fs.readFileSync('dist/404.html', 'utf8'), /href="\/en/);

const samples = ['/', '/about/', '/procedures/bbl/', '/blog/', '/book-consultation/', '/es/', '/es/contacto/', '/en/', '/en/about/', '/en/procedures/bbl/', '/en/blog/', '/en/404/', '/plastic-surgery-colombia-cartagena-evaluation-agenda', '/plastic-surgery-colombia-cartagena-evaluation-agenda/', '/mammoplasty-es', '/mammoplasty-es/', '/facelift-es', '/facelift-es/', '/draft-home-es', '/draft-home-es/', '/home-plastic-surgery-colombia-cartagena-es', '/home-plastic-surgery-colombia-cartagena-es/', '/draft-travel-es', '/draft-travel-es/'];
for (const sample of samples) {
  const result = status(sample, rules);
  const follow = result.location ? status(result.location, rules) : null;
  if (result.code === 301) assert.equal(follow.code, 200, sample + ' redirects to a missing page ' + result.location);
  console.log(sample, result.code, result.location || '');
}
console.log('PASS: production routing. English at root, /en/ redirects forward, canonicals exist. Preview _redirects match.');
