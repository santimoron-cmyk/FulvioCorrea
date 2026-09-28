// Image pipeline for the static build: semantic names, responsive WebP variants,
// Open Graph crops, and icons from the logo emblem. Sources stay in assets/.
// Variants, icons and OG files are written only into dist/.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {imageSize} from './assets.mjs';

export const IMAGE_RENAMES = {
  '84-home-1-11.webp': 'banner-woman-shoulders.webp',
  '84-home-1-10.webp': 'portrait-woman-hands-on-cheeks.webp',
  '84-home-1-5-2.webp': 'back-view-white-swimsuit.webp',
  '84-home-1-1.webp': 'hero-woman-floral-portrait.webp',
  '84-home-1-2.webp': 'portrait-woman-hand-on-neck.webp',
  '84-home-1-7.webp': 'torso-black-swimsuit.webp',
  '84-home-1-8.webp': 'face-with-eyelid-markings.webp',
  '84-home-1-9.webp': 'back-view-beige-bodysuit.webp',
  '84-treatment-1.webp': 'nose-with-surgical-markings.webp',
  '84-treatment-2.webp': 'woman-holding-orange-bodysuit.webp',
  '84-treatment-3.webp': 'portrait-woman-pink-background.webp',
  '84-treatment-6.webp': 'abdomen-with-surgical-markings.webp',
  'official-670ff4e2c5bc5e344cbcc3fa.png.webp': 'breast-with-surgical-markings.webp',
  'doctor.webp': 'dr-fulvio-correa-plastic-surgeon-cartagena.webp',
  'editorial.webp': 'woman-side-profile-portrait.webp',
  'facelift-video.webp': 'facelift-video-dr-fulvio-correa.webp',
  'liposuction-video.webp': 'liposuction-video-dr-fulvio-correa.webp',
  'mammoplasty-video.webp': 'mammoplasty-video-dr-fulvio-correa.webp',
  'mommy-video.webp': 'mommy-makeover-video-dr-fulvio-correa.webp',
  'rhinoplasty-video.webp': 'rhinoplasty-video-dr-fulvio-correa.webp',
  'team-adriana.webp': 'adriana-rojas-aesthetic-doctor-cartagena.webp',
  'team-jennifer.webp': 'jennifer-mendoza-ceo-fulvio-correa.webp',
  'logo.png': 'dr-fulvio-correa-logo.png',
};

const WIDTHS = [480, 768, 1200, 1600, 1920];
const BUDGET = {480: 70 * 1024, 768: 70 * 1024, 1200: 150 * 1024, 1600: 190 * 1024, 1920: 190 * 1024};

const SIZES = {
  hero: '100vw',
  banner: '100vw',
  thumb: '(max-width: 600px) 46vw, (max-width: 1000px) 31vw, 280px',
  pillar: '(max-width: 650px) 92vw, 680px',
  portrait: '(max-width: 700px) 88vw, 560px',
  content: '(max-width: 900px) 92vw, 840px',
};
const MAX_W = {hero: 1920, banner: 1920, thumb: 768, pillar: 1200, portrait: 1200, content: 1400};

let variantIndex = new Map();

function rel(file) { return file.split(path.sep).join('/'); }

async function encodeWidth(input, width, maxBytes) {
  let last;
  for (let q = 78; q >= 42; q -= 6) {
    last = await sharp(input).rotate().resize({width, withoutEnlargement: true}).webp({quality: q, effort: 4, smartSubsample: true}).toBuffer();
    if (last.length <= maxBytes) return last;
  }
  return last;
}

