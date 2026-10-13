// Doral conversatorio, Friday 6 November 2026, 6:00–8:00 PM America/New_York (EST, UTC−5).
// DORAL_LOCATION is the only address string. Pages, the .ics file, and the calendar links all read it.
export const DORAL_LOCATION = 'Aromas Med Spa, 9831 NW 58th St #149, Doral, FL 33178';
export const DORAL_MAPS_URL = 'https://maps.app.goo.gl/Uicgm1mwFxyLtxy97';
export const DORAL_PHONE_DISPLAY = '(305) 591-3005';
export const DORAL_PHONE_TEL = 'tel:+13055913005';
export const DORAL_SITE_URL = 'https://aromaslaser.com/';
export const DORAL_SITE_NAME = 'Aromas Med Spa';
export const DORAL_ICS_PATH = '/events/doral-2026-11-06.ics';
export const DORAL_UID = 'doral-conversatorio-2026-11-06@fulviocorrea.com';
const START_Z = '20261106T230000Z';
const END_Z = '20261107T010000Z';
const START_ISO = '2026-11-06T23:00:00Z';
const END_ISO = '2026-11-07T01:00:00Z';
const ORIGIN = 'https://fulviocorrea.com';
export const DORAL_TITLES = {
  es: 'Conversatorio de belleza y estética · Aromas Med Spa Doral',
  en: 'Beauty & Aesthetics Talk · Aromas Med Spa Doral',
};
export const DORAL_LANDINGS = {
  es: ORIGIN + '/es/conversatorio-belleza-estetica-doral/',
  en: ORIGIN + '/beauty-aesthetics-talk-doral/',
};

export function doralDescription(lang) {
  const line = lang === 'es'
    ? 'Vino y picadas, con el Dr. Fulvio Correa y Alberto (Aromas).'
    : 'Wine and light bites, with Dr. Fulvio Correa and Alberto (Aromas).';
  return line + ' ' + DORAL_LANDINGS[lang];
}

export function googleCalendarUrl(lang) {
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', DORAL_TITLES[lang]);
  url.searchParams.set('dates', START_Z + '/' + END_Z);
  url.searchParams.set('details', doralDescription(lang));
  url.searchParams.set('location', DORAL_LOCATION);
  url.searchParams.set('ctz', 'America/New_York');
  return url.toString();
}

export function outlookCalendarUrl(lang) {
  const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  url.searchParams.set('path', '/calendar/action/compose');
  url.searchParams.set('rru', 'addevent');
  url.searchParams.set('startdt', START_ISO);
  url.searchParams.set('enddt', END_ISO);
  url.searchParams.set('subject', DORAL_TITLES[lang]);
  url.searchParams.set('body', doralDescription(lang));
  url.searchParams.set('location', DORAL_LOCATION);
  return url.toString();
}

function icsText(value) {
  return String(value).replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;');
}

function fold(line) {
  const enc = new TextEncoder();
  let out = '', current = '', octets = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (octets + n > 75) {
      out += current + '\r\n ';
      current = ch;
      octets = 1 + n;
    } else {
      current += ch;
      octets += n;
    }
  }
  return out + current;
}

export function doralIcs() {
  const description = doralDescription('es') + '\n\n' + doralDescription('en');
  const summary = DORAL_TITLES.es + ' / ' + DORAL_TITLES.en;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fulvio Correa//Doral Talk//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:' + DORAL_UID,
    'DTSTAMP:20261013T210000Z',
    'DTSTART:' + START_Z,
    'DTEND:' + END_Z,
    'SUMMARY:' + icsText(summary),
    'LOCATION:' + icsText(DORAL_LOCATION),
    'DESCRIPTION:' + icsText(description),
    'URL:' + DORAL_LANDINGS.es,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:' + icsText(DORAL_TITLES.es),
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
