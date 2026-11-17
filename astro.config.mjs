// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Yayın adresi ayarları TEK YERDE: ortam değişkenleri.
 *
 *   SITE_URL   → Sitenin kök adresi (ör. https://kullanici.github.io veya https://alanadi.com)
 *   BASE_PATH  → Alt yol. Kök alan adında "/" ; repository alt yolunda "/repo-adi/"
 *
 * GitHub Actions iş akışı (.github/workflows/deploy.yml) bu değerleri
 * actions/configure-pages çıktısından otomatik doldurur. Yerelde boş bırakılırsa
 * site kökten ("/") çalışır. Ayrıntı: README.md → "GitHub Pages site/base".
 */
const SITE_URL = process.env.SITE_URL || 'http://localhost:4321';
const rawBase = process.env.BASE_PATH || '/';
const BASE_PATH = ('/' + rawBase.replace(/^\/+|\/+$/g, '') + '/').replace(/\/+/g, '/');

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    assets: '_assets',
    inlineStylesheets: 'auto'
  },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    build: { assetsInlineLimit: 0 }
  }
});
