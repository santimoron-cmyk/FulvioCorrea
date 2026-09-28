// Site journey sent with Sofía leads (see app.js: localStorage "fc_journey", no personal data):
//   {"v":visits,"f":firstVisitMs,"p":[[path,shortTitle,timeMs],...]}  (last 30 pages of the past 90 days)
// Validated and turned into flat webhook fields plus a ready-to-paste Spanish note in Colombia time
// (America/Bogota is UTC-5 all year, no DST). Runtime-neutral: no node: imports.
const DAY=86400000,BOGOTA=-5*3600000;
const pad=n=>String(n).padStart(2,'0');
// "28/09/2026 17:30" (full) or "28/09 17:30" (short), Colombia time.
export const colombiaTime=(ms,full=false)=>{const d=new Date(ms+BOGOTA);return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth()+1)}${full?'/'+d.getUTCFullYear():''} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;};
const text=(v,max)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,max):'';
export function parseJourney(raw,now){
 let j=raw;if(typeof j==='string'){if(!j||j.length>12000)return null;try{j=JSON.parse(j);}catch{return null;}}
 if(!j||typeof j!=='object'||Array.isArray(j)||!Array.isArray(j.p))return null;
 const ok=t=>Number.isFinite(t)&&t>now-100*DAY&&t<=now+DAY;
 const pages=j.p.slice(-30).filter(e=>Array.isArray(e)&&typeof e[0]==='string'&&/^\/[-\w/.%]{0,200}$/.test(e[0])&&ok(e[2])).map(e=>({path:e[0],title:text(e[1],60),time:e[2]}));
 if(!pages.length)return null;
 const visits=Number.isInteger(j.v)&&j.v>0&&j.v<100000?j.v:1,first=ok(j.f)&&j.f<=pages[0].time?j.f:pages[0].time;
 return {visits,first,pages};
}
const lang=path=>/^\/es(\/|$)/.test(path)?'ES':/^\/en(\/|$)/.test(path)?'EN':'';
export function journeyFields(raw,now){
 const j=parseJourney(raw,now);
 if(!j)return {journey_visits:'',journey_first_visit:'',journey_pages_count:'',journey_pages:'',journey_note:''};
 const line=p=>`${colombiaTime(p.time)} · ${p.title||p.path}${lang(p.path)?' ('+lang(p.path)+')':''} · ${p.path}`;
 const note=[`Recorrido en el sitio (hora Colombia) — visitas: ${j.visits}, primera visita: ${colombiaTime(j.first,true)}, páginas vistas: ${j.pages.length}`,...j.pages.map(p=>'• '+line(p))].join('\n');
 return {journey_visits:j.visits,journey_first_visit:colombiaTime(j.first,true),journey_pages_count:j.pages.length,journey_pages:j.pages.map(p=>p.path).join(' > '),journey_note:note};
}
