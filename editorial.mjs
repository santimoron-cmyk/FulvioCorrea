import fs from 'node:fs';
import path from 'node:path';
import {marked} from './vendor/marked.mjs';
export const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
export function posts(){return fs.readdirSync('content/blog').filter(f=>f.endsWith('.md')).map(file=>{const raw=fs.readFileSync('content/blog/'+file,'utf8'),match=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);if(!match)throw Error('Invalid frontmatter: '+file);const data={};for(const line of match[1].split(/\r?\n/)){if(!line.trim()||line.startsWith('#'))continue;const n=line.indexOf(':');data[line.slice(0,n)]=JSON.parse(line.slice(n+1).trim());}for(const key of ['title','description','slug','lang','category','tags','cover','coverAlt','date','updated','author','translationOf','sources','procedure','related','twin'])if(!(key in data))throw Error(file+' missing '+key);if(!/^[a-z0-9-]+$/.test(data.slug)||!['en','es'].includes(data.lang))throw Error('Invalid post route');return {...data,body:match[2],file};});}
export const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function markdown(s){return marked.parse(s.replace(/^# /gm,'## ')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/\son\w+="[^"]*"/gi,'');}
export const write=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,value);};
