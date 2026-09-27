const stamp=s=>new Date(Math.round(s*1000)).toISOString().slice(11,23);
// Split long recognizer segments into readable two-line captions without changing their time span.
export function webvtt(cues,lang){
 const out=[];
 for(const c of cues){
  const lines=[];let line='';for(const word of c[lang].split(/\s+/)){if(line.length+word.length+1>42){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);
  const chunks=[];for(let i=0;i<lines.length;i+=2)chunks.push(lines.slice(i,i+2).join('\n'));
  chunks.forEach((text,i)=>out.push(`${stamp(c.start+(c.end-c.start)*i/chunks.length)} --> ${stamp(c.start+(c.end-c.start)*(i+1)/chunks.length)}\n${text}`));
 }
 return 'WEBVTT\n\n'+out.join('\n\n')+'\n';
}
