// Build-time cache buster for the site scripts. Cloudflare's apex Browser Cache TTL
// advertises max-age=14400 for /event-signup.js when the origin sends max-age=0, so a
// new deploy keeps running the previous file until that browser cache expires.
// The HTML references /event-signup.js?v=<7-char sha> (or YYYYMMDD if git is unavailable).
import {execFileSync} from 'node:child_process';
export function assetVersion(){
 const fromEnv=String(process.env.CF_PAGES_COMMIT_SHA||process.env.GITHUB_SHA||'').trim();
 if(/^[0-9a-f]{7,40}$/i.test(fromEnv))return fromEnv.slice(0,7).toLowerCase();
 try{
  const sha=execFileSync('git',['rev-parse','--short=7','HEAD'],{encoding:'utf8'}).trim().toLowerCase();
  if(/^[0-9a-f]{7,12}$/.test(sha))return sha.slice(0,7);
 }catch{}
 return new Date().toISOString().slice(0,10).replaceAll('-','');
}
