// Kaynak görsellerden optimize WebP kopyalar üretir → public/img/
// Kullanım: npm run images  (yalnızca eksik/eskimiş dosyaları üretir; --force ile hepsini)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assets } from '../src/data/assets.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'img');
const force = process.argv.includes('--force');
fs.mkdirSync(outDir, { recursive: true });

let made = 0, skipped = 0;
for (const a of assets) {
  const src = path.join(root, a.src);
  if (!fs.existsSync(src)) { console.error('Kaynak yok:', a.src); process.exitCode = 1; continue; }
  const srcTime = fs.statSync(src).mtimeMs;
  const meta = await sharp(src).metadata();
  if (meta.width !== a.w || meta.height !== a.h) {
    // Manifest boyutları sahne koordinatları için kullanılır; uyuşmazlık hata sayılır.
    if (Math.abs(meta.width / meta.height - a.w / a.h) > 0.01) {
      console.error(`Oran uyuşmazlığı: ${a.id} manifest ${a.w}x${a.h}, dosya ${meta.width}x${meta.height}`);
      process.exitCode = 1;
    }
  }
  for (const w of a.widths) {
    const out = path.join(outDir, `${a.id}-${w}.webp`);
    if (!force && fs.existsSync(out) && fs.statSync(out).mtimeMs > srcTime) { skipped++; continue; }
    const h = Math.round((w * a.h) / a.w);
    await sharp(src)
      .resize(w, h, { fit: 'cover', withoutEnlargement: false })
      .webp({ quality: w <= 480 ? 70 : 80, effort: 5 })
      .toFile(out);
    made++;
  }
}
console.log(`Görseller hazır: ${made} üretildi, ${skipped} güncel.`);
