/* GoHighLevel (LeadConnector) chat trial, active when data/chat.json has provider "ghl".
   Nothing from GHL loads with the page: the first click on "Talk to Sofía" (or any [data-open-contact] button)
   injects the loader, then opens the widget. Our gold launcher stays the only launcher: GHL's own bubble is
   hidden inside its (open) shadow root and it is restyled to look like the native Sofía dialog. The agent is Sofía
   (gold "S" avatar) and every dashboard text is replaced per page language from data/chat.json (data-texts);
   Spanish pages also switch GHL's built-in labels to "es". Procedure options keep their CRM values; only the
   visible option text is translated. Loader URL and
   widget ID come from data attributes rendered from data/chat.json. Revert: provider "native". */
(()=>{'use strict';const open=document.getElementById('contact-open');if(!open||!open.dataset.chat)return;
 const d=open.dataset,api=()=>window.leadConnector?.chatWidget;let loading=0;
 // Native Sofía dialog look (theme-luxury .contact-*): palette through GHL's CSS variables, the rest through a sheet adopted by each
 // open shadow root. Selectors are GHL class names; if GHL renames them the rule simply stops matching and the palette look remains.
 const palette='--chat-widget-primary-color:#d4b478;--chat-widget-active-color:#d4b478;--chat-widget-bubble-color:#d4b478;--chat-widget-primary-solid-color:#d4b478;--ion-color-primary:#d4b478;--ion-color-primary-contrast:#0b090e;--chat-widget-button-color:#d4b478;--chat-widget-header-color:#241429;--chat-widget-header-darken-color:#150f1a;--chat-widget-header-message-text-color:#faf3ec;--chat-widget-background-color:#150f1a;--chat-widget-avatar-background-color:#d4b478;--chat-widget-avatar-border-color:#d4b478;--chat-widget-sender-message-color:#d4b478;--chat-widget-sender-message-text-color:#0b090e;--chat-widget-received-message-color:#322139;--chat-widget-received-message-text-color:#faf3ec;--chat-widget-welcome-message-text-color:#faf3ec;--chat-widget-system-message-text-color:#cdbfc8;--chat-widget-font-family:Manrope,MF,Arial,sans-serif;--color:#d4b478';
 const look='.lc_text-widget--box{background:#150f1a!important;border:1px solid #705b6d!important;border-radius:20px!important;box-shadow:0 24px 80px #0004!important;overflow:hidden}'+
  '.lc_text-widget_heading--root{background:#241429!important;border-radius:0!important}.lc_text-widget_heading--content div{font:22px Georgia,serif!important;color:#faf3ec!important}.lc_text-widget_heading--content{text-align:left!important}.lc_text-widget--form:after{background:transparent!important;border-color:transparent!important;box-shadow:none!important}.chat-selection-button svg [stroke="#344054"],.chat-selection-button svg [stroke="#475467"]{stroke:#d4b478}.chat-selection-button svg [fill="#475467"]{fill:#d4b478}.lc_send_button--container .btn{width:100%!important;padding:13px 16px!important}.header-circular-image-container{border:0!important}'+
  '.lc_text-widget--formContainer,.lc_text-widget--back-button-container{background:#150f1a!important}.lc_text-widget_sub-heading--root{background:#322139!important;color:#faf3ec!important;border-radius:2px 14px 14px!important;padding:16px!important;font-size:15px!important;line-height:1.55!important}'+
  '.chat-selection-root,.chat-selection-actions,.lc_text-widget--form,.lc_legal-text-wrapper{background:transparent!important;border:0!important}'+
  '.chat-selection-button{--background:#25192d;--background-hover:#382341;--color:#faf3ec;--border-radius:8px;background:#25192d!important;border:1px solid #604961!important;border-radius:8px!important;min-height:52px}.chat-selection-button:hover{background:#382341!important;border-color:#d4b478!important}.chat-selection-button-text{color:#faf3ec!important;font:14px Manrope,MF,Arial,sans-serif!important}'+
  '.lc_text-widget--text-input{background:#211729!important;border:1px solid #715c72!important;border-radius:6px!important}.lc_text-widget--text-input input,.lc_text-widget--text-input select{background:transparent!important;color:#faf3ec!important}.lc_text-widget--text-input ::placeholder{color:#cdbfc8!important}.lc_text-widget--text-input option{background:#211729;color:#faf3ec}'+
  '.lc_legal-msg{color:#cdbfc8!important;font-size:11px!important;line-height:1.5!important}.btn.btn-primary{background:#d4b478!important;color:#0b090e!important;border-radius:6px!important;font-size:14px!important}.lc_text-widget--back-button{--color:#cdbfc8;--border-color:#604961}';

 const skin=()=>{const w=document.querySelector('chat-widget');if(!w)return;w.style.cssText+=palette;const {fields={},options={},labels,subtitle='',...texts}=JSON.parse(d.texts||'{}'),r=w.shadowRoot,es=document.documentElement.lang==='es';Object.assign(w,texts);if(es)w.locale='es';if(labels)
   // localizeWidget replaces GHL's whole dictionary, so once GHL has fetched its own /i18n/<locale>.json, re-read it (cached) and apply it with our labels on top.
   new PerformanceObserver(l=>l.getEntries().forEach(e=>e.name.includes(`/i18n/${es?'es':'en-us'}.json`)&&fetch(e.name).then(x=>x.json()).then(j=>api()?.localizeWidget({...j,...labels},es?'es':'en-us'),()=>{}))).observe({type:'resource',buffered:true});
  try{w.contactFormOptions=JSON.stringify(JSON.parse(w.contactFormOptions).map(f=>fields[f.fieldKey]?{...f,label:fields[f.fieldKey],placeholder:fields[f.fieldKey]}:f));}catch{}
  // Option text (and the look) lives in the widget's root and in nested roots (the live-chat form); watch each root once.
  const sheet=new CSSStyleSheet(),seen=new WeakSet(),mo=new MutationObserver(()=>relabel(r)),relabel=x=>{if(!seen.has(x)){seen.add(x);mo.observe(x,{childList:true,subtree:true});x.adoptedStyleSheets=[...x.adoptedStyleSheets,sheet];}
   x.querySelectorAll('*').forEach(e=>{if(e.shadowRoot)relabel(e.shadowRoot);const t=e.tagName==='OPTION'&&options[e.value];if(t&&e.textContent!==t)e.textContent=t;});};sheet.replaceSync(look+'.lc_text-widget_heading--content div:after{content:'+JSON.stringify(subtitle)+';display:block;font:11px Manrope,MF,Arial,sans-serif;color:#cdbfc8;margin-top:2px}');relabel(r);
  const s=document.createElement('style');s.textContent='#lc_text-widget--btn,.lc_text-widget--prompt{display:none!important}#lc_text-widget{pointer-events:none}#lc_text-widget--box{pointer-events:auto}';r.append(s);
  new MutationObserver(()=>open.setAttribute('aria-expanded',w.dataset.active==='true')).observe(w,{attributes:true,attributeFilter:['data-active']});};
 const toggle=()=>{const c=api();if(c?.isLoaded){c.isActive()?c.closeWidget():c.openWidget();return;}if(loading++)return;
  open.setAttribute('aria-busy','true');window.dataLayer?.push({event:'chat_open',chat_provider:'ghl'});
  addEventListener('LC_chatWidgetLoaded',()=>{skin();open.removeAttribute('aria-busy');api()?.openWidget();},{once:true});
  const s=document.createElement('script');s.src=d.src;s.dataset.resourcesUrl=d.resourcesUrl;s.dataset.widgetId=d.widgetId;document.body.append(s);};
 open.onclick=toggle;document.querySelectorAll('[data-open-contact]').forEach(b=>b.addEventListener('click',toggle));
})();