export async function buildImageDerivatives(dist = 'dist') {
  variantIndex = new Map();
  const assetDir = path.join(dist, 'assets');
  const files = fs.existsSync(assetDir) ? sourceAssetsIn(assetDir) : [];
  for (const file of files) {
    if (!/\.(webp|png|jpe?g)$/i.test(file)) continue;
    if (file.startsWith('og/') || file.startsWith('icons/') || file === 'dr-fulvio-correa-logo.png' || file.startsWith('breast-lift-reduction-cartagena-colombia')) continue;
    const full = path.join(assetDir, file);
    const size = imageSize(full);
    if (!size || size.width < 480) continue;
    const variants = [];
    for (const width of WIDTHS) {
      if (width >= size.width) continue;
      const name = file.replace(/(\.[a-z0-9]+)$/i, `-${width}.webp`);
      const buf = await encodeWidth(full, width, BUDGET[width]);
      const dest = path.join(assetDir, name);
      fs.mkdirSync(path.dirname(dest), {recursive: true});
      fs.writeFileSync(dest, buf);
      variants.push({width, name, bytes: buf.length});
    }
    // Recompress an oversized content original in dist only (repo file stays).
    const stat = fs.statSync(full);
    if (/\.webp$/i.test(file) && size.width >= 1000 && size.width <= 1400 && stat.size > 150 * 1024) {
      const buf = await encodeWidth(full, size.width, 150 * 1024);
      if (buf.length < stat.size) fs.writeFileSync(full, buf);
    }
    if (variants.length) variantIndex.set(file, {width: size.width, height: size.height, variants});
  }
  const breastCard = 'breast-lift-reduction-cartagena-colombia.webp';
  if (fs.existsSync(path.join(assetDir, breastCard))) {
    variantIndex.set(breastCard, {width: 960, height: 720, variants: [
      {width: 480, name: 'breast-lift-reduction-cartagena-colombia-480.webp'},
      {width: 768, name: 'breast-lift-reduction-cartagena-colombia-768.webp'},
    ]});
  }
  await buildIcons(dist);
  await buildOgImages(dist);
  return variantIndex;
}

function sourceAssetsIn(dir) {
  return fs.readdirSync(dir, {recursive: true, withFileTypes: true})
    .filter(d => d.isFile())
    .map(d => rel(path.relative(dir, path.join(d.parentPath ?? d.path, d.name))));
}

async function emblem() {
  return sharp('assets/dr-fulvio-correa-logo.png').extract({left: 46, top: 8, width: 204, height: 186}).png().toBuffer();
}

async function iconPng(size) {
  const mark = await sharp(await emblem()).resize(size, size, {fit: 'contain', background: {r: 16, g: 12, b: 18, alpha: 1}}).png().toBuffer();
  return sharp({create: {width: size, height: size, channels: 4, background: {r: 16, g: 12, b: 18, alpha: 1}}})
    .composite([{input: mark}]).png().toBuffer();
}

function icoFromPngs(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const dirs = []; const images = [];
  let offset = 6 + 16 * pngs.length;
  for (const p of pngs) {
    const d = Buffer.alloc(16);
    d.writeUInt8(p.width >= 256 ? 0 : p.width, 0);
    d.writeUInt8(p.height >= 256 ? 0 : p.height, 1);
    d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6);
    d.writeUInt32LE(p.png.length, 8); d.writeUInt32LE(offset, 12);
    dirs.push(d); images.push(p.png); offset += p.png.length;
  }
  return Buffer.concat([header, ...dirs, ...images]);
}

