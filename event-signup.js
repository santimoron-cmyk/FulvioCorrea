/* Event sign-up form (event-view.mjs): POST /api/lead as a lead_created with event_tag, city and companion.
   Same endpoint, attribution and journey fields as the Sofía widget; dataLayer events follow the site's consent rule.
   The Aromas form always sends procedure_interest (select value, or undecided). procedure and procedure_label stay mapped from that same value; the -v1 form has no select and still sends mommy-makeover.
   utm_source, utm_medium and utm_campaign are read from this landing's query string and kept in sessionStorage (fc_event_utm) so a reload still sends them. */
(()=>{'use strict';const form=document.getElementById('event-signup-form');if(!form)return;
 const lang=document.documentElement.lang==='es'?'es':'en',tagName=form.dataset.eventTag||'',status=document.getElementById('event-signup-status'),button=document.getElementById('event-signup-submit');
 const aromas=document.body.dataset.eventShell==='aromas';
 const T=lang==='es'?{sending:'Enviando tu registro…',ok:n=>aromas?`¡Listo, ${n}! Recibimos tu registro para el conversatorio del viernes 6 de noviembre de 2026, 6:00 p. m., en Aromas Med Spa Doral, con vino y picadas. El equipo de Aromas Med Spa te contactará por WhatsApp para confirmar tu cupo. Si los 30 cupos ya están completos, quedarás en la lista de espera y te avisaremos si se libera un lugar.`:`¡Listo, ${n}! Recibimos tu registro. El equipo de Aromas Med Spa te contactará por WhatsApp para confirmar la fecha, la hora y tu cupo. Si los 30 cupos ya están completos, quedarás en la lista de espera y te avisaremos si se libera un lugar.`,error:'No pudimos confirmar tu registro. Inténtalo de nuevo en un momento o llama a Aromas Med Spa al (305) 591-3005.',phone:aromas?'Revisa el código de país y el número. Ejemplo: +1 y 305 555 0123.':'Escribe tu WhatsApp con código de país, por ejemplo +1 305 555 0123.',required:'Completa los campos marcados para reservar tu cupo.'}
  :{sending:'Sending your sign-up…',ok:n=>aromas?`Thank you, ${n}! We received your sign-up for the talk on Friday, November 6, 2026, 6:00 PM, at Aromas Med Spa Doral, with wine and light bites. The Aromas Med Spa team will contact you on WhatsApp to confirm your spot. If all 30 spots are taken, you will be on the waitlist and we will let you know if a spot opens up.`:`Thank you, ${n}! We received your sign-up. The Aromas Med Spa team will contact you on WhatsApp to confirm the date, time and your spot. If all 30 spots are taken, you will be on the waitlist and we will let you know if a spot opens up.`,error:'We could not confirm your sign-up. Please try again in a moment or call Aromas Med Spa at (305) 591-3005.',phone:aromas?'Check the country code and the number. Example: +1 and 305 555 0123.':'Enter your WhatsApp number with country code, e.g. +1 305 555 0123.',required:'Please complete the highlighted fields to save your spot.'};
 const read=k=>{try{return JSON.parse(sessionStorage.getItem(k));}catch{return null;}};
 const UTM=['utm_source','utm_medium','utm_campaign'],UTM_KEY='fc_event_utm';
 const params=new URLSearchParams(location.search);let eventUtm=read(UTM_KEY);if(!eventUtm||typeof eventUtm!=='object'||Array.isArray(eventUtm))eventUtm={};
 let utmDirty=false;for(const k of UTM){if(!params.has(k))continue;const v=String(params.get(k)||'').trim().slice(0,500);if(v&&eventUtm[k]!==v){eventUtm[k]=v;utmDirty=true;}}
 if(utmDirty){try{sessionStorage.setItem(UTM_KEY,JSON.stringify(eventUtm));}catch{}}
 const push=(event,extra={})=>{if(read('fc_consent')!=='granted')return;window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,page_path:location.pathname,language:lang,page_lang:lang,form_id:'event-signup',event_tag:tagName,...extra});};
 const uid=()=>globalThis.crypto?.randomUUID?.()||'l'+Date.now().toString(36)+Math.random().toString(36).slice(2,12);
 const pathOnly=u=>{try{const x=new URL(u);return x.origin+x.pathname;}catch{return '';}};
 // WhatsApp → E.164. A bare 10-digit number (or 1 + 10) is taken as US/Canada, since the talk is in Florida.
 const e164=v=>{let d=String(v||'').trim().replace(/[\s().-]/g,'');if(d.startsWith('00'))d='+'+d.slice(2);if(!d.startsWith('+')){d=d.replace(/\D/g,'');if(d.length===10)d='+1'+d;else if(d.length===11&&d[0]==='1')d='+'+d;else d='+'+d;}return /^\+[1-9]\d{6,14}$/.test(d)?d:'';};
 const country=p=>p.startsWith('+1')?['US','+1']:p.startsWith('+57')?['CO','+57']:p.startsWith('+58')?['VE','+58']:p.startsWith('+52')?['MX','+52']:['',''];
 // Live Aromas form: country <select> + national digits, joined into the same E.164 `phone` the single field already sent. The -v1 form has no select and still uses e164().
 const phoneInput=form.elements.whatsapp,countrySel=form.elements.phone_country,otherInput=form.elements.phone_country_other,otherWrap=document.getElementById('event-phone-other');
 const lengths={'+1':[10,10],'+57':[8,11],'+52':[10,10],'+58':[10,10],'+54':[10,11],'+51':[8,9],'+56':[9,11],'+593':[8,11],'+34':[9,9],'+507':[7,11],'+506':[8,10]};
 const dial=()=>{if(!countrySel)return '';if(countrySel.value!=='other')return countrySel.value;const digits=String(otherInput?.value||'').trim().replace(/[^\d+]/g,'').replace(/^00/,'+').replace(/\D/g,'');return /^[1-9]\d{0,3}$/.test(digits)?'+'+digits:'';};
 const national=()=>{let d=String(phoneInput.value||'').replace(/\D/g,'');if(dial()&&dial()!=='+1')d=d.replace(/^0+/,'');return d;};
 const combine=()=>{if(!countrySel)return e164(phoneInput.value);const cc=dial(),d=national();if(!cc||!d)return '';if(countrySel.value==='other'){if(d.length<4||d.length>14)return '';}else{const range=lengths[cc];if(!range||d.length<range[0]||d.length>range[1])return '';}const full=cc+d;return /^\+[1-9]\d{6,14}$/.test(full)?full:'';};
 const digitsOnly=v=>String(v||'').replace(/\D/g,'');
 phoneInput.addEventListener('input',()=>{if(countrySel){const d=digitsOnly(phoneInput.value);if(d!==phoneInput.value)phoneInput.value=d;}phoneInput.setCustomValidity('');});
 phoneInput.addEventListener('paste',e=>{if(!countrySel)return;e.preventDefault();phoneInput.value=digitsOnly(e.clipboardData?.getData?.('text'));phoneInput.setCustomValidity('');});
 if(countrySel&&otherWrap)countrySel.addEventListener('change',()=>{otherWrap.hidden=countrySel.value!=='other';if(countrySel.value!=='other'&&otherInput)otherInput.value='';});
 let started=false,leadId=uid(),last='';form.addEventListener('input',()=>{if(!started){started=true;push('form_start');}});
 form.addEventListener('submit',async e=>{e.preventDefault();if(form.elements.website.value)return;
  if(countrySel)phoneInput.value=digitsOnly(phoneInput.value);
  const phone=combine();phoneInput.setCustomValidity((countrySel?national():phoneInput.value)&&!phone?T.phone:'');
  if(!form.checkValidity()){form.reportValidity();status.textContent=phoneInput.validity.customError?T.phone:T.required;push('form_error',{error:'validation'});return;}
  const a=read('fc_attribution')||{},f=a.first_touch||{},l=a.last_touch||{},s=a.session||{},attr={};
  for(const k of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid']){attr[k]=l[k]||'';attr[k+'_first']=f[k]||'';attr[k+'_last']=l[k]||'';}
  // Landing-page UTMs stored for this tab win, so a reload without the query string still passes them through.
  for(const k of UTM){const v=typeof eventUtm[k]==='string'?eventUtm[k]:'';if(!v)continue;attr[k]=v;attr[k+'_last']=v;}
  const name=form.elements.name.value.trim().replace(/\s+/g,' '),[pc,pcc]=country(phone),consentEl=form.querySelector('[data-consent-version]');
  const labels={'non-surgical':'Tratamientos no quirúrgicos / Non-surgical treatments',breast:'Cirugía de busto / Breast surgery','abdomen-contour':'Abdomen y contorno / Abdomen and contour',face:'Rostro / Face','mommy-makeover':'Mommy Makeover',undecided:'Aún no lo sé / Not sure yet',abdomen:'Abdomen','lipo-contour':'Liposucción/contorno / Liposuction & contour',other:'Otro / Other'};
  const interestEl=form.elements.procedure_interest,hasInterest=!!interestEl,picked=hasInterest?String(interestEl.value||'').trim():'';
  // Live Aromas form: procedure follows the select (default undecided) and procedure_interest is always sent. The -v1 backup has no select and stays mommy-makeover.
  const interest=hasInterest?(labels[picked]?picked:'undecided'):'',procedure=hasInterest?interest:'mommy-makeover',procedure_label=labels[procedure]||'Mommy Makeover';
  const body={event:'lead_created',lead_id:leadId,name,phone,phone_country:pc,phone_country_code:pcc,email:form.elements.email.value.trim(),city:form.elements.city.value.trim(),companion:form.elements.companion.value,
   event_tag:tagName,procedure,procedure_label,language:lang,contact_consent:form.elements.contact_consent.checked,sms_consent:false,
   consent_version:consentEl?.dataset.consentVersion||'',consent_text:(consentEl?.textContent||'').replace(/\s+/g,' ').trim(),measurement_consent:read('fc_consent')||'denied',
   ...attr,page_url:location.origin+location.pathname,page_title:document.title||'',referrer:s.referrer||f.referrer||pathOnly(document.referrer),landing_page:s.landing_page||f.landing_page||'',landing_url_first:f.landing_page||'',referrer_first:f.referrer||'',attribution_timestamp:f.timestamp||'',
   timezone:(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch{return '';}})(),ga_client_id:(String(document.cookie||'').match(/(?:^|; )_ga=GA\d\.\d\.(\d+\.\d+)/)||[])[1]||'',
   form_id:'event-signup',button_id:'event-signup-submit',client_timestamp:new Date().toISOString(),journey:(()=>{try{return localStorage.getItem('fc_journey')}catch{}})()||''};
  // Changed data = new lead id (the server rejects a reused id with different content); a plain retry keeps the id.
  if(hasInterest)body.procedure_interest=interest;
  const key=JSON.stringify([name,phone,body.email,body.city,body.companion,interest]);if(last&&key!==last)leadId=uid();last=key;body.lead_id=leadId;body.event_id=leadId+'-event';
  button.disabled=true;status.className='form-status';status.textContent=T.sending;const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),15000);
  try{const r=await fetch('/api/lead',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Idempotency-Key':body.event_id},body:JSON.stringify(body),signal:abort.signal});let j={};try{j=JSON.parse(await r.text());}catch{}
   if(!r.ok||j.accepted!==true)throw Error(j.error||String(r.status));
   status.className='form-status ok';status.textContent=T.ok(name.split(' ')[0]);const cal=document.getElementById('event-calendar');if(aromas&&cal){cal.hidden=false;status.append(cal);}form.querySelectorAll('input,button,select').forEach(x=>{if(x.type!=='hidden')x.disabled=true;});
   push('event_signup',{lead_id:leadId,companion:body.companion,city:body.city?'provided':'',procedure,...(hasInterest?{procedure_interest:interest}:{})});push('generate_lead',{lead_id:leadId,lead_type:'event_signup',procedure});
  }catch(err){status.textContent=T.error;button.disabled=false;push('form_error',{error:String(err?.message||'network').slice(0,40)});}finally{clearTimeout(timer);}
 });
})();
