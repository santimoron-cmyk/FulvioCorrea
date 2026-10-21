// Fails the suite when a built page, the sitemap, or an external URL is a 404.
// Canonical and hreflang point at fulviocorrea.com; they are checked as files in dist
// so pages that are not on production yet still pass.
import fs from 'node:fs';
import path from 'node:path';

const origin = 'https://fulviocorrea.com';
const dist = 'dist';
const errors = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {recursive: true, withFileTypes: true})
    .filter(d => d.isFile())
    .map(d => path.join(d.parentPath ?? d.path, d.name));
}

function localExists(pathname) {
  let rel = pathname;
  try { rel = decodeURIComponent(pathname); } catch { /* keep raw */ }
  rel = rel.split(/[?#]/)[0];
  if (rel === '/' || rel === '') return fs.existsSync(path.join(dist, 'index.html'));
  const abs = path.join(dist, rel.replace(/^\/+/, ''));
  if (rel.endsWith('/')) return fs.existsSync(path.join(abs, 'index.html'));
  return fs.existsSync(abs);
}

function toLocal(raw) {
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:') || raw.startsWith('data:')) return null;
  let abs;
  try { abs = new URL(raw, origin); } catch { return null; }
  if (abs.origin === origin) return abs.pathname + abs.search;
  if (abs.protocol === 'http:' || abs.protocol === 'https:') return abs.href;
  return null;
}

function add(bag, from, raw) {
  const target = toLocal(raw);
  if (!target) return;
  if (!bag.has(target)) bag.set(target, new Set());
  bag.get(target).add(from);
}

function extract(file, text, bag) {
  for (const m of text.matchAll(/(?:href|src)="([^"]+)"/g)) add(bag, file, m[1]);
  for (const m of text.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u) add(bag, file, u);
    }
  }
  for (const m of text.matchAll(/content="([^"]+)"/g)) {
    if (/^(https?:)?\/\//.test(m[1]) || m[1].startsWith('/')) add(bag, file, m[1]);
  }
  for (const m of text.matchAll(/<loc>([^<]+)<\/loc>/g)) add(bag, file, m[1]);
}

const refs = new Map();
for (const file of walk(dist)) {
  if (!/\.(html|xml)$/.test(file)) continue;
  extract(file, fs.readFileSync(file, 'utf8'), refs);
}

const internal = [];
const external = [];
for (const [target, from] of refs) {
  if (target.startsWith('http://') || target.startsWith('https://')) external.push([target, from]);
  else internal.push([target, from]);
}

for (const [target, from] of internal) {
  const pathname = target.split(/[?#]/)[0];
  if (!localExists(pathname)) errors.push(`missing ${pathname} referenced by ${[...from].slice(0, 3).join(', ')}`);
}

async function statusOf(url) {
  const headers = {'user-agent': 'Mozilla/5.0 (compatible; FulvioLinkCheck/1.0)', accept: '*/*'};
  let last = 0;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      let res = await fetch(url, {method: 'HEAD', redirect: 'follow', headers, signal: ctrl.signal});
      if (res.status === 405 || res.status === 403 || res.status === 400 || res.status === 501) {
        res = await fetch(url, {method: 'GET', redirect: 'follow', headers, signal: ctrl.signal});
      }
      clearTimeout(timer);
      last = res.status;
      if (last !== 429 && last !== 503) return last;
    } catch {
      last = 0;
    }
    await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
  }
  return last;
}

const concurrency = 6;
let cursor = 0;
await Promise.all(Array.from({length: concurrency}, async () => {
  while (cursor < external.length) {
    const i = cursor++;
    const [url, from] = external[i];
    const status = await statusOf(url);
    if (status === 404 || status === 410) errors.push(`${status} ${url} referenced by ${[...from].slice(0, 3).join(', ')}`);
  }
}));

if (errors.length) {
  console.error(errors.join('\n'));
  throw new Error(`${errors.length} broken link${errors.length === 1 ? '' : 's'}`);
}
console.log(`PASS: ${internal.length} internal and ${external.length} external URLs from dist.`);
