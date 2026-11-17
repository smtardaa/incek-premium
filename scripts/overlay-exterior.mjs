// Geliştirme aracı: kat ve sosyal alan çokgenlerini dış cephe görseline çizer (scratch/exterior-overlay.jpg)
import sharp from 'sharp';
import fs from 'node:fs';
import { lines, facade, floorNumberTop, exteriorHotspots, silhouette } from '../src/data/exterior.js';
import { buildFloors, pointsAttr } from '../src/lib/geometry.js';
const floors = buildFloors(lines, facade, floorNumberTop);
const poly = floors.map((f, i) => `<polygon points="${pointsAttr(f.points)}" fill="${i % 2 ? 'rgba(255,0,0,.28)' : 'rgba(0,255,255,.28)'}" stroke="#ff0" stroke-width="0.6"/><text x="${f.bbox.x + f.bbox.w + 4}" y="${f.target.y + 4}" font-size="11" fill="#ff0" font-family="Arial">${f.number}</text>`).join('');
const hs = exteriorHotspots.map((h) => `<polygon points="${pointsAttr(h.points)}" fill="rgba(255,0,255,.25)" stroke="#f0f" stroke-width="1.5"/>`).join('');
const sil = `<polygon points="${pointsAttr(silhouette)}" fill="none" stroke="#0f0" stroke-width="1"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">${hs}${poly}${sil}</svg>`;
fs.mkdirSync('scratch', { recursive: true });
const full = await sharp('İncek Premium.jpg').composite([{ input: Buffer.from(svg) }]).png().toBuffer();
await sharp(full).extract({ left: 600, top: 0, width: 320, height: 420 }).resize(640).jpeg().toFile('scratch/ov-top.jpg');
await sharp(full).extract({ left: 600, top: 400, width: 320, height: 420 }).resize(640).jpeg().toFile('scratch/ov-mid.jpg');
await sharp(full).extract({ left: 500, top: 660, width: 800, height: 300 }).jpeg().toFile('scratch/ov-base.jpg');
