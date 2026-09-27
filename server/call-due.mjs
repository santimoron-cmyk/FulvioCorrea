// Call-task due time for NinjaSuite. Computed from the server clock (never a client timestamp).
// Windows are the patient's local time; the due instant is then shown in America/Bogota, which is
// how the Add Task action reads "MM-DD-YYYY hh:mm AM". No staff-hours or weekend skipping.
const CLINIC_TZ = 'America/Bogota';
const QUARTER_MS = 15 * 60 * 1000;
const WINDOWS = {morning: [8 * 60, 12 * 60], afternoon: [12 * 60, 17 * 60], evening: [17 * 60, 20 * 60]};
const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const blank = {call_due_at: '', call_due_at_iso: '', call_window_colombia: ''};

const validTimeZone = tz => {
  if (!tz || typeof tz !== 'string') return false;
  try { Intl.DateTimeFormat('en-US', {timeZone: tz}); return true; } catch { return false; }
};

// hourCycle h23 is 00–23. A few engines still report midnight as hour 24; treat that as 00:00.
function zonedParts(date, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', {timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'});
  const out = {};
  for (const p of dtf.formatToParts(date)) if (p.type !== 'literal') out[p.type] = p.value;
  let hour = +out.hour;
  if (hour === 24) hour = 0;
  return {year: +out.year, month: +out.month, day: +out.day, hour, minute: +out.minute, second: +out.second};
}

function wallAsUtc(p) { return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second); }

// Wall-clock time in `timeZone` → UTC. Two offset corrections converge across DST; daytime call
// windows do not fall in the spring-forward gap. A repeated local time (fall back) resolves to the
// first occurrence, the one the iteration reaches.
function zonedTimeToUtc(year, month, day, hour, minute, timeZone) {
  const want = Date.UTC(year, month - 1, day, hour, minute, 0);
  let utc = want;
  for (let i = 0; i < 3; i++) {
    const got = wallAsUtc(zonedParts(new Date(utc), timeZone));
    if (got === want) return new Date(utc);
    utc += want - got;
  }
  return new Date(utc);
}

function addDays(year, month, day, days) {
  const t = new Date(Date.UTC(year, month - 1, day + days));
  return {year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate()};
}

// Negative when the local time is strictly before `totalMinutes` (seconds and ms count).
function compareMinutes(parts, millis, totalMinutes) {
  const hour = Math.floor(totalMinutes / 60), minute = totalMinutes % 60;
  if (parts.hour !== hour) return parts.hour - hour;
  if (parts.minute !== minute) return parts.minute - minute;
  if (parts.second !== 0) return parts.second;
  return millis;
}

function atMinutes(year, month, day, totalMinutes, timeZone) {
  return zonedTimeToUtc(year, month, day, Math.floor(totalMinutes / 60), totalMinutes % 60, timeZone);
}

// Next window occurrence: today's start if still upcoming, now rounded up to the next 15 minutes
// when already inside [start, end), otherwise tomorrow's start. An exact quarter-hour stays put.
function nextWindow(nowMs, startMin, endMin, timeZone) {
  const now = new Date(nowMs), parts = zonedParts(now, timeZone), millis = now.getUTCMilliseconds();
  let {year, month, day} = parts;
  const before = compareMinutes(parts, millis, startMin) < 0;
  const inside = !before && compareMinutes(parts, millis, endMin) < 0;
  if (!before && !inside) ({year, month, day} = addDays(year, month, day, 1));
  const start = atMinutes(year, month, day, startMin, timeZone);
  const end = atMinutes(year, month, day, endMin, timeZone);
  const due = inside ? new Date(nowMs % QUARTER_MS === 0 ? nowMs : nowMs + (QUARTER_MS - nowMs % QUARTER_MS)) : start;
  return {due, start, end};
}

function formatDue(date) {
  const p = zonedParts(date, CLINIC_TZ);
  let hour = p.hour % 12;
  if (hour === 0) hour = 12;
  const pad = n => String(n).padStart(2, '0');
  return `${pad(p.month)}-${pad(p.day)}-${p.year} ${pad(hour)}:${pad(p.minute)} ${p.hour < 12 ? 'AM' : 'PM'}`;
}

function clockLabel(p) {
  let hour = p.hour % 12;
  if (hour === 0) hour = 12;
  return {hour, minute: String(p.minute).padStart(2, '0'), suffix: p.hour < 12 ? 'a. m.' : 'p. m.'};
}

function dateLabel(p) {
  const weekday = WEEKDAYS[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()];
  return `${weekday} ${p.day} ${MONTHS[p.month - 1]}`;
}

function formatWindow(start, end) {
  const a = zonedParts(start, CLINIC_TZ), b = zonedParts(end, CLINIC_TZ);
  const ca = clockLabel(a), cb = clockLabel(b);
  const sameDay = a.year === b.year && a.month === b.month && a.day === b.day;
  const times = sameDay && ca.suffix === cb.suffix
    ? `${ca.hour}:${ca.minute}–${cb.hour}:${cb.minute} ${ca.suffix}`
    : `${ca.hour}:${ca.minute} ${ca.suffix}–${cb.hour}:${cb.minute} ${cb.suffix}`;
  const when = sameDay ? `${dateLabel(a)}, ${times}` : `${dateLabel(a)}, ${ca.hour}:${ca.minute} ${ca.suffix}–${dateLabel(b)}, ${cb.hour}:${cb.minute} ${cb.suffix}`;
  return `${when} (hora Colombia)`;
}

export function callSchedule(nowMs, preference, timezone) {
  if (preference === 'asap') {
    const due = new Date(nowMs + QUARTER_MS);
    return {call_due_at: formatDue(due), call_due_at_iso: due.toISOString(), call_window_colombia: 'Lo antes posible'};
  }
  const window = WINDOWS[preference];
  if (!window) return blank;
  const {due, start, end} = nextWindow(nowMs, window[0], window[1], validTimeZone(timezone) ? timezone : CLINIC_TZ);
  return {call_due_at: formatDue(due), call_due_at_iso: due.toISOString(), call_window_colombia: formatWindow(start, end)};
}
