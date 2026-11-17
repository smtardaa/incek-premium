// Derlenmiş çıktıyı denetler: HTML'deki ve keşif verisindeki tüm yerel bağlantı/asset yolları
// gerçekten dist/ içinde var mı? Base (alt yol) ayarına göre çözümler.
// Kullanım: npm run check:links   (BASE_PATH ortam değişkeni build ile aynı olmalı)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, process.env.DIST_DIR || 'dist');
const base = ('/' + (process.env.BASE_PATH || '/').replace(/^\/+|\/+$/g, '') + '/').replace(/\/+/g, '/');

const htmlFiles = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) htmlFiles.push(p); } })(dist);

const problems = [];
let checked = 0;
function resolveUrl(u, fromFile) {
  if (!u || /^(https?:|mailto:|tel:|data:|#|javascript:)/i.test(u)) return null;
  const clean = u.split('#')[0].split('?')[0];
  if (clean === '') return null; // yalnızca sorgu/anchor → aynı sayfa
  let abs;
  if (clean.startsWith('/')) {
    if (!clean.startsWith(base)) return { error: `base dışında mutlak yol (${base} bekleniyordu)` };
    abs = clean.slice(base.length);
  } else {
    const rel = path.relative(dist, path.dirname(fromFile)).split(path.sep).join('/');
    abs = path.posix.normalize((rel ? rel + '/' : '') + clean);
  }
  let file = path.join(dist, decodeURIComponent(abs));
  if (abs === '' || abs.endsWith('/')) file = path.join(file, 'index.html');
  return { file };
}
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const urls = new Set();
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(',').forEach((s) => urls.add(s.trim().split(/\s+/)[0]));
  const json = html.match(/<script type="application\/json" id="explore-data">([\s\S]*?)<\/script>/);
  if (json) {
    const walkJson = (v) => { if (typeof v === 'string') { if (/\.(webp|png|jpg)$/.test(v) || v.endsWith('/')) urls.add(v); } else if (v && typeof v === 'object') Object.values(v).forEach(walkJson); };
    walkJson(JSON.parse(json[1]));
  }
  for (const u of urls) {
    const r = resolveUrl(u, f);
    if (!r) continue;
    checked++;
    if (r.error) problems.push(`${path.relative(dist, f)}: ${u} → ${r.error}`);
    else if (!fs.existsSync(r.file)) problems.push(`${path.relative(dist, f)}: ${u} → bulunamadı`);
  }
  if (!/<meta name="robots" content="noindex/.test(html) && process.env.PUBLIC_NOINDEX !== 'false') problems.push(`${path.relative(dist, f)}: noindex meta eksik`);
}
console.log(`Base: ${base} · ${htmlFiles.length} HTML · ${checked} yerel yol denetlendi`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('Kırık yerel bağlantı/asset yok.');
