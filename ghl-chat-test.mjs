import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function runChat({consent, loader=false, loaded=false, active=false, lang='en'}={}){
 const scripts=[];
 const listeners={};
 const dataLayer=[];
 const api={isLoaded:loaded,active,opened:0,closed:0,openWidget(){this.active=true;this.opened++;},closeWidget(){this.active=false;this.closed++;},isActive(){return this.active;}};
 if(loader)scripts.push({src:'https://widgets.leadconnectorhq.com/loader.js',remove(){const i=scripts.indexOf(this);if(i>=0)scripts.splice(i,1);}});
 const open={id:'contact-open',dataset:{chat:'ghl',src:'https://widgets.leadconnectorhq.com/loader.js',resourcesUrl:'https://widgets.leadconnectorhq.com/chat-widget/loader.js',widgetId:'6a48065dc4ca16b4ab897879',texts:'{}',cta:'contact-widget-open'},attrs:{},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];}};
 const session=new Map();if(consent)session.set('fc_consent',JSON.stringify(consent));
 const listed=sel=>sel.includes('loader.js')?scripts:sel==='chat-widget'?[]: [];
 const document={documentElement:{lang},getElementById:id=>id==='contact-open'?open:null,querySelector:sel=>listed(sel)[0]||null,querySelectorAll:sel=>sel==='[data-open-contact]'?[]:listed(sel),createElement:()=>({src:'',dataset:{},remove(){}}),body:{appendChild(n){scripts.push(n);return n;}}};
 const context={document,sessionStorage:{getItem:k=>session.get(k)||null},location:{pathname:lang==='es'?'/es/':'/'},dataLayer,leadConnector:{chatWidget:api},MutationObserver:class{constructor(){}observe(){}},WeakSet,JSON,addEventListener(type,fn){listeners[type]=fn;}};
 context.window=context;
 vm.runInNewContext(fs.readFileSync('ghl-chat.js','utf8'),context);
 return {open,scripts,dataLayer,api,listeners};
}

let chat=runChat({loader:true,consent:'granted'});
chat.open.onclick({currentTarget:chat.open});
assert.equal(chat.scripts.length,1,'existing GTM loader is not duplicated');
assert.equal(chat.dataLayer.filter(e=>e.event==='chat_open').length,1);
assert.equal(chat.dataLayer.find(e=>e.event==='sofia_open').link_location,'contact-widget-open');
assert.equal(chat.dataLayer.find(e=>e.event==='sofia_open').page_lang,'en');
assert.equal(chat.open.attrs['aria-busy'],'true');
chat.open.onclick({currentTarget:chat.open});
assert.equal(chat.scripts.length,1,'second click still does not inject');
assert.equal(chat.dataLayer.filter(e=>e.event==='chat_open').length,1,'events wait for one open');

chat=runChat();
chat.open.onclick({currentTarget:chat.open});
assert.equal(chat.scripts.length,1,'pill injects the loader when GTM did not');
assert.equal(chat.scripts[0].dataset.widgetId,'6a48065dc4ca16b4ab897879');
chat.open.onclick({currentTarget:chat.open});
assert.equal(chat.scripts.length,1,'pending open does not inject again');
assert.equal(chat.dataLayer.some(e=>e.event==='sofia_open'),false,'sofia_open stays behind measurement consent');
assert.equal(chat.dataLayer.filter(e=>e.event==='chat_open').length,1);

chat=runChat({loaded:true,consent:'granted',lang:'es'});
chat.open.onclick({currentTarget:chat.open});
assert.equal(chat.api.opened,1);assert.equal(chat.scripts.length,0,'loaded widget is opened, not reloaded');
assert.equal(chat.dataLayer.find(e=>e.event==='sofia_open').page_path,'/es/');
assert.equal(chat.dataLayer.find(e=>e.event==='chat_open').chat_provider,'ghl');
const events=chat.dataLayer.length;
chat.open.onclick({currentTarget:chat.open});
assert.equal(chat.api.closed,1);assert.equal(chat.dataLayer.length,events,'closing does not emit another open');
assert.doesNotMatch(fs.readFileSync('ghl-chat.js','utf8')+fs.readFileSync('ghl-guard.js','utf8'),/virtual assistant|asistente virtual/i);

