// Dev helper: crop a region of an image, upscale, and draw a labeled coordinate grid (original pixel coords).
import sharp from 'sharp';
const [src,out,x,y,w,h,scale='2',step='20'] = process.argv.slice(2);
const X=+x,Y=+y,W=+w,H=+h,S=+scale,ST=+step;
const img = await sharp(src).extract({left:X,top:Y,width:W,height:H}).resize(Math.round(W*S),Math.round(H*S)).toBuffer();
let lines='';
for(let gx=Math.ceil(X/ST)*ST; gx<X+W; gx+=ST){const px=(gx-X)*S; const major=gx%(ST*5)===0; lines+=`<line x1="${px}" y1="0" x2="${px}" y2="${H*S}" stroke="${major?'#f0f':'#0ff'}" stroke-opacity="${major?0.8:0.35}" stroke-width="1"/>`; if(major) lines+=`<text x="${px+2}" y="12" font-size="12" fill="#ff0" font-family="Arial">${gx}</text>`;}
for(let gy=Math.ceil(Y/ST)*ST; gy<Y+H; gy+=ST){const py=(gy-Y)*S; const major=gy%(ST*5)===0; lines+=`<line x1="0" y1="${py}" x2="${W*S}" y2="${py}" stroke="${major?'#f0f':'#0ff'}" stroke-opacity="${major?0.8:0.35}" stroke-width="1"/>`; if(major) lines+=`<text x="2" y="${py-2}" font-size="12" fill="#ff0" font-family="Arial">${gy}</text>`;}
await sharp(img).composite([{input:Buffer.from(`<svg width="${W*S}" height="${H*S}" xmlns="http://www.w3.org/2000/svg">${lines}</svg>`)}]).jpeg({quality:85}).toFile(out);
