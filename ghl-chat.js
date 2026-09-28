/* GoHighLevel (LeadConnector) chat trial, active when data/chat.json has provider "ghl".
   Nothing from GHL loads with the page: the first click on "Talk to Sofía" (or any [data-open-contact] button)
   injects the loader, then opens the widget. Our gold launcher stays the only launcher: GHL's own bubble is
   hidden inside its (open) shadow root, its colors are overridden with the site palette and Spanish pages switch
   its built-in labels to "es" (texts written in the GHL dashboard are not translated). Loader URL and
   widget ID come from data attributes rendered from data/chat.json. Revert: provider "native". */
(()=>{'use strict';const open=document.getElementById('contact-open');if(!open||!open.dataset.chat)return;
 const d=open.dataset,api=()=>window.leadConnector?.chatWidget;let loading=0;
 const palette='--chat-widget-primary-color:#d4b478;--chat-widget-active-color:#d4b478;--chat-widget-bubble-color:#d4b478;--chat-widget-primary-solid-color:#d4b478;--ion-color-primary:#d4b478;--ion-color-primary-contrast:#17101b;--chat-widget-button-color:#d4b478;--chat-widget-header-color:#211320;--chat-widget-header-darken-color:#0b090e;--chat-widget-header-message-text-color:#faf3ec;--chat-widget-background-color:#faf3ec;--chat-widget-avatar-background-color:#211320;--chat-widget-avatar-border-color:#d4b478;--chat-widget-sender-message-color:#321c30;--chat-widget-sender-message-text-color:#faf3ec;--chat-widget-received-message-color:#efe4d6;--chat-widget-received-message-text-color:#211320;--chat-widget-welcome-message-text-color:#321c30;--chat-widget-system-message-text-color:#321c30;--chat-widget-font-family:Manrope,MF,Arial,sans-serif;--color:#d4b478';
 const skin=()=>{const w=document.querySelector('chat-widget');if(!w)return;w.style.cssText+=palette;if(document.documentElement.lang==='es')w.locale='es';
  const s=document.createElement('style');s.textContent='#lc_text-widget--btn,.lc_text-widget--prompt{display:none!important}#lc_text-widget{pointer-events:none}#lc_text-widget--box{pointer-events:auto}';w.shadowRoot?.append(s);
  new MutationObserver(()=>open.setAttribute('aria-expanded',w.dataset.active==='true')).observe(w,{attributes:true,attributeFilter:['data-active']});};
 const toggle=()=>{const c=api();if(c?.isLoaded){c.isActive()?c.closeWidget():c.openWidget();return;}if(loading++)return;
  open.setAttribute('aria-busy','true');window.dataLayer?.push({event:'chat_open',chat_provider:'ghl'});
  addEventListener('LC_chatWidgetLoaded',()=>{skin();open.removeAttribute('aria-busy');api()?.openWidget();},{once:true});
  const s=document.createElement('script');s.src=d.src;s.dataset.resourcesUrl=d.resourcesUrl;s.dataset.widgetId=d.widgetId;document.body.append(s);};
 open.onclick=toggle;document.querySelectorAll('[data-open-contact]').forEach(b=>b.addEventListener('click',toggle));
})();
