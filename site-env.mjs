// Single source of truth for the build mode (preview vs production).
// Linux/Windows neutral: reads only environment variables, never the filesystem.
//
// Resolution order:
//   1. SITE_ENV=production | preview (explicit; also set by `node build.mjs --production|--preview`).
//   2. Cloudflare Pages: CF_PAGES=1 and CF_PAGES_BRANCH=main  -> production.
//      Any other Cloudflare branch (preview deployments)      -> preview.
//   3. Anything else (local `npm run build`, CI, other hosts)  -> preview.
// Preview = noindex,nofollow on every page, robots.txt "Disallow: /", no _redirects,
// plus an X-Robots-Tag header. Production = indexable pages (except ads/noindex pages).
export const PRODUCTION_BRANCH = 'main';
export function resolveSiteEnv(env = process.env) {
  const explicit = (env.SITE_ENV || '').trim();
  if (explicit) {
    if (!['preview', 'production'].includes(explicit)) throw Error(`Invalid SITE_ENV "${explicit}" (use "preview" or "production").`);
    return { mode: explicit, reason: `SITE_ENV=${explicit}` };
  }
  if (env.CF_PAGES === '1') {
    const branch = env.CF_PAGES_BRANCH || '';
    return branch === PRODUCTION_BRANCH
      ? { mode: 'production', reason: `Cloudflare Pages production branch (${branch})` }
      : { mode: 'preview', reason: `Cloudflare Pages preview branch (${branch || 'unknown'})` };
  }
  return { mode: 'preview', reason: 'default (no SITE_ENV, not a Cloudflare production build)' };
}
export const isProduction = (env = process.env) => resolveSiteEnv(env).mode === 'production';

export const CANONICAL_HOST = 'fulviocorrea.com';
export const CANONICAL_ORIGIN = 'https://fulviocorrea.com';
export function isPagesDevHost(host = '') {
  const name = String(host).toLowerCase().replace(/:\d+$/, '');
  return name === 'pages.dev' || name.endsWith('.pages.dev');
}
// www.fulviocorrea.com -> https://fulviocorrea.com (path and query preserved). Null when no redirect is needed.
export function apexRedirect(href) {
  const url = new URL(href);
  if (url.hostname.toLowerCase() !== 'www.' + CANONICAL_HOST) return null;
  url.hostname = CANONICAL_HOST;
  url.protocol = 'https:';
  return url.toString();
}

// Crawlers explicitly welcomed in production (search + AI answer engines).
export const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended'];
export function robotsTxt(production, origin) {
  if (!production) return 'User-agent: *\nDisallow: /\n';
  return ['User-agent: *', 'Allow: /', '', ...AI_CRAWLERS.flatMap(bot => [`User-agent: ${bot}`, 'Allow: /', '']), `Sitemap: ${origin}/sitemap.xml`, ''].join('\n');
}
