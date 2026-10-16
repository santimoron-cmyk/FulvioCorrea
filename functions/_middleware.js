// Host rules for every Pages request, including static HTML.
// www.fulviocorrea.com 301s to the apex. *.pages.dev stays noindex so it cannot compete with the apex.
import {apexRedirect, isPagesDevHost} from '../site-env.mjs';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = apexRedirect(url.toString());
  if (target) return Response.redirect(target, 301);
  const response = await context.next();
  const headers = new Headers(response.headers);
  let changed = false;
  // First-party events need the visitor country on the first paint. Google's own tags
  // use the consent `region` list and the client IP; this cookie only mirrors that for our JS.
  const country = String(context.request.cf?.country || '').toUpperCase();
  const type = headers.get('content-type') || '';
  if (/^[A-Z]{2}$/.test(country) && type.includes('text/html')) {
    headers.append('Set-Cookie', `fc_country=${country}; Path=/; Max-Age=86400; SameSite=Lax; Secure`);
    changed = true;
  }
  if (!isPagesDevHost(url.hostname)) return changed ? new Response(response.body, {status: response.status, statusText: response.statusText, headers}) : response;
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}
