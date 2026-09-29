// Due time for "Quiero que me llamen": server clock → America/Bogota, NinjaSuite "MM-DD-YYYY hh:mm AM".
import assert from 'node:assert/strict';
import {callSchedule} from './server/call-due.mjs';
import {createLeadHandler} from './server/lead-handler.mjs';

const at = iso => Date.parse(iso);
const schedule = (iso, preference, timezone) => callSchedule(at(iso), preference, timezone);
function expect(iso, preference, timezone, call_due_at, call_due_at_iso, call_window_colombia) {
  assert.deepEqual(schedule(iso, preference, timezone), {call_due_at, call_due_at_iso, call_window_colombia}, `${preference} ${timezone || '(none)'} @ ${iso}`);
}

// America/New_York, September 2026 is EDT (UTC−4). Morning 8:00–12:00 → 7:00–11:00 Colombia.
expect('2026-09-28T11:00:00.000Z', 'morning', 'America/New_York', '09-28-2026 07:00 AM', '2026-09-28T12:00:00.000Z', 'lun 28 sep, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-09-28T11:59:59.999Z', 'morning', 'America/New_York', '09-28-2026 07:00 AM', '2026-09-28T12:00:00.000Z', 'lun 28 sep, 7:00–11:00 a. m. (hora Colombia)');
// Inside the window: round up to the next 15 minutes. An exact quarter-hour stays.
expect('2026-09-28T13:07:30.000Z', 'morning', 'America/New_York', '09-28-2026 08:15 AM', '2026-09-28T13:15:00.000Z', 'lun 28 sep, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-09-28T13:14:59.999Z', 'morning', 'America/New_York', '09-28-2026 08:15 AM', '2026-09-28T13:15:00.000Z', 'lun 28 sep, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-09-28T13:15:00.000Z', 'morning', 'America/New_York', '09-28-2026 08:15 AM', '2026-09-28T13:15:00.000Z', 'lun 28 sep, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-09-28T13:15:00.001Z', 'morning', 'America/New_York', '09-28-2026 08:30 AM', '2026-09-28T13:30:00.000Z', 'lun 28 sep, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-09-28T12:00:00.000Z', 'morning', 'America/New_York', '09-28-2026 07:00 AM', '2026-09-28T12:00:00.000Z', 'lun 28 sep, 7:00–11:00 a. m. (hora Colombia)');
// Exactly at the end (12:00 local) the window has passed → tomorrow's start.
expect('2026-09-28T16:00:00.000Z', 'morning', 'America/New_York', '09-29-2026 07:00 AM', '2026-09-29T12:00:00.000Z', 'mar 29 sep, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-09-28T15:59:59.999Z', 'morning', 'America/New_York', '09-28-2026 11:00 AM', '2026-09-28T16:00:00.000Z', 'lun 28 sep, 7:00–11:00 a. m. (hora Colombia)');

// America/Bogota (no DST). Afternoon crosses noon, so the label carries both a. m./p. m. only when they differ.
expect('2026-09-28T12:30:00.000Z', 'morning', 'America/Bogota', '09-28-2026 08:00 AM', '2026-09-28T13:00:00.000Z', 'lun 28 sep, 8:00 a. m.–12:00 p. m. (hora Colombia)');
expect('2026-09-28T15:07:30.000Z', 'morning', 'America/Bogota', '09-28-2026 10:15 AM', '2026-09-28T15:15:00.000Z', 'lun 28 sep, 8:00 a. m.–12:00 p. m. (hora Colombia)');
expect('2026-09-28T15:00:00.000Z', 'afternoon', 'America/Bogota', '09-28-2026 12:00 PM', '2026-09-28T17:00:00.000Z', 'lun 28 sep, 12:00–5:00 p. m. (hora Colombia)');
expect('2026-09-28T18:07:00.000Z', 'afternoon', 'America/Bogota', '09-28-2026 01:15 PM', '2026-09-28T18:15:00.000Z', 'lun 28 sep, 12:00–5:00 p. m. (hora Colombia)');
expect('2026-09-28T22:00:00.000Z', 'afternoon', 'America/Bogota', '09-29-2026 12:00 PM', '2026-09-29T17:00:00.000Z', 'mar 29 sep, 12:00–5:00 p. m. (hora Colombia)');
expect('2026-09-28T23:10:00.000Z', 'evening', 'America/Bogota', '09-28-2026 06:15 PM', '2026-09-28T23:15:00.000Z', 'lun 28 sep, 5:00–8:00 p. m. (hora Colombia)');
expect('2026-09-29T01:30:00.000Z', 'evening', 'America/Bogota', '09-29-2026 05:00 PM', '2026-09-29T22:00:00.000Z', 'mar 29 sep, 5:00–8:00 p. m. (hora Colombia)');

