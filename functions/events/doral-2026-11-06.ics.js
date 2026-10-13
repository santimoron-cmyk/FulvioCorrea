// GET /events/doral-2026-11-06.ics
// The same calendar is also written to dist/events/ for the local server. On Pages, this
// Function owns the URL (same routing as functions/robots.txt.js) and sets text/calendar
// itself, so a missing static asset cannot fall through to the HTML 404 page.
import {doralIcs} from '../../event-calendar.mjs';

export async function onRequest() {
  return new Response(doralIcs(), {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'content-disposition': 'inline; filename="doral-2026-11-06.ics"',
      'x-content-type-options': 'nosniff',
    },
  });
}