async function buildIcons(dist) {
  const pngs = [];
  for (const size of [16, 32, 48]) {
    const png = await iconPng(size);
    pngs.push({width: size, height: size, png});
    fs.writeFileSync(path.join(dist, `favicon-${size}.png`), png);
  }
  fs.writeFileSync(path.join(dist, 'favicon.ico'), icoFromPngs(pngs));
  fs.writeFileSync(path.join(dist, 'apple-touch-icon.png'), await iconPng(180));
  fs.writeFileSync(path.join(dist, 'icon-192.png'), await iconPng(192));
  fs.writeFileSync(path.join(dist, 'icon-512.png'), await iconPng(512));
  const manifest = {
    name: 'Dr. Fulvio Correa',
    short_name: 'Dr. Fulvio Correa',
    icons: [
      {src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
      {src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
    ],
    theme_color: '#1c2523',
    background_color: '#100c12',
    display: 'browser',
    start_url: '/en/',
  };
  fs.writeFileSync(path.join(dist, 'site.webmanifest'), JSON.stringify(manifest));
}

async function ogFile(name, input, {position = 'centre', background = '#140e16', fit = ''} = {}) {
  const dir = path.join('dist', 'assets', 'og');
  fs.mkdirSync(dir, {recursive: true});
  const dest = path.join(dir, name);
  const meta = imageSize(input);
  let pipeline;
  if (!fit && meta && meta.width < 1100) {
    const inner = await sharp(input).resize({height: 590, width: 1160, fit: 'inside', withoutEnlargement: true}).toBuffer();
    pipeline = sharp({create: {width: 1200, height: 630, channels: 3, background}}).composite([{input: inner, gravity: 'centre'}]);
  } else {
    pipeline = sharp(input).resize(1200, 630, {fit: fit || 'cover', position, background});
  }
  let buf = await pipeline.webp({quality: 76, effort: 4}).toBuffer();
  if (buf.length > 200 * 1024) buf = await sharp(buf).webp({quality: 60, effort: 4}).toBuffer();
  fs.writeFileSync(dest, buf);
  return '/assets/' + 'og/' + name;
}

export async function buildOgImages() {
  const hero = 'assets/hero-woman-floral-portrait.webp';
  const face = 'assets/portrait-woman-pink-background.webp';
  const nose = 'assets/nose-with-surgical-markings.webp';
  const breast = 'assets/breast-with-surgical-markings.webp';
  const breastCard = 'breast-lift-reduction-cartagena-colombia.webp';
  const abdomen = 'assets/abdomen-with-surgical-markings.webp';
  const torso = 'assets/torso-black-swimsuit.webp';
  const orange = 'assets/woman-holding-orange-bodysuit.webp';
  const back = 'assets/back-view-white-swimsuit.webp';
  const doctor = 'assets/dr-fulvio-correa-plastic-surgeon-cartagena.webp';
  const map = {
    home: await ogFile('dr-fulvio-correa-plastic-surgery-cartagena.webp', hero, {position: 'centre'}),
    'breast-augmentation': await ogFile('breast-augmentation.webp', breast),
    'breast-lift-reduction': await ogFile('breast-lift-reduction.webp', path.join('assets', breastCard), {position: 'centre', background: '#c5a693'}),
    facelift: await ogFile('facelift.webp', face, {position: 'centre'}),
    rhinoplasty: await ogFile('rhinoplasty.webp', nose, {position: 'centre'}),
    liposuction: await ogFile('liposuction.webp', torso, {position: 'centre'}),
    'tummy-tuck': await ogFile('tummy-tuck.webp', abdomen, {position: 'centre'}),
    'mommy-makeover': await ogFile('mommy-makeover.webp', orange, {position: 'centre'}),
    bbl: await ogFile('bbl.webp', back, {position: 'centre'}),
    capri: await ogFile('capri.webp', doctor, {position: 'north'}),
    testimonials: await ogFile('dr-fulvio-correa-patient-stories-cartagena.webp', doctor, {position: 'north'}),
  };
  for (const poster of ['kary-alejandre.webp', 'natalia-vega.webp', 'thaily-amezcua.webp']) {
    map[poster] = await ogFile(poster, path.join('assets', poster));
  }
  fs.writeFileSync(['dist', 'assets', 'og', 'index.json'].join('/'), JSON.stringify(map));
  return map;
}

export function ogForPage(page) {
  let index = {};
  try { index = JSON.parse(fs.readFileSync(['dist', 'assets', 'og', 'index.json'].join('/'), 'utf8')); } catch { return null; }
  if (page.procedure && !page.ads && index[page.procedure]) return {src: index[page.procedure], width: 1200, height: 630};
  if (page.route?.endsWith('/capri-clinic/') || page.route?.endsWith('/clinica-capri/')) return {src: index.capri, width: 1200, height: 630};
  if (/\/testimonials\/[^/]+\/$/.test(page.route || '') || /\/testimonios\/[^/]+\/$/.test(page.route || '')) {
    const poster = (page.cover || '').split('/').pop();
    if (index[poster]) return {src: index[poster], width: 1200, height: 630};
  }
  if (page.route?.endsWith('/testimonials/') || page.route?.endsWith('/testimonios/')) return {src: index.testimonials, width: 1200, height: 630};
  return null;
}

function slotFor(tag, before) {
  if (/hero-image/.test(tag)) return 'hero';
  if (/closing-image/.test(tag)) return 'banner';
  const pre = before.slice(-700);
  if (/card-image|procedure-card|blog-card|resource-card|team-card|cluster-links/.test(pre)) return 'thumb';
  if (/pillar-photo/.test(pre)) return 'pillar';
  if (/doctor-photo|detail-image|philosophy-portrait|author-block/.test(pre)) return 'portrait';
  return 'content';
}

function attr(tag, name) {
  return tag.match(new RegExp(name + '="([^"]*)"'))?.[1] ?? '';
}

export function decorateHtml(html) {
  const re = /<img\b[^>]*>/g;
  const hasHero = /class="[^"]*hero-image/.test(html);
  const eagerLeft = {thumb: 4, portrait: 2, pillar: 1, content: 1, banner: 0, hero: 1};
  let usedHigh = false;
  return html.replace(re, (tag, offset) => {
    const src = attr(tag, 'src');
    const file = src.replace(/^\/assets\//, '');
    if (!file || file === 'dr-fulvio-correa-logo.png' || file.startsWith('og/')) return tag;
    const slot = slotFor(tag, html.slice(Math.max(0, offset - 700), offset));
    const meta = variantIndex.get(file);
    const fixed = /\sdata-fixed-srcset=/.test(tag);
    let next = tag.replace(fixed ? /\s(?:loading|fetchpriority|decoding)="[^"]*"/g : /\s(?:srcset|sizes|loading|fetchpriority|decoding)="[^"]*"/g, '');
    next = next.replace(/\sdata-fixed-srcset="[^"]*"/, '');
    if (!fixed && meta) {
      const max = MAX_W[slot] || 1400;
      const parts = meta.variants.filter(v => v.width <= max).map(v => `/assets/${v.name} ${v.width}w`);
      if (meta.width <= max) parts.push(`/assets/${file} ${meta.width}w`);
      if (parts.length) next = next.replace(/\s*\/?>$/, ` srcset="${parts.join(', ')}" sizes="${SIZES[slot] || SIZES.content}"$&`);
    }
    const budget = eagerLeft[slot] || 0;
    const eager = slot === 'hero' || budget > 0;
    if (budget > 0) eagerLeft[slot] = budget - 1;
    const priority = !usedHigh && (slot === 'hero' || (!hasHero && eager));
    if (priority) usedHigh = true;
    next = next.replace(/\s*\/?>$/, priority ? ' fetchpriority="high" decoding="async">' : eager ? ' decoding="async">' : ' loading="lazy" decoding="async">');
    if (!attr(next, 'width') || !attr(next, 'height')) return tag;
    return next;
  });
}

export function decorateDistImages(dist = 'dist') {
  const files = fs.readdirSync(dist, {recursive: true, withFileTypes: true})
    .filter(d => d.isFile() && String(d.name).endsWith('.html'))
    .map(d => path.join(d.parentPath ?? d.path, d.name));
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const next = decorateHtml(html);
    if (next !== html) fs.writeFileSync(file, next);
  }
}

export function pruneUnreferencedAssets(dist = 'dist') {
  const textRe = /\.(html|css|js|xml|txt|json|webmanifest|vtt)$/;
  const used = new Set();
  const files = fs.readdirSync(dist, {recursive: true, withFileTypes: true}).filter(d => d.isFile());
  for (const d of files) {
    const relPath = path.relative(dist, path.join(d.parentPath ?? d.path, d.name)).split(path.sep).join('/');
    if (!textRe.test(relPath) && relPath !== '_redirects' && relPath !== '_headers') continue;
    const text = fs.readFileSync(path.join(dist, relPath), 'utf8');
    for (const m of text.matchAll(/\/assets\/[A-Za-z0-9._~%+@/-]+/g)) used.add(decodeURIComponent(m[0].replace(/^\/assets\//, '').split(/[?#]/)[0]));
  }
  for (const d of files) {
    const relPath = path.relative(dist, path.join(d.parentPath ?? d.path, d.name)).split(path.sep).join('/');
    if (!relPath.startsWith('assets/') || relPath.startsWith('assets/fonts/')) continue;
    const name = relPath.slice('assets/'.length);
    if (!used.has(name) && !name.endsWith('.txt')) fs.rmSync(path.join(dist, relPath));
  }
}

export function assetRedirects() {
  return [
    ...Object.entries(IMAGE_RENAMES).map(([from, to]) => ({from: '/assets/' + from, to: '/assets/' + to, status: 301})),
    // Generated Open Graph crops. Renamed only in dist; the old names were never source files.
    {from: '/assets/'+'og/home.webp', to: '/assets/'+'og/dr-fulvio-correa-plastic-surgery-cartagena.webp', status: 301},
    {from: '/assets/'+'og/testimonials.webp', to: '/assets/'+'og/dr-fulvio-correa-patient-stories-cartagena.webp', status: 301},
  ];
}
