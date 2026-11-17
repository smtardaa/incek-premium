# İncek Premium — etkileşimli tanıtım sitesi (açık beta)

Astro ile hazırlanmış, statik çıktı üreten tanıtım sitesi. Backend, veritabanı veya
sunucu tarafı kod yoktur; GitHub Pages veya herhangi bir statik barındırmada çalışır.

- **Görsel keşif** (`/`): açılış → dış cephe / kat seçimi → örnek daire tipi → 5 oda → salon dekorasyonu; ayrıca bina üzerinden sosyal olanak sahneleri.
- **Yazılı bilgiler** (`/bilgiler/`): proje, daire tipleri, temsili oda şemaları, olanaklar, filtreli galeri + lightbox, konum, iletişim. JavaScript olmadan da okunur.
- **Randevu**: WhatsApp bağlantısı hazır mesajla açılır; mesajı kullanıcı kendisi gönderir.

## Gereksinimler

- Node.js **22.12 veya üstü** (yalnızca geliştirme/derleme için; yayında Node gerekmez)
- npm

## Kurulum ve komutlar

```bash
npm ci
```

```bash
npm run dev
```
Geliştirme sunucusu: http://localhost:4321

```bash
npm run build
```
Statik çıktı `dist/` klasörüne yazılır.

```bash
npm run preview
```
Derlenmiş `dist/` klasörünü yerelde sunar.

```bash
npm test
```
Durum/URL eşlemesi, geçiş yöneticisi, dekorasyon paket–elle seçim eşleşmesi, WhatsApp mesaj kodlaması ve kat geometrisi testleri.

```bash
npm run check:links
```
`dist/` içindeki tüm yerel bağlantı ve görsel yollarını (keşif verisi dahil) denetler. `BASE_PATH` derlemedekiyle aynı olmalıdır.

Görsel komutları (yalnızca görseller değişince):

```bash
npm run images
```
`src/data/assets.js` manifestindeki kaynaklardan `public/img/` altına WebP kopyalar üretir.

```bash
npm run images:decor
```
Salon dekorasyon katmanlarını `public/img/dekor/` altına üretir (`-- --preview` ile `scratch/` klasörüne 6 kombinasyonluk kontrol görseli de yazar).

## GitHub Pages: site / base ayarı (tek yer)

Adres ayarları **yalnızca ortam değişkenleriyle** yapılır ve `astro.config.mjs` içinde okunur:

| Değişken | Anlamı | Örnek |
|---|---|---|
| `SITE_URL` | Sitenin kök adresi | `https://kullanici.github.io` veya `https://alanadi.com` |
| `BASE_PATH` | Alt yol | Kök alan adı: `/` · Repository sayfası: `/repo-adi/` |
| `PUBLIC_NOINDEX` | Arama motoru engeli | Varsayılan `true`; nihai yayında `false` |

Tüm iç bağlantılar ve görseller `src/lib/url.js` → `withBase()` ile üretildiği için aynı kod hem kök alan adında hem repository alt yolunda çalışır. Alt sayfalar `dizin/index.html` olarak üretilir (`trailingSlash: 'always'`), bu yüzden `/bilgiler/` doğrudan açıldığında ve yenilendiğinde çalışır; GitHub Pages `/bilgiler` isteğini `/bilgiler/` adresine yönlendirir. Bulunamayan adresler için `404.html` üretilir.

Yerelde alt yolu denemek için (Git Bash kullanıyorsanız yol dönüşümünü kapatın):

```bash
MSYS_NO_PATHCONV=1 BASE_PATH=/incek-premium/ npx astro build --outDir dist-sub
```

```bash
node scripts/serve-pages.mjs dist-sub /incek-premium/ 4330
```
Ardından http://localhost:4330/incek-premium/ adresini açın.

## Yayın adımları (GitHub Actions)

İş akışı hazırdır: `.github/workflows/deploy.yml`. Bu proje sizin adınıza push veya yayın yapmadı.

1. Klasörü bir GitHub deposuna gönderin (`main` dalı).
2. Depo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. `main` dalına her push'ta iş akışı: `npm ci` → `npm test` → `npm run build` → `npm run check:links` → Pages'e yükleme.
4. `SITE_URL` ve `BASE_PATH`, `actions/configure-pages` çıktısından otomatik alınır (repository sayfasında `/repo-adi/`, özel alan adında `/`).
5. Özel alan adı kullanacaksanız Pages ayarlarından ekleyin; base otomatik `/` olur.

## noindex ve erişim

Açık beta sürümü her sayfada `<meta name="robots" content="noindex, nofollow">` içerir.
**Bu bir erişim kontrolü değildir**: bağlantıyı bilen herkes siteyi açabilir; yalnızca
uyumlu arama motorlarının dizinlemesini engeller. Gizli tutulması gereken içerik
yayımlamayın.

**Nihai yayın:** `.github/workflows/deploy.yml` içinde `PUBLIC_NOINDEX: "false"` yapın
(yerelde `PUBLIC_NOINDEX=false npm run build`). Gerekirse `public/robots.txt` ekleyin.

## Değiştirilecek verilerin konumları

| Ne | Dosya |
|---|---|
| Proje bilgileri, iletişim, takvim, yakın çevre | `src/data/project.js` |
| Görsel manifesti (kaynak, tür, genişlikler) | `src/data/assets.js` |
| Dış cephe kat çizgileri, temsili numaralandırma, sosyal alan çokgenleri | `src/data/exterior.js` |
| Daire tipleri, odalar, kamera açıları, bilgi noktaları, oda şeması | `src/data/apartments.js` |
| Sosyal olanak metinleri ve grupları | `src/data/amenities.js` |
| Dekorasyon seçenekleri ve paketler | `src/data/decor.js` |
| Dekorasyon katmanı maskeleri | `src/data/decor-masks.js` |
| Galeri | `src/data/gallery.js` |
| noindex, site başlığı/açıklaması | `src/config.js` |
| Renkler ve yazı tipleri | `src/styles/global.css` (`:root`) |

Veri ve görüntüleme ayrıdır: sayfalar ve istemci betikleri yalnızca bu dosyaları okur.
İleride ikinci dil veya bir içerik servisi eklenecekse bu modüllerin yerine aynı yapıda
veri döndüren bir kaynak bağlanabilir.

## Proje yapısı

```
src/
  pages/            index.astro (görsel keşif), bilgiler/index.astro, 404.astro
  components/       AppointmentDialog.astro (WhatsApp randevu), RoomScheme.astro
  layouts/          Base.astro (meta, noindex, fontlar)
  data/             düzenlenebilir veri (yukarıdaki tablo)
  lib/              saf mantık: explore-state, transition-manager, decor-state, whatsapp, geometry, storage, url
  scripts/          istemci: explore.js (sahne orkestrasyonu), stage.js (ortak transform sahnesi), info.js
  styles/           global.css, explore.css, info.css
public/             img/ (üretilmiş WebP), img/dekor/ (dekor katmanları), brand/ (logolar)
kaynak-gorseller/   resmî siteden indirilen kaynak görseller (yayına girmez)
scripts/            görsel üretimi, bağlantı denetimi, Pages benzeri yerel sunucu, geliştirme yardımcıları
tests/              node:test birim testleri
```

Geliştirme yardımcıları: `scripts/overlay-exterior.mjs` (kat çokgenlerini görselin üzerine çizer),
`scripts/grid-crop.mjs` ve `scripts/contact-sheet.mjs` (koordinat ölçümü ve görsel inceleme).

Ayrıntılar: `ilerleme.md`, `GORSEL-KAYNAKLAR.md`, `TEST-RAPORU.md`.
