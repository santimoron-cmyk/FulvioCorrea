(()=>{'use strict';
 const config=window.SITE_CONFIG||{},lang=document.documentElement.lang==='es'?'es':'en';
 const messages=lang==='es'?{preview:'No pudimos enviar tu solicitud. Contacta al equipo por WhatsApp para continuar.',sending:'Enviando tu solicitud…',received:'Recibimos tu solicitud. El equipo te contactará para conversar sobre la disponibilidad.',done:'Solicitud recibida',error:'No pudimos confirmar la recepción. Intenta de nuevo o contacta al consultorio por WhatsApp.'}:{preview:'We could not send your request. Please contact the team on WhatsApp to continue.',sending:'Sending your request…',received:'Your request has been received. The team will contact you to discuss availability.',done:'Request received',error:'We could not confirm receipt. Please try again or contact the practice on WhatsApp.'};
 const read=k=>{try{return JSON.parse(sessionStorage.getItem(k));}catch{return null;}},save=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify(v));}catch{}};
 const pathOnly=u=>{try{const x=new URL(u);return x.origin+x.pathname;}catch{return '';}};
 const keys=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid'],params=new URLSearchParams(location.search),entry=read('fc_entry');
 const touch={timestamp:entry?.timestamp||new Date().toISOString(),landing_page:entry?.landing_page||pathOnly(location.href),referrer:pathOnly(entry?.referrer||document.referrer)};
 try{sessionStorage.removeItem('fc_entry');}catch{}
 keys.forEach(k=>{if(params.has(k))touch[k]=params.get(k).slice(0,500);});
 let durable=null;try{durable=JSON.parse(localStorage.getItem('fc_first_touch'));if(!durable?.expires||durable.expires<=Date.now()){durable=null;localStorage.removeItem('fc_first_touch');}}catch{}
 const stored=read('fc_attribution');let attribution={first_touch:durable?.value||touch,last_touch:stored?.last_touch||touch,session:stored?.session||{timestamp:touch.timestamp,landing_page:touch.landing_page,referrer:touch.referrer}};
 // first_touch: localStorage, 90 days. last_touch: changes only with new campaign params. session: first page of this tab session (read by the contact widget).
 if(stored&&keys.some(k=>touch[k])){
  // Switching languages retains the same campaign rather than creating a new touch.
  if(!keys.every(k=>(stored.last_touch[k]||'')===(touch[k]||'')))attribution={...attribution,last_touch:touch};
 }
 // Journey (first-party, no personal data): visit count (new tab session = new visit), first visit and the last 30 pages
 // of the past 90 days as [path, short title, time]. Sent with Sofía leads (contact-widget.js) so the team sees the path.
 try{const n=Date.now(),j=JSON.parse(localStorage.getItem('fc_journey'))||{v:0,f:n,p:[]};stored||j.v++;j.p=[...j.p.filter(e=>n-e[2]<7776e6),[location.pathname,document.title.split(' | ')[0].slice(0,60),n]].slice(-30);localStorage.setItem('fc_journey',JSON.stringify(j));}catch{}
 save('fc_attribution',attribution);try{if(!durable)localStorage.setItem('fc_first_touch',JSON.stringify({value:attribution.first_touch,expires:Date.now()+90*86400000}));}catch{}
 document.querySelectorAll('a[data-language]').forEach(a=>{
  const target=new URL(a.href,location.origin);target.search=location.search;target.hash=location.hash;a.href=target.href;
  a.addEventListener('click',()=>{try{localStorage.setItem('fc_language',a.dataset.language);}catch{}});
 });
 let consent=read('fc_consent');window.dataLayer=window.dataLayer||[];
 function gtag(){window.dataLayer.push(arguments);}
 const consentFlags=v=>({analytics_storage:v,ad_storage:v,ad_user_data:v,ad_personalization:v});
 const event=(name,extra={})=>{if(consent!=='granted')return;window.dataLayer.push({event:name,page_path:location.pathname,language:lang,page_lang:lang,...extra});};
 const banner=document.getElementById('cookie-banner');banner.hidden=!!consent;
 document.getElementById('privacy-settings').onclick=()=>{banner.hidden=false;};
 let sawProcedure=false;
 function procedureView(){const procedure=document.querySelector('main[data-procedure]')?.dataset.procedure;if(!procedure||sawProcedure)return;sawProcedure=true;event('procedure_view',{procedure});}
 function choose(v){const prev=consent;consent=v;save('fc_consent',v);banner.hidden=true;gtag('consent','update',consentFlags(v));if(v==='granted')procedureView();else if(prev==='granted'&&document.getElementById('gtm-script'))location.reload();}
 document.getElementById('accept-analytics').onclick=()=>choose('granted');document.getElementById('reject-analytics').onclick=()=>choose('denied');if(consent==='granted')procedureView();
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}});
 document.addEventListener('click',e=>{const el=e.target.closest('a[data-event]');if(!el)return;const name=el.dataset.event,procedure=el.dataset.procedure||document.querySelector('main[data-procedure]')?.dataset.procedure||'',link_location=el.dataset.location||el.id||'';if(name==='whatsapp_click')event(name,{procedure,link_location,cta_id:el.id});else if(name==='phone_click')event(name,{link_location,cta_id:el.id});else event(name,{cta_id:el.id});});
 const tabs=[...document.querySelectorAll('.pillar-tabs [role=tab]')];
 const activate=t=>tabs.forEach(b=>{const active=b===t;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=!active;});
 tabs.forEach((t,i)=>{t.onclick=()=>activate(t);t.onkeydown=e=>{let next;if(e.key==='ArrowRight')next=tabs[(i+1)%tabs.length];if(e.key==='ArrowLeft')next=tabs[(i+tabs.length-1)%tabs.length];if(e.key==='Home')next=tabs[0];if(e.key==='End')next=tabs.at(-1);if(next){e.preventDefault();activate(next);next.focus();}};});
 const pause=document.getElementById('credential-pause');if(pause)pause.onclick=()=>{const paused=pause.getAttribute('aria-pressed')!=='true';pause.setAttribute('aria-pressed',String(paused));document.querySelector('.credential-track').classList.toggle('paused',paused);pause.textContent=lang==='es'?(paused?'Reanudar animación':'Pausar animación'):(paused?'Resume animation':'Pause animation');};
 document.querySelectorAll('[data-result-slider]').forEach(input=>input.addEventListener('input',()=>{input.closest('.result-comparison').style.setProperty('--reveal',input.value+'%');input.setAttribute('aria-valuetext',lang==='es'?input.value+'% antes, '+(100-input.value)+'% después':input.value+'% before, '+(100-input.value)+'% after');}));
 const form=document.getElementById('consultation-form');if(!form)return;
 const leadId=globalThis.crypto?.randomUUID?.()||('lead-'+Date.now()+'-'+Math.random().toString(36).slice(2));
 const flat={...Object.fromEntries(keys.map(k=>[k,attribution.last_touch[k]||''])),landing_page:attribution.first_touch.landing_page,referrer:attribution.first_touch.referrer,first_touch:JSON.stringify(attribution.first_touch),last_touch:JSON.stringify(attribution.last_touch),conversion_page:pathOnly(location.href),lead_id:leadId};
 for(const [k,v]of Object.entries(flat)){const input=form.elements.namedItem(k);if(input){input.value=v;input.setAttribute('value',v);}}
 const requested=params.get('procedure');if(requested&&[...form.elements.procedure.options].some(o=>o.value===requested))form.elements.procedure.value=requested;
 let started=false;form.addEventListener('input',()=>{if(!started){event('form_start',{form_id:form.id});started=true;}});
 form.onsubmit=async e=>{e.preventDefault();const status=document.getElementById('form-status');if(form.elements.website?.value)return;if(!form.reportValidity())return;if(!config.leadEndpoint){status.textContent=messages.preview;return;}
 const button=form.querySelector('[type=submit]');button.disabled=true;status.textContent=messages.sending;const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),15000);
 try{const response=await fetch(config.leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':leadId},body:JSON.stringify({...Object.fromEntries(new FormData(form)),form_id:form.dataset.form||'consultation',sms_consent:form.elements.sms_consent?.checked||false,measurement_consent:consent||'denied',consent_timestamp:new Date().toISOString()}),signal:abort.signal});if(!response.ok)throw new Error('Request failed');const text=await response.text();let result={};if(text){try{result=JSON.parse(text);}catch{}}if(result.accepted!==true)throw new Error('No confirmation');status.textContent=messages.received;event('form_submit',{form_id:form.id,lead_id:leadId});event('lead_submit',{contact_preference:'consultation',procedure:form.elements.procedure?.value||''});try{sessionStorage.setItem('fc_lead_received','true');}catch{}location.assign(lang==='es'?'/es/gracias/':'/en/thank-you/');}catch{status.textContent=messages.error;button.disabled=false;event('form_error',{form_id:form.id});}finally{clearTimeout(timeout);}
 };
})();
