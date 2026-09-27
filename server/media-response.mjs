import fs from 'node:fs';
export function serveMedia(req,res,file){
 const size=fs.statSync(file).size;
 res.setHeader('Content-Type','video/mp4');res.setHeader('Accept-Ranges','bytes');
 let start=0,end=size-1;
 if(req.headers.range){
  const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
  if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
  if(!match[1])start=Math.max(0,size-Number(match[2]));else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
  if(start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
  res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);
 }
 res.setHeader('Content-Length',end-start+1);
 if(req.method==='HEAD'){res.end();return;}
 fs.createReadStream(file,{start,end}).pipe(res);
}
