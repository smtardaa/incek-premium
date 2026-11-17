import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
const [dir, out, ...files] = process.argv.slice(2);
const W=400,H=260,cols=4; const rows=Math.ceil(files.length/cols);
const comps=[];
for (let i=0;i<files.length;i++){
  const f=files[i]; const meta=await sharp(path.join(dir,f)).metadata();
  const img=await sharp(path.join(dir,f)).resize(W,H-24,{fit:'contain',background:'#222'}).toBuffer();
  const label=Buffer.from(`<svg width="${W}" height="24"><rect width="100%" height="100%" fill="#000"/><text x="4" y="17" font-size="14" fill="#ff0" font-family="Arial">${f} ${meta.width}x${meta.height}</text></svg>`);
  comps.push({input:img,left:(i%cols)*W,top:Math.floor(i/cols)*H+24},{input:label,left:(i%cols)*W,top:Math.floor(i/cols)*H});
}
await sharp({create:{width:W*cols,height:H*rows,channels:3,background:'#111'}}).composite(comps).jpeg({quality:80}).toFile(out);
