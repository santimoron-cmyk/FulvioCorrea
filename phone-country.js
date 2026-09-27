/* Local-only country selection: locale region is a suggestion, never geolocation. */
(()=>{const select=document.getElementById('contact-country');if(!select)return;const picker=document.getElementById('contact-country-picker'),toggle=document.getElementById('contact-country-toggle'),search=document.getElementById('contact-country-search'),empty=document.getElementById('country-empty'),options=[...select.options];let chosen=options.find(o=>o.selected)||options[0];
for(const locale of navigator.languages||[navigator.language]){try{const region=new Intl.Locale(locale).region,option=options.find(o=>o.value===region);if(option){chosen=option;break;}}catch{}}
const update=()=>{select.value=chosen.value;toggle.textContent=chosen.textContent;};update();
const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const filter=()=>{const q=fold(search.value.trim());select.replaceChildren(...options.filter(o=>fold(o.textContent+' '+o.value).includes(q)));select.value=chosen.value;empty.hidden=!!select.options.length;};search.oninput=filter;
picker.addEventListener('toggle',()=>{if(picker.open){search.value='';filter();search.focus();}});
select.onchange=()=>{const option=options.find(o=>o.value===select.value);if(!option)return;chosen=option;update();picker.open=false;toggle.focus();document.getElementById('contact-phone').setCustomValidity('');};
search.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();select.focus();}if(e.key==='Enter'){e.preventDefault();if(select.options.length===1){select.value=select.options[0].value;select.onchange();}}};
picker.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();picker.open=false;toggle.focus();}});
window.FCPhone={read(value){const c=JSON.parse(chosen.dataset.rule);let n=value.replace(/[\s().-]/g,'');if(n.startsWith('+')){if(!n.startsWith('+'+c.code))return null;n=n.slice(c.code.length+1);}const valid=v=>c.lengths.includes(v.length)&&new RegExp('^(?:'+c.pattern+')$').test(v);if(!valid(n)&&c.prefix){const candidate=n.replace(new RegExp('^(?:'+c.prefix+')'),c.transform||'');if(valid(candidate))n=candidate;}return valid(n)&&c.code.length+n.length<=15?{number:'+'+c.code+n,country:c.iso,dial:'+'+c.code}:null;}};
})();