// Europe/Madrid. September 2026 is CEST (UTC+2): morning 8:00–12:00 → 1:00–5:00 Colombia.
expect('2026-09-28T04:00:00.000Z', 'morning', 'Europe/Madrid', '09-28-2026 01:00 AM', '2026-09-28T06:00:00.000Z', 'lun 28 sep, 1:00–5:00 a. m. (hora Colombia)');
expect('2026-09-28T08:10:00.000Z', 'morning', 'Europe/Madrid', '09-28-2026 03:15 AM', '2026-09-28T08:15:00.000Z', 'lun 28 sep, 1:00–5:00 a. m. (hora Colombia)');
expect('2026-09-28T12:00:00.000Z', 'morning', 'Europe/Madrid', '09-29-2026 01:00 AM', '2026-09-29T06:00:00.000Z', 'mar 29 sep, 1:00–5:00 a. m. (hora Colombia)');
// January is CET (UTC+1): the same local window is an hour later in Colombia.
expect('2026-01-15T05:00:00.000Z', 'morning', 'Europe/Madrid', '01-15-2026 02:00 AM', '2026-01-15T07:00:00.000Z', 'jue 15 ene, 2:00–6:00 a. m. (hora Colombia)');

// asap is now + 15 minutes in Bogota, including a midnight rollover. Not rounded to a quarter-hour.
expect('2026-09-28T15:07:31.790Z', 'asap', 'America/New_York', '09-28-2026 10:22 AM', '2026-09-28T15:22:31.790Z', 'Lo antes posible');
expect('2026-09-28T04:50:00.000Z', 'asap', 'Europe/Madrid', '09-28-2026 12:05 AM', '2026-09-28T05:05:00.000Z', 'Lo antes posible');

// Missing or unknown zone: interpret the window as America/Bogota. 07:00 Colombia is before morning.
for (const timezone of ['', 'America/Not_A_Zone', 'Not/AZone']) {
  expect('2026-09-28T12:00:00.000Z', 'morning', timezone, '09-28-2026 08:00 AM', '2026-09-28T13:00:00.000Z', 'lun 28 sep, 8:00 a. m.–12:00 p. m. (hora Colombia)');
}

// DST. New York springs forward 2026-03-08 02:00 EST → 03:00 EDT, and falls back 2026-11-01.
// The same local 8:00 is 08:00 Colombia before the change and 07:00 Colombia after it (and the reverse in November).
expect('2026-03-07T11:30:00.000Z', 'morning', 'America/New_York', '03-07-2026 08:00 AM', '2026-03-07T13:00:00.000Z', 'sáb 7 mar, 8:00 a. m.–12:00 p. m. (hora Colombia)');
expect('2026-03-08T02:00:00.000Z', 'morning', 'America/New_York', '03-08-2026 07:00 AM', '2026-03-08T12:00:00.000Z', 'dom 8 mar, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-03-08T10:30:00.000Z', 'morning', 'America/New_York', '03-08-2026 07:00 AM', '2026-03-08T12:00:00.000Z', 'dom 8 mar, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-03-08T13:07:00.000Z', 'morning', 'America/New_York', '03-08-2026 08:15 AM', '2026-03-08T13:15:00.000Z', 'dom 8 mar, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-10-31T10:30:00.000Z', 'morning', 'America/New_York', '10-31-2026 07:00 AM', '2026-10-31T12:00:00.000Z', 'sáb 31 oct, 7:00–11:00 a. m. (hora Colombia)');
expect('2026-11-01T11:30:00.000Z', 'morning', 'America/New_York', '11-01-2026 08:00 AM', '2026-11-01T13:00:00.000Z', 'dom 1 nov, 8:00 a. m.–12:00 p. m. (hora Colombia)');
// Madrid springs forward 2026-03-29 02:00 CET → 03:00 CEST.
expect('2026-03-28T05:00:00.000Z', 'morning', 'Europe/Madrid', '03-28-2026 02:00 AM', '2026-03-28T07:00:00.000Z', 'sáb 28 mar, 2:00–6:00 a. m. (hora Colombia)');
expect('2026-03-29T04:00:00.000Z', 'morning', 'Europe/Madrid', '03-29-2026 01:00 AM', '2026-03-29T06:00:00.000Z', 'dom 29 mar, 1:00–5:00 a. m. (hora Colombia)');
// A +5:30 zone puts the morning window across midnight in Colombia (previous evening → next morning).
expect('2026-09-28T01:00:00.000Z', 'morning', 'Asia/Kolkata', '09-27-2026 09:30 PM', '2026-09-28T02:30:00.000Z', 'dom 27 sep, 9:30 p. m.–lun 28 sep, 1:30 a. m. (hora Colombia)');

