// Salon dekorasyon katmanlarını üretir → public/img/dekor/
//
// Yöntem: Aynı resmî salon render'ı üzerinde YALNIZCA perde / koltuk yüzeyi çokgen maske
// ile ayrılır, parlaklık ve kıvrım gölgeleri korunarak hedef renge taşınır ve tam kare,
// şeffaf zeminli WebP katmanı olarak kaydedilir. Kamera, ışık, pencere ve diğer nesneler
// değişmez; bütün sahneye renk filtresi uygulanmaz. Yeni mobilya modeli ÜRETİLMEZ.
//
// Kullanım: node scripts/build-decor.mjs [--preview]
//   --preview: 6 kombinasyonun tamamını tek kontrol görseline birleştirir (scratch/decor-preview-*.jpg)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decorMasks } from '../src/data/decor-masks.js';
import { curtains, sofas, decorLayerPath } from '../src/data/decor.js';
import { getAsset } from '../src/data/assets.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preview = process.argv.includes('--preview');

function polySvg(polys, fill) {
  return polys.map((p) => `<polygon fill="${fill}" points="${p.map((q) => q.join(',')).join(' ')}"/>`).join('');
}

async function rasterMask(cfg, w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#000"/>${polySvg(cfg.include, '#fff')}${polySvg(cfg.exclude, '#000')}</svg>`;
  const { data } = await sharp(Buffer.from(svg)).blur(1.1).greyscale().raw().toBuffer({ resolveWithObject: true });
  return data; // 1 kanal
}

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

function gateWeight(gate, r, g, b) {
  let w = 1;
  const Y = lum(r, g, b);
  if (gate.minY != null) w *= smooth(gate.minY - 15, gate.minY + 10, Y);
  if (gate.plant) { const green = g - Math.max(r, b); w *= 1 - smooth(-2, 10, green); }
  if (gate.maxChroma != null) { const c = Math.max(r, g, b) - Math.min(r, g, b); w *= 1 - smooth(gate.maxChroma - 8, gate.maxChroma + 8, c); }
  return w;
}

async function buildLayer(srcRaw, w, h, mask, gate, color) {
  // Referans parlaklık: maske içindeki piksellerin medyanı
  const ys = [];
  for (let i = 0, p = 0; i < w * h; i++, p += 3) if (mask[i] > 200) ys.push(lum(srcRaw[p], srcRaw[p + 1], srcRaw[p + 2]));
  ys.sort((a, b) => a - b);
  const yRef = ys[Math.floor(ys.length * 0.6)] || 128;
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0, p = 0, q = 0; i < w * h; i++, p += 3, q += 4) {
    const m = mask[i] / 255;
    if (m <= 0.002) continue;
    const r = srcRaw[p], g = srcRaw[p + 1], b = srcRaw[p + 2];
    const a = m * gateWeight(gate, r, g, b);
    if (a <= 0.002) continue;
    const ratio = Math.pow(lum(r, g, b) / yRef, 1.05);
    out[q] = Math.min(255, Math.round(color[0] * ratio));
    out[q + 1] = Math.min(255, Math.round(color[1] * ratio));
    out[q + 2] = Math.min(255, Math.round(color[2] * ratio));
    out[q + 3] = Math.round(a * 255);
  }
  return out;
}

const outDir = path.join(root, 'public', 'img', 'dekor');
fs.mkdirSync(outDir, { recursive: true });
const scratch = path.join(root, 'scratch');
if (preview) fs.mkdirSync(scratch, { recursive: true });

for (const [type, cfg] of Object.entries(decorMasks)) {
  const asset = getAsset(cfg.base);
  const [w, h] = cfg.size;
  const src = await sharp(path.join(root, asset.src)).resize(w, h).removeAlpha().raw().toBuffer();
  const layers = {};
  for (const [kind, list] of [['curtain', curtains], ['sofa', sofas]]) {
    const mask = await rasterMask(cfg[kind], w, h);
    for (const opt of list) {
      if (opt.original) continue;
      const rgba = await buildLayer(src, w, h, mask, cfg[kind].gate, opt.color);
      const rel = decorLayerPath(type, kind, opt.id);
      const file = path.join(root, 'public', rel);
      await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(file);
      layers[`${kind}:${opt.id}`] = file;
      console.log('katman:', rel, Math.round(fs.statSync(file).size / 1024) + ' KB');
    }
  }
  if (preview) {
    const tiles = [];
    for (const c of curtains) for (const s of sofas) {
      const comps = [];
      if (!c.original) comps.push({ input: layers[`curtain:${c.id}`] });
      if (!s.original) comps.push({ input: layers[`sofa:${s.id}`] });
      const full = await sharp(path.join(root, asset.src)).resize(w, h).composite(comps).png().toBuffer();
      const img = await sharp(full).resize(800, 450).jpeg({ quality: 80 }).toBuffer();
      tiles.push(img);
    }
    await sharp({ create: { width: 1600, height: 1350, channels: 3, background: '#000' } })
      .composite(tiles.map((t, i) => ({ input: t, left: (i % 2) * 800, top: Math.floor(i / 2) * 450 })))
      .jpeg({ quality: 82 }).toFile(path.join(scratch, `decor-preview-${type}.jpg`));
  }
}
