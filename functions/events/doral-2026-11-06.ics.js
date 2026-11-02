// GET /events/doral-2026-11-06.ics
// The November 6, 2026 Doral talk was postponed. This URL must not offer an active calendar
// event. 410 tells calendars and old links the file is gone. The landing pages do not link
// here. A new date, when it exists, should replace this response.
const BODY = 'Postponed. The November 6, 2026 beauty and aesthetics talk at Aromas Med Spa Doral will not take place on that date. The new date will be posted at https://fulviocorrea.com/beauty-aesthetics-talk-doral/ and https://fulviocorrea.com/es/conversatorio-belleza-estetica-doral/\n';

export async function onRequest() {
  return new Response(BODY, {
    status: 410,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'x-content-type-options': 'nosniff',
      'x-robots-tag': 'noindex',
    },
  });
}
