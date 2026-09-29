// robots.txt follows the host. The apex allows crawling and points at the canonical sitemap.
// *.pages.dev (production alias and branch previews) disallows crawling. Other hosts use the built file.
import {robotsTxt, isPagesDevHost, CANONICAL_HOST, CANONICAL_ORIGIN} from '../site-env.mjs';

export async function onRequest(context) {
  const host = new URL(context.request.url).hostname.toLowerCase();
  const headers = {'content-type': 'text/plain; charset=utf-8'};
  if (host === CANONICAL_HOST || host === 'www.' + CANONICAL_HOST) return new Response(robotsTxt(true, CANONICAL_ORIGIN), {headers});
  if (isPagesDevHost(host)) return new Response(robotsTxt(false, CANONICAL_ORIGIN), {headers});
  return context.next();
}
