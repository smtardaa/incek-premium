// GitHub Pages benzeri yerel statik sunucu (test aracı).
// Kullanım: node scripts/serve-pages.mjs <klasör> <base> <port>
// ör.  node scripts/serve-pages.mjs dist-sub /incek-premium/ 4330
// - <base> altındaki istekleri klasöre eşler, dizinlerde index.html sunar,
// - "/bilgiler" → "/bilgiler/" yönlendirir, bulunamayanlarda 404.html döner.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [dir = 'dist', base = '/', port = '4330'] = process.argv.slice(2);
const rootDir = path.resolve(dir);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = decodeURIComponent(url.pathname);
  if (!p.startsWith(base)) { if (p + '/' === base) { res.writeHead(301, { Location: base }); return res.end(); } return notFound(res); }
  let file = path.join(rootDir, p.slice(base.length));
  if (!file.startsWith(rootDir)) return notFound(res);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' + url.search }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) return notFound(res);
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(Number(port), '127.0.0.1', () => console.log(`http://127.0.0.1:${port}${base} → ${rootDir}`));

function notFound(res) {
  const f = path.join(rootDir, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  if (fs.existsSync(f)) fs.createReadStream(f).pipe(res); else res.end('404');
}
