import {read,esc} from './editorial.mjs';
const video=read('data/liposuction-video.json');
export function liposuctionView(body,lang){
 const es=lang==='es',labels=es?['Resumen','¿Para quién se considera?','Técnica','Estancia en Cartagena','Riesgos específicos','Recuperación por semanas']:['Overview','Candidates','Technique','Stay in Cartagena','Specific risks','Recovery timeline'];
 const ids=['overview','candidates','technique','travel','risks','recovery'];
 body=body.replace('no-top detail-grid','no-top lipo-guide').replace(/<div class="detail-image">[\s\S]*?<\/div>/,'');
 for(let i=0;i<labels.length;i++){
  const start=`<section><h2>${labels[i]}</h2>`;
  if([1,2,3].includes(i))body=body.replace(start,`<details id="${ids[i]}"><summary>${labels[i]}</summary><div>`).replace(new RegExp(`(<details id="${ids[i]}">[\\s\\S]*?)</section>`),'$1</div></details>');
  else body=body.replace(start,`<section id="${ids[i]}"><h2>${labels[i]}</h2>`);
 }
 const videoLabel=es?'Liposucción con el Dr. Fulvio Correa (video)':'Liposuction with Dr. Fulvio Correa (video)';
 const block=`<section class="section wrap" data-surface="plum"><p class="eyebrow">Dr. Fulvio Correa · 2:04</p><h2>${es?'Conoce la liposucción':'A closer look at liposuction'}</h2><figure class="lipo-video"><video controls playsinline preload="none" width="960" height="540" poster="${video.thumbnail}" aria-label="${esc(videoLabel)}" title="${esc(videoLabel)}"><source src="${esc(video.contentUrl)}" type="video/mp4"><a href="${esc(video.contentUrl)}">${es?'Ver video':'Watch video'}</a></video><figcaption>${es?'Video original del consultorio. La valoración individual determina el plan quirúrgico.':'Original practice video. Your individual assessment determines the surgical plan.'}</figcaption></figure><nav aria-label="${es?'En esta página':'On this page'}" class="cluster-links">${labels.map((s,i)=>`<a href="#${ids[i]}">${s}</a>`).join(' · ')}</nav></section>`;
 return body.replace('<section class="section wrap no-top lipo-guide"',block+'<section class="section wrap no-top lipo-guide"');
}
export function liposuctionSchema(origin,lang){const es=lang==='es';return {'@context':'https://schema.org','@type':'VideoObject',name:es?'Liposucción con el Dr. Fulvio Correa (video)':'Liposuction with Dr. Fulvio Correa (video)',description:video.description[lang],thumbnailUrl:origin+video.thumbnail,uploadDate:video.uploadDate,duration:video.duration,contentUrl:video.contentUrl,isPartOf:{'@id':origin+`/${lang}/procedures/liposuction/`}};}
