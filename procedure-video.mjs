import {webvtt} from './subtitles.mjs';
import fs from 'node:fs';
import {read,write,esc} from './editorial.mjs';
const mapping={'mommy-makeover':'mommy',facelift:'facelift',rhinoplasty:'rhinoplasty','breast-augmentation':'mammoplasty','breast-lift-reduction':'mammoplasty'};
const time=s=>new Date(Math.round(s*1000)).toISOString().slice(11,23);
export function procedureVideo(body,p,origin){
 const key=mapping[p.slug];if(!key)return {body,schemas:[]};
 const v=read(`content/videos/${key}.json`),es=p.lang==='es',lang=p.lang;
 for(const l of ['en','es'])write(`dist/assets/${key}-${l}.vtt`,webvtt(v.cues,l));
 const heading=es?'El doctor explica el procedimiento':'The procedure, explained by the doctor';
 const block=`<section class="section wrap" data-surface="plum" data-procedure-video><p class="eyebrow">Dr. Fulvio Correa · ${Math.floor(v.duration/60)}:${String(Math.floor(v.duration%60)).padStart(2,'0')}</p><h2>${heading}</h2><figure class="lipo-video"><video controls playsinline preload="none" width="960" height="540" poster="${v.thumbnail}" aria-label="${esc(v.name)}"><source src="${v.contentUrl}" type="video/mp4">${['en','es'].map(l=>`<track kind="subtitles" src="/assets/${key}-${l}.vtt" srclang="${l}" label="${l==='en'?'English':'Español'}"${l===lang?' default':''}>`).join('')}<a href="${v.contentUrl}">${es?'Ver video':'Watch video'}</a></video><figcaption>${es?'Audio en inglés · Subtítulos en inglés y español. Los resultados individuales varían; consulta las condiciones actuales de valoración y acompañamiento con el equipo.':'English audio · English and Spanish subtitles. Individual results vary; confirm current consultation and support arrangements with the team.'}</figcaption><details><summary>${es?'Leer la transcripción en español':'Read the English transcript'}</summary><p>${es?'Traducción del video original del consultorio.':'Transcript of the original practice video.'}</p>${v.cues.map(c=>`<p>${esc(c[lang])}</p>`).join('')}</details></figure></section>`;
 body=body.replace('no-top detail-grid','no-top lipo-guide').replace(/<div class="detail-image">[\s\S]*?<\/div>/,'');
 for(const label of es?['¿Para quién se considera?','Técnica','Estancia en Cartagena']:['Candidates','Technique','Stay in Cartagena'])body=body.replace(`<section><h2>${label}</h2>`,`<details data-topic="${label}"><summary>${label}</summary><div>`).replace(new RegExp(`(<details data-topic="${label.replace(/[?]/g,'\\?')}">[\\s\\S]*?)</section>`),'$1</div></details>');
 body=body.replace('<section class="section wrap no-top lipo-guide"',block+'<section class="section wrap no-top lipo-guide"');
 return {body,schemas:[{'@context':'https://schema.org','@type':'VideoObject',name:v.name,description:es?'Presentación del procedimiento por el Dr. Fulvio Correa.':'An introduction to the procedure by Dr. Fulvio Correa.',thumbnailUrl:origin+v.thumbnail,uploadDate:v.uploadDate,duration:`PT${Math.floor(v.duration)}S`,contentUrl:v.contentUrl,inLanguage:'en',transcript:v.cues.map(c=>c[lang]).join(' ')}]};
}