// The Pages Function uses the server clock, ignores client_timestamp, and leaves the fields blank unless this is a call.
const site = 'https://fulviocorrea.com';
const env = {LEAD_CAPTURE_ENABLED: 'true', LEAD_WEBHOOK_URL: 'https://services.leadconnectorhq.com/hooks/EXAMPLE/webhook-trigger/EXAMPLE'};
const posted = [];
let now = at('2026-09-27T21:05:31.790Z');
const handler = createLeadHandler({env, procedures: ['liposuction'], clock: () => now, send: async (_url, init) => { posted.push(JSON.parse(init.body)); return new Response('{}', {status: 200}); }});
const request = body => new Request(site + '/api/lead', {method: 'POST', headers: {'content-type': 'application/json', origin: site, 'idempotency-key': body.event_id}, body: JSON.stringify(body)});
const lead = {name: 'Jane Smith', phone: '+13055550123', procedure: 'liposuction', procedure_label: 'Mommy Makeover', language: 'en', contact_consent: true, lead_id: 'lead-due-0001abcd', timezone: 'America/New_York', client_timestamp: '1999-01-01T00:00:00.000Z', form_id: 'contact-widget'};
let response = await handler(request({...lead, event: 'channel_selected', event_id: 'lead-due-0001abcd-call-morning', channel: 'call', preferred_call_time: 'morning'}));
assert.equal(response.status, 200);
assert.equal(posted.length, 1);
assert.equal(posted[0].call_due_at, '09-28-2026 07:00 AM');
assert.equal(posted[0].call_due_at_iso, '2026-09-28T12:00:00.000Z');
assert.equal(posted[0].call_window_colombia, 'lun 28 sep, 7:00–11:00 a. m. (hora Colombia)');
assert.ok(posted[0].summary.endsWith(' | Llamar: lun 28 sep, 7:00–11:00 a. m. (hora Colombia)'));
assert.equal(posted[0].client_timestamp, '1999-01-01T00:00:00.000Z');
assert.equal(posted[0].preferred_call_time, 'morning');
response = await handler(request({...lead, event: 'lead_created', event_id: 'lead-due-0001abcd-created'}));
assert.equal(response.status, 200);
assert.deepEqual([posted[1].call_due_at, posted[1].call_due_at_iso, posted[1].call_window_colombia], ['', '', '']);
assert.ok(!posted[1].summary.includes('Llamar:'));
response = await handler(request({...lead, event: 'channel_selected', event_id: 'lead-due-0001abcd-whatsapp', channel: 'whatsapp'}));
assert.equal(response.status, 200);
assert.deepEqual([posted[2].call_due_at, posted[2].call_due_at_iso, posted[2].call_window_colombia], ['', '', '']);
// Unknown IANA zone is kept on the payload (existing validation only drops strings that fail the shape check) but the window falls back to Colombia.
response = await handler(request({...lead, event: 'channel_selected', event_id: 'lead-due-0001abcd-call-evening', channel: 'call', preferred_call_time: 'evening', timezone: 'America/Not_A_Zone'}));
assert.equal(response.status, 200);
assert.equal(posted[3].timezone, 'America/Not_A_Zone');
assert.equal(posted[3].call_due_at, '09-27-2026 05:00 PM');
assert.equal(posted[3].call_window_colombia, 'dom 27 sep, 5:00–8:00 p. m. (hora Colombia)');
// asap retry after the clock moves is still one delivery: the due fields are not part of the idempotency fingerprint.
now = at('2026-09-28T15:00:00.000Z');
const asap = {...lead, event: 'channel_selected', event_id: 'lead-due-0001abcd-call-asap', channel: 'call', preferred_call_time: 'asap'};
response = await handler(request(asap));
assert.equal(response.status, 200);
assert.equal(posted.at(-1).call_due_at, '09-28-2026 10:15 AM');
assert.equal(posted.at(-1).call_window_colombia, 'Lo antes posible');
assert.ok(posted.at(-1).summary.endsWith(' | Llamar: Lo antes posible'));
const deliveries = posted.length;
now = at('2026-09-28T15:02:00.000Z');
response = await handler(request({...asap, client_timestamp: '2026-09-28T15:02:00.000Z'}));
assert.equal(response.status, 200);
assert.equal(posted.length, deliveries, 'call retry is not forwarded again when only the clock changed');
response = await handler(request({...asap, name: 'Someone Else'}));
assert.equal(response.status, 409);

console.log('PASS: call due time — New York, Bogotá and Madrid; before, inside and after the window; asap; invalid timezone; DST boundaries; server clock (client timestamp ignored); blank fields on non-call events.');
