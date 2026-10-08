// Spanish public paths. English routes stay as they are.
// Generators still emit parallel /es/{english-slug}/ URLs; localizeEsOutput()
// rewrites the finished dist so hreflang, canonicals, sitemap and links move together.
export const procedureEs = {
  'breast-augmentation': 'aumento-de-senos',
  'breast-lift-reduction': 'reduccion-y-levantamiento-de-senos',
  liposuction: 'liposuccion',
  'tummy-tuck': 'abdominoplastia',
  'mommy-makeover': 'mommy-makeover',
  rhinoplasty: 'rinoplastia',
  facelift: 'lifting-facial',
  bbl: 'aumento-de-gluteos',
};

export const categoryEs = {
  'mommy-makeover': 'mommy-makeover',
  'breast-surgery': 'cirugia-mamaria',
  'body-contouring': 'contorno-corporal',
  recovery: 'recuperacion',
  'medical-tourism': 'turismo-medico',
  'plastic-surgery-in-colombia': 'cirugia-plastica-en-colombia',
};

const topEs = [
  ['about/', 'sobre-el-doctor/'],
  ['faq/', 'preguntas-frecuentes/'],
  ['international-patients/', 'pacientes-internacionales/'],
  ['resources/your-consultation/', 'recursos/tu-valoracion/'],
  ['resources/', 'recursos/'],
  ['before-after/', 'antes-y-despues/'],
  ['book-consultation/', 'agendar-valoracion/'],
  ['capri-clinic/', 'clinica-capri/'],
  ['contact/', 'contacto/'],
  ['plastic-surgery-colombia/', 'cirugia-plastica-colombia/'],
  ['privacy/', 'privacidad/'],
  ['terms/', 'terminos/'],
  ['testimonials/', 'testimonios/'],
  ['procedures/', 'procedimientos/'],
  // Event landing. Public URLs are the Aromas shell; -v1 is the previous Fulvio shell (noindex).
  ['mommy-makeover-talk-doral/', 'charla-mommy-makeover-doral/'],
  ['mommy-makeover-talk-doral-v1/', 'charla-mommy-makeover-doral-v1/'],
];

// Longest old path first so a hub prefix cannot rewrite a more specific URL first.
export function esPairs() {
  const pairs = [];
  for (const [en, es] of Object.entries(procedureEs)) pairs.push([`/es/procedures/${en}/`, `/es/procedimientos/${es}/`]);
  for (const [en, es] of Object.entries(categoryEs)) {
    pairs.push([`/es/blog/category/${en}/`, `/es/blog/categoria/${es}/`]);
  }
  // Prefix only: there is no category index page, so this must not become its own 301.
  pairs.push(['/es/blog/category/', '/es/blog/categoria/']);
  for (const [en, es] of topEs) pairs.push([`/es/${en}`, `/es/${es}`]);
  return pairs.sort((a, b) => b[0].length - a[0].length);
}

export function localizePath(input) {
  if (typeof input !== 'string' || !input.includes('/es/')) return input;
  let out = input;
  for (const [from, to] of esPairs()) out = out.split(from).join(to);
  return out;
}

export function procedureRoute(lang, slug) {
  return localizePath(`/${lang}/procedures/${slug}/`);
}

// Rewrite finished HTML/XML/JSON and move Spanish pages onto their public paths.
// Old Spanish paths become 301s. Call this after audit.mjs has written dist.
import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {recursive: true, withFileTypes: true})
    .filter(d => d.isFile())
    .map(d => path.relative(dir, path.join(d.parentPath ?? d.path, d.name)).split(path.sep).join('/'));
}

export function localizeEsOutput(dist = 'dist') {
  const textRe = /\.(html|xml|txt|json|webmanifest|js|css)$/;
  for (const file of walk(dist)) {
    if (file === '_redirects' || !textRe.test(file)) continue;
    const full = path.join(dist, file);
    const raw = fs.readFileSync(full, 'utf8');
    const next = localizePath(raw);
    if (next !== raw) fs.writeFileSync(full, next);
  }
  const htmlFiles = walk(dist).filter(f => f.startsWith('es/') && f.endsWith('/index.html'));
  for (const file of htmlFiles) {
    const route = '/' + file.slice(0, -'index.html'.length);
    const neu = localizePath(route);
    if (neu === route) continue;
    const from = path.join(dist, file);
    const to = path.join(dist, neu.slice(1), 'index.html');
    fs.mkdirSync(path.dirname(to), {recursive: true});
    fs.renameSync(from, to);
  }
  // Drop directories left empty by the move.
  const dirs = walk(dist).map(f => path.dirname(path.join(dist, f)));
  for (const dir of [...new Set(dirs)].sort((a, b) => b.length - a.length)) {
    if (dir === dist || !fs.existsSync(dir)) continue;
    if (!fs.readdirSync(dir).length) fs.rmdirSync(dir);
  }
}

// English public URLs live at the site root. /en/about/ is still a build route; the served URL is /about/.
export function publicPath(route) {
  if (typeof route !== 'string') return route;
  if (route === '/en' || route === '/en/') return '/';
  if (route.startsWith('/en/')) return '/' + route.slice(4);
  return route;
}

// Absolute self-URLs and relative /en/ links become root English paths.
// pages.json keeps its /en/ build routes (passed in extras) so verifiers can still find source files.
export function publishEnglishAtRoot(dist = 'dist', origin = 'https://fulviocorrea.com', extras = []) {
  const needle = origin + '/en/';
  const repl = origin + '/';
  const skipRelative = new Set(extras.map(f => path.resolve(f)));
  const files = [...walk(dist).filter(f => /\.(html|xml|txt|json|webmanifest|js|css)$/.test(f)).map(f => path.join(dist, f)), ...extras];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    let next = raw.split(needle).join(repl);
    if (!skipRelative.has(path.resolve(file))) next = next.replaceAll('"/en/', '"/').replaceAll("'/en/", "'/").replaceAll('"/en"', '"/"').replaceAll("'/en'", "'/'");
    if (next !== raw) fs.writeFileSync(file, next);
  }
}

export function localizeRedirectRules(rules) {
  const localized = rules.map(r => ({...r, to: localizePath(r.to)}));
  const have = new Set(localized.map(r => r.from));
  const extra = [];
  const prefixOnly = new Set(['/es/blog/category/']);
  for (const [from, to] of esPairs()) {
    if (prefixOnly.has(from)) continue;
    for (const source of [from.replace(/\/$/, ''), from]) {
      if (!source.startsWith('/es/') || have.has(source)) continue;
      extra.push({from: source, to, status: 301});
      have.add(source);
    }
  }
  return [...localized, ...extra];
}
