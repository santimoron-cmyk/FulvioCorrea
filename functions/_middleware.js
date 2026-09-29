// Host rules for every Pages request, including static HTML.
// www.fulviocorrea.com 301s to the apex. *.pages.dev stays noindex so it cannot compete with the apex.
import {apexRedirect, isPagesDevHost} from '../site-env.mjs';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = apexRedirect(url.toString());
  if (target) return Response.redirect(target, 301);
  const response = await context.next();
  if (!isPagesDevHost(url.hostname)) return response;
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}