function installGuard(){
 function FakeNode(){this.kids=[];}
 FakeNode.prototype.appendChild=function(n){this.kids.push(n);n.parentNode=this;return n;};
 FakeNode.prototype.insertBefore=function(n){return this.appendChild(n);};
 FakeNode.prototype.replaceChild=function(n){return this.appendChild(n);};
 function FakeEl(){FakeNode.call(this);}
 Object.setPrototypeOf(FakeEl.prototype,FakeNode.prototype);
 FakeEl.prototype.append=function(...ns){for(const n of ns)this.appendChild(n);};
 FakeEl.prototype.prepend=FakeEl.prototype.append;
 FakeEl.prototype.insertAdjacentElement=function(_pos,el){return this.appendChild(el);};
 class MutationObserver{constructor(){}observe(){}}
 const body=new FakeEl(),root=new FakeEl();
 const loaders=()=>body.kids.filter(n=>n.tagName==='SCRIPT'&&String(n.getAttribute('src')||n.src||'').includes('widgets.leadconnectorhq.com/loader.js'));
 const document={documentElement:root,body,querySelector(sel){return sel.includes('loader.js')?loaders()[0]||null:sel==='chat-widget'?null:null;},querySelectorAll(sel){return sel.includes('loader.js')?loaders():[];},createElement(tag){const el=new FakeEl();el.nodeType=1;el.tagName=tag.toUpperCase();el.attrs={};el.getAttribute=k=>el.attrs[k]??null;el.setAttribute=(k,v)=>{el.attrs[k]=String(v);};el.remove=()=>{};return el;}};
 const sandbox={Node:FakeNode,Element:FakeEl,MutationObserver,document,console};
 sandbox.window=sandbox;
 vm.runInNewContext(fs.readFileSync('ghl-guard.js','utf8'),sandbox);
 const script=src=>{const s=document.createElement('script');s.src=src;s.attrs.src=src;return s;};
 return {body,script,loaders};
}
let viaAppend=installGuard();
viaAppend.body.append(viaAppend.script('https://widgets.leadconnectorhq.com/loader.js'));
viaAppend.body.append(viaAppend.script('https://widgets.leadconnectorhq.com/loader.js'));
assert.equal(viaAppend.loaders().length,1,'append() keeps the first loader only');
let guard=installGuard();
guard.body.appendChild(guard.script('https://widgets.leadconnectorhq.com/loader.js'));
guard.body.appendChild(guard.script('https://widgets.leadconnectorhq.com/loader.js'));
guard.body.append(guard.script('https://widgets.leadconnectorhq.com/loader.js'));
guard.body.insertBefore(guard.script('https://widgets.leadconnectorhq.com/loader.js'));
guard.body.insertAdjacentElement('beforeend',guard.script('https://widgets.leadconnectorhq.com/loader.js'));
assert.equal(guard.loaders().length,1,'guard keeps a single GHL loader');
const other=guard.script('https://example.com/app.js');
guard.body.appendChild(other);
assert.ok(guard.body.kids.includes(other),'guard still allows other scripts');

const home=fs.readFileSync('dist/index.html','utf8'),es=fs.readFileSync('dist/es/index.html','utf8');
assert.ok(home.indexOf('data-fc-hide')>0&&home.indexOf('data-fc-hide')<home.indexOf('GTM-THZVNS9B'),'EN guard is before GTM');
assert.ok(es.indexOf('data-fc-hide')>0&&es.indexOf('data-fc-hide')<es.indexOf('GTM-THZVNS9B'),'ES guard is before GTM');
assert.match(home,/Talk to Sofía/);assert.match(es,/Habla con Sofía/);
assert.doesNotMatch(home+es,/virtual assistant|asistente virtual/i);
console.log('PASS: one GHL loader, Sofía pill opens it, sofia_open and chat_open, guard before GTM.');
