/* Sofía widget: "Choose how to connect" creates the lead (POST /api/lead, event lead_created); picking a channel
   sends channel_selected with the same lead_id and phone. Requests use keepalive and are never awaited before an
   app opens. Personal data is kept in memory only; the dataLayer receives no personal data. See LEAD-WEBHOOK.md. */
(()=>{'use strict';if(typeof document==='undefined')return;
 const dialog=document.getElementById('contact-dialog');if(!dialog)return;
 const config=window.SITE_CONFIG||{},channels=config.contactChannels||{},lang=document.documentElement.lang==='es'?'es':'en',t=(en,es)=>lang==='es'?es:en;
 const open=document.getElementById('contact-open'),form=document.getElementById('contact-intake'),panel=document.getElementById('contact-channels'),status=document.getElementById('contact-status');
 const callForm=document.getElementById('contact-call-form'),callButton=document.getElementById('contact-call'),callDone=document.getElementById('contact-call-done'),callTz=document.getElementById('contact-call-tz');
 const KEYS=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid'];
 let contact=null,leadId='',leadKey='',started=false;const sent=new Set();
 const read=key=>{try{return JSON.parse(sessionStorage.getItem(key));}catch{return null;}};
 let timezone='';try{timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch{}
 // Anonymous measurement only after cookie consent (same rule as app.js). Never name/phone.
 const track=(event,detail={})=>{if(read('fc_consent')!=='granted')return;const d={...detail,language:lang,page_lang:lang,page_path:location.pathname};window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...d});};
 const uid=()=>globalThis.crypto?.randomUUID?.()||'l'+Date.now().toString(36)+Math.random().toString(36).slice(2,12);
 const pathOnly=u=>{try{const x=new URL(u);return x.origin+x.pathname;}catch{return '';}};
 const payload=extra=>{const a=read('fc_attribution')||{},f=a.first_touch||{},l=a.last_touch||{},s=a.session||{},p={};
  for(const k of KEYS){p[k]=l[k]||'';p[k+'_first']=f[k]||'';p[k+'_last']=l[k]||'';}
  const consent=form.querySelector?.('[data-consent-version]');
  return {...contact,...p,lead_id:leadId,page_url:location.origin+location.pathname,page_title:document.title||'',referrer:s.referrer||f.referrer||pathOnly(document.referrer),landing_page:s.landing_page||f.landing_page||'',landing_url_first:f.landing_page||'',referrer_first:f.referrer||'',attribution_timestamp:f.timestamp||'',
   timezone,ga_client_id:(String(document.cookie||'').match(/(?:^|; )_ga=GA\d\.\d\.(\d+\.\d+)/)||[])[1]||'',consent_version:consent?.dataset.consentVersion||'',consent_text:(consent?.textContent||'').replace(/\s+/g,' ').trim(),measurement_consent:read('fc_consent')||'denied',form_id:'contact-widget',client_timestamp:new Date().toISOString(),journey:(()=>{try{return localStorage.getItem('fc_journey')}catch{}})()||'',...extra};};
 // Resolves to the server JSON when accepted, otherwise null. keepalive lets the request finish if the page is left.
 const post=body=>config.leadEndpoint?fetch(config.leadEndpoint,{method:'POST',keepalive:true,credentials:'same-origin',headers:{'Content-Type':'application/json','Idempotency-Key':body.event_id},body:JSON.stringify(body)}).then(r=>r.text().then(x=>{let j={};try{j=JSON.parse(x);}catch{}return r.ok&&j.accepted===true?j:null;})).catch(()=>null):Promise.resolve(null);
 const choose=(channel,extra={})=>{if(!contact)return Promise.resolve(null);const eventId=leadId+'-'+channel+(extra.preferred_call_time?'-'+extra.preferred_call_time:'');
  if(!sent.has(eventId))track('contact_channel_selected',{channel,procedure:contact.procedure,cta_id:'contact-'+channel});if(channel==='whatsapp'&&!sent.has(eventId))track('whatsapp_click',{procedure:contact.procedure,link_location:'contact-widget',channel,cta_id:'contact-whatsapp'});
  if(sent.has(eventId)&&channel!=='call')return Promise.resolve(null);sent.add(eventId);
  return post(payload({...extra,event:'channel_selected',event_id:eventId,channel,contact_preference:channel,button_id:'contact-'+channel})).then(r=>{if(!r){sent.delete(eventId);return r;}track('lead_submit',{contact_preference:channel,procedure:contact.procedure});return r;});};
 let opener=open;
 const showContact=(trigger)=>{opener=trigger;track('sofia_open',{link_location:trigger?.dataset?.cta||trigger?.id||'sofia'});const procedure=trigger.dataset.procedure;if(procedure&&[...form.elements.procedure.options].some(o=>o.value===procedure)){form.elements.procedure.value=procedure;form.hidden=false;panel.hidden=true;}document.querySelector('.nav')?.classList.remove('open');document.querySelector('.menu-toggle')?.setAttribute('aria-expanded','false');dialog.showModal();open.setAttribute('aria-expanded','true');document.body.classList.add('contact-is-open');(form.hidden?document.getElementById('contact-channel-title'):form.elements.name).focus();};
 open.onclick=()=>showContact(open);
 document.querySelectorAll('[data-open-contact]').forEach(button=>button.addEventListener('click',()=>showContact(button)));
 document.getElementById('contact-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{open.setAttribute('aria-expanded','false');document.body.classList.remove('contact-is-open');opener.focus();});
 form.elements.phone.setAttribute('aria-describedby','contact-phone-help');
 form.elements.phone.oninput=()=>form.elements.phone.setCustomValidity('');
 const startForm=()=>{if(!started){started=true;track('form_start',{form_id:'contact-widget'});}};form.addEventListener?.('input',startForm);form.addEventListener?.('change',startForm);
 form.onsubmit=e=>{e.preventDefault();if(form.elements.website.value)return;
  const name=form.elements.name.value.trim(),parsed=window.FCPhone?.read(form.elements.phone.value),phone=parsed?.number||'';
  form.elements.name.setCustomValidity(name?'':t('Enter your name.','Escribe tu nombre.'));
  form.elements.phone.setCustomValidity(parsed?'':t('Check the selected country and enter your full phone number.','Revisa el país seleccionado y escribe tu número completo.'));
  if(!form.reportValidity())return;
  const selected=form.elements.procedure,procedure=selected.options[selected.selectedIndex].textContent;
  contact={name,phone,phone_country:parsed.country,phone_country_code:parsed.dial,procedure:selected.value,procedure_label:procedure,contact_consent:true,sms_consent:true,language:lang};
  // One lead per set of details: editing name/phone/procedure creates a new lead_id; re-submitting unchanged details does not.
  const key=JSON.stringify([name,phone,selected.value]);
  if(key!==leadKey){leadKey=key;leadId=uid();sent.clear();post(payload({event:'lead_created',event_id:leadId+'-created',contact_preference:'pending',button_id:opener?.dataset?.cta||'contact-widget-open'})).then(r=>{if(r){track('generate_lead',{form_id:'contact-widget',procedure:selected.value,lead_source:'contact_widget'});track('lead_submit',{contact_preference:'pending',procedure:selected.value});}});}
  const message=t(`Hello Sofía, my name is ${name}. My phone number is ${phone}. I am interested in ${procedure}.`,`Hola Sofía, me llamo ${name}. Mi teléfono es ${phone}. Me interesa ${procedure}.`)+` [ref: ${selected.value}-${lang}]`;
  const whatsapp=document.getElementById('contact-whatsapp');if(whatsapp)whatsapp.href='https://wa.me/'+channels.whatsapp+'?text='+encodeURIComponent(message);
  const sms=document.getElementById('contact-sms');if(sms)sms.href='sms:'+channels.sms+(/iPad|iPhone|iPod/.test(navigator.userAgent)?'&':'?')+'body='+encodeURIComponent(message);
  if(callForm){callForm.hidden=true;callDone.hidden=true;callButton.setAttribute('aria-expanded','false');}
  form.hidden=true;panel.hidden=false;status.textContent='';document.getElementById('contact-channel-title').focus({preventScroll:true});dialog.scrollTop=0;
 };
 form.elements.name.oninput=()=>form.elements.name.setCustomValidity('');
 document.getElementById('contact-back').onclick=()=>{panel.hidden=true;form.hidden=false;status.textContent='';form.elements.name.focus();};
 // Messaging apps: the link opens natively (no preventDefault, nothing awaited); the CRM update rides along with keepalive.
 document.querySelectorAll('[data-contact-channel]').forEach(a=>a.addEventListener('click',e=>{if(!contact){e.preventDefault();return;}choose(a.dataset.contactChannel);status.textContent=t('Complete and send your message in the selected app.','Completa y envía tu mensaje en la aplicación elegida.');}));
 // "Call me": records channel=call with the preferred time window; no chat is opened.
 if(callForm){
  callButton.addEventListener('click',()=>{if(!contact)return;const show=callForm.hidden;callForm.hidden=!show;callButton.setAttribute('aria-expanded',String(show));callDone.hidden=true;status.textContent='';
   if(timezone){callTz.textContent=t('Times are in your time zone: ','Horario según tu zona horaria: ')+timezone;callTz.hidden=false;}});
  callForm.onsubmit=e=>{e.preventDefault();if(!contact)return;const choice=callForm.querySelector('input[name=preferred_call_time]:checked')||{value:'asap',nextElementSibling:{textContent:''}},label=choice.nextElementSibling?.textContent||'',submit=document.getElementById('contact-call-submit');
   submit.disabled=true;status.textContent=t('Sending your request…','Enviando tu solicitud…');
   choose('call',{preferred_call_time:choice.value}).then(r=>{submit.disabled=false;
    if(!r){status.textContent=t('We could not send your request. Please try again or write to us on WhatsApp.','No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.');return;}
    status.textContent='';callForm.hidden=true;callButton.setAttribute('aria-expanded','false');
    callDone.textContent=t(`Thank you, ${contact.name.split(' ')[0]}. Our team will call you at ${contact.phone}`,`Gracias, ${contact.name.split(' ')[0]}. Nuestro equipo te llamará al ${contact.phone}`)+(choice.value==='asap'?t(' as soon as possible',' lo antes posible'):', '+label.toLowerCase())+(timezone?t(`, your time zone: ${timezone}.`,`, según tu zona horaria: ${timezone}.`):'.');
    callDone.hidden=false;callDone.focus?.();});};
 }
})();
