/* Runs before the GTM snippet. That container's Custom HTML tag injects a second copy of the
   same LeadConnector chat widget our pill opens. Only the first loader.js is allowed to enter
   the DOM, and GHL's own bubble/prompt are hidden so the gold Sofía pill stays the only launcher. */
(function(){if(!window.Node||!window.MutationObserver||!document.documentElement)return;
 var MARK='widgets.leadconnectorhq.com/loader.js',HIDE='#lc_text-widget--btn,.lc_text-widget--bubble,.lc_text-widget--prompt{display:none!important}#lc_text-widget{pointer-events:none}#lc_text-widget--box{pointer-events:auto}';
 var claimed=!!document.querySelector('script[src*="'+MARK+'"]');
 function isLoader(n){if(!n||n.nodeType!==1||n.tagName!=='SCRIPT')return false;return String(n.getAttribute('src')||n.src||'').indexOf(MARK)!==-1;}
 function block(n){if(!isLoader(n))return false;if(claimed)return true;claimed=true;return false;}
 var appendChild=Node.prototype.appendChild,insertBefore=Node.prototype.insertBefore,replaceChild=Node.prototype.replaceChild,insertAdjacentElement=Element.prototype.insertAdjacentElement;
 Node.prototype.appendChild=function(n){return block(n)?n:appendChild.call(this,n);};
 Node.prototype.insertBefore=function(n,ref){return block(n)?n:insertBefore.call(this,n,ref);};
 Node.prototype.replaceChild=function(n,old){return block(n)?old:replaceChild.call(this,n,old);};
 // Chrome's native append/prepend do not go through a patched appendChild, so route them through it.
 Element.prototype.append=function(){for(var i=0;i<arguments.length;i++)this.appendChild(arguments[i]);};
 Element.prototype.prepend=function(){for(var i=0;i<arguments.length;i++)this.insertBefore(arguments[i],this.firstChild);};
 Element.prototype.insertAdjacentElement=function(pos,el){if(pos==='beforeend')return this.appendChild(el);if(pos==='afterbegin')return this.insertBefore(el,this.firstChild);return block(el)?el:insertAdjacentElement.call(this,pos,el);};
 function hide(w){var root=w.shadowRoot;if(!root||root.querySelector('style[data-fc-hide]'))return;var s=document.createElement('style');s.setAttribute('data-fc-hide','');s.textContent=HIDE;root.appendChild(s);}
 function arm(w){if(w.__fcGhl)return;w.__fcGhl=1;var tick=function(){hide(w);if(w.shadowRoot&&!w.__fcMo){w.__fcMo=1;new MutationObserver(function(){hide(w);}).observe(w.shadowRoot,{childList:true,subtree:true});}};tick();new MutationObserver(tick).observe(w,{attributes:true,childList:true});}
 function adopt(){var all=document.querySelectorAll('chat-widget'),scripts=document.querySelectorAll('script[src*="'+MARK+'"]'),i;for(i=1;i<all.length;i++)all[i].remove();for(i=1;i<scripts.length;i++)scripts[i].remove();if(all[0])arm(all[0]);}
 new MutationObserver(adopt).observe(document.documentElement,{childList:true,subtree:true});adopt();
})();
