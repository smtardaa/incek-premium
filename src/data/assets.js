/**
 * Görsel manifesti — sitede kullanılan her görselin tek kaydı.
 *
 * - `src`     : proje köküne göre kaynak dosya (optimize edilmemiş).
 * - `origin`  : 'kullanici' (kullanıcının verdiği dosya), 'resmi' (incekpremium.com),
 *               'turetilmis' (bu projede resmî görselden maskeli olarak türetilen katman).
 * - `widths`  : `npm run images` ile üretilecek WebP genişlikleri.
 * - Çıktı yolu: public/img/<id>-<genişlik>.webp  → sitede `img/<id>-<w>.webp`.
 *
 * Görsel eklemek için: kaynağı kaynak-gorseller/ altına koyun, buraya kayıt ekleyin,
 * `npm run images` çalıştırın. Dosya adına göre oda/tip eşlemesi yapmayın; içeriğe bakın.
 */
const OFFICIAL = 'https://incekpremium.com/';
const R = 'kaynak-gorseller/resmi-galeri/';

/** @typedef {{id:string,src:string,origin:'kullanici'|'resmi'|'turetilmis',sourceUrl?:string,w:number,h:number,widths:number[],alt:string,note?:string}} Asset */

/** @type {Asset[]} */
export const assets = [
  // ——— Dış cephe (ana keşif sahnesi) ———
  { id: 'dis-ana', src: 'İncek Premium.jpg', origin: 'kullanici', sourceUrl: OFFICIAL + 'assets/images/gallery/1.jpg', w: 1920, h: 1080, widths: [1280, 1920], alt: 'İncek Premium kulesi, podyumdaki peyzajlı teras ve otopark katlarıyla genel görünüm', note: 'Kullanıcının verdiği dosya; resmî galerideki 1.jpg ile bayt bayt aynı.' },

  // ——— Dış mekân galerisi ———
  { id: 'dis-2', src: R + '2.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'assets/images/gallery/2.jpg', w: 2688, h: 1512, widths: [480, 1600], alt: 'Kulenin yol tarafından görünümü' },
  { id: 'dis-3', src: R + '3.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'assets/images/gallery/3.jpg', w: 2688, h: 1512, widths: [480, 1600], alt: 'Kule ve podyum terasının kuşbakışı görünümü' },
  { id: 'dis-4', src: R + '4.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'assets/images/gallery/4.jpg', w: 2688, h: 1512, widths: [480, 1600], alt: 'Kulenin geniş açıdan görünümü' },
  { id: 'dis-5', src: R + '5.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'assets/images/gallery/5.jpg', w: 1920, h: 1080, widths: [480, 1600], alt: 'Giriş kapısı ve kule cephesi' },
  { id: 'dis-gunbatimi', src: R + 'slider-3.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/slider-3.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Gün batımında aydınlatılmış kule' },
  { id: 'dis-gece', src: R + 'incek-gece-1-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/incek-gece-1-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Akşam ışığında kule ve podyum' },
  { id: 'dis-cadde', src: R + 'dis-mekan09.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/dis-mekan09.jpg', w: 1200, h: 675, widths: [480, 1200], alt: 'Cadde seviyesinden giriş görünümü' },
  { id: 'dis-giris', src: R + 'dis-mekan04.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/dis-mekan04.jpg', w: 1200, h: 675, widths: [480, 1200], alt: 'İncek Premium giriş kapısı' },
  { id: 'dis-podyum-aksam', src: R + 'dis-mekan10.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/dis-mekan10.jpg', w: 1200, h: 675, widths: [480, 1200], alt: 'Akşam saatinde podyum ve kule' },

  // ——— Peyzaj / ortak alanlar (resmî galeride “B-Tipi” sekmesinde, dosya adı yanıltıcı) ———
  { id: 'peyzaj-yuruyus', src: R + 'b-tipi-kapali-mutfak01.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/b-tipi-kapali-mutfak01.jpg', w: 1200, h: 675, widths: [480, 1200], alt: 'Podyum terasında ahşap yürüyüş yolu ve pergolalar', note: 'Dosya adı “kapalı mutfak” olsa da içerik peyzajdır.' },
  { id: 'peyzaj-otopark', src: R + 'b-tipi-kapali-mutfak03.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/b-tipi-kapali-mutfak03.jpg', w: 1200, h: 675, widths: [480, 1200], alt: 'Otopark katları ve üzerindeki peyzajlı teras', note: 'Dosya adı yanıltıcı; içerik otopark ve teras.' },
  { id: 'peyzaj-kusbakisi', src: R + 'b-tipi-kapali-mutfak04.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/b-tipi-kapali-mutfak04.jpg', w: 1200, h: 675, widths: [480, 1200], alt: 'Peyzajlı terasın yukarıdan görünümü', note: 'Dosya adı yanıltıcı; içerik peyzaj.' },
  { id: 'peyzaj-gym', src: R + 'b-tipi-kapali-mutfak05.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/b-tipi-kapali-mutfak05.jpg', w: 1200, h: 675, widths: [480, 1200], alt: 'Teras seviyesinde “Gym Center” yazılı yapı ve su öğesi', note: 'Dosya adı yanıltıcı; içerik dış mekân.' },
  { id: 'peyzaj-oyun', src: R + 'b-tipi-kapali-mutfak08.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/b-tipi-kapali-mutfak08.jpg', w: 1200, h: 675, widths: [480, 1200], alt: 'Terasta oturma alanları ve çocuk oyun alanı', note: 'Dosya adı yanıltıcı; içerik peyzaj.' },
  { id: 'peyzaj-teras', src: R + 'peyzaj-8.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/peyzaj-8.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Kule önündeki ahşap kaplı teras ve oturma alanları' },

  // ——— A tipi · açık mutfak ———
  { id: 'a-salon-oturma', src: R + 'a-tipi-salon-1.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-salon-1.jpg', w: 1600, h: 900, widths: [960, 1600], alt: 'Açık mutfaklı tip salon: oturma grubu, perdeler ve pencere' },
  { id: 'a-salon-yemek', src: R + 'a-tipi-salon-3.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-salon-3.jpg', w: 1600, h: 900, widths: [960, 1600], alt: 'Açık mutfaklı tip: yemek masasından oturma alanına bakış' },
  { id: 'a-salon-mutfak', src: R + 'a-tipi-salon-2.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-salon-2.jpg', w: 1600, h: 900, widths: [960, 1600], alt: 'Açık mutfaklı tip: salondan paravanların arkasındaki mutfağa bakış' },
  { id: 'a-salon-tv', src: R + 'a-tipi-acik-mutfak06.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-acik-mutfak06.jpg', w: 1200, h: 675, widths: [960, 1200], alt: 'Açık mutfaklı tip salon: TV duvarı' },
  { id: 'a-mutfak', src: R + 'a-tipi-mutfak-2.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-mutfak-2.jpg', w: 1600, h: 900, widths: [960, 1600], alt: 'Açık mutfak ve önündeki yemek masası' },
  { id: 'a-mutfak-detay', src: R + 'a-tipi-acik-mutfak01.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-acik-mutfak01.jpg', w: 1200, h: 675, widths: [960, 1200], alt: 'Mutfak tezgâhı, cam kapaklı üst dolaplar ve ankastre fırın' },
  { id: 'ortak-ebeveyn', src: R + 'a-tipi-acik-mutfak07.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-acik-mutfak07.jpg', w: 1200, h: 675, widths: [960, 1200], alt: 'Ebeveyn yatak odası örnek görseli', note: 'Resmî galerinin A tipi sekmesinde. B tipi için ayrı yatak odası görseli bulunamadı; iki tipte ortak örnek olarak gösterilir.' },
  { id: 'ortak-ikinci-calisma', src: R + 'a-tipi-acik-mutfak11.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-acik-mutfak11.jpg', w: 1200, h: 675, widths: [960, 1200], alt: 'İkinci oda: tek kişilik yatak ve çalışma masası', note: 'Aynı görsel resmî galerinin B tipi sekmesinde de (b-tipi-kapali-mutfak09) yer alıyor.' },
  { id: 'a-ikinci-genel', src: R + 'a-tipi-acik-mutfak10.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-acik-mutfak10.jpg', w: 1200, h: 675, widths: [960, 1200], alt: 'İkinci oda: dolap nişinde yatak ve çalışma köşesi' },
  { id: 'ortak-banyo', src: R + 'banyo-2.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/banyo-2.jpg', w: 1600, h: 900, widths: [960, 1600], alt: 'Banyo: yuvarlak ayna, lavabo dolabı ve cam duş bölmesi', note: 'Ana sayfa görseli; A tipi galerisindeki a-tipi-acik-mutfak09 ile aynı kare. Tip ayrımı belirtilmediği için ortak örnek.' },
  { id: 'ortak-banyo-dus', src: R + 'a-tipi-acik-mutfak08.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-acik-mutfak08.jpg', w: 1200, h: 675, widths: [960, 1200], alt: 'Banyo: duş bölmesi ve asma klozet' },
  { id: 'ortak-hol', src: R + 'a-tipi-acik-mutfak12.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/a-tipi-acik-mutfak12.jpg', w: 1200, h: 675, widths: [480, 1200], alt: 'Giriş holü ve gömme dolaplar' },

  // ——— B tipi · kapalı mutfak ———
  { id: 'b-salon-oturma', src: R + 'b-tipi-salon-2.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/b-tipi-salon-2.jpg', w: 1600, h: 900, widths: [960, 1600], alt: 'Kapalı mutfaklı tip salon: yemek masası, oturma grubu ve perde' },
  { id: 'b-salon-tv', src: R + 'b-tipi-salon-1.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/b-tipi-salon-1.jpg', w: 1600, h: 900, widths: [960, 1600], alt: 'Kapalı mutfaklı tip salon: TV duvarı ve yemek alanı' },
  { id: 'b-mutfak', src: R + 'b-tipi-mutfak.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/b-tipi-mutfak.jpg', w: 1600, h: 900, widths: [960, 1600], alt: 'Kapalı mutfak: kapı açıklığından pencereli mutfağa bakış' },

  // ——— Ayrıcalıklar / hizmetler (resmî “Ayrıcalıklar” sayfası) ———
  { id: 'hizmet-konsiyerj', src: R + '1-7-24-konsiyerj-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/1-7-24-konsiyerj-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Konsiyerj hizmetini temsil eden görsel' },
  { id: 'hizmet-vale', src: R + '2-vale-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/2-vale-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Vale hizmetini temsil eden görsel' },
  { id: 'hizmet-cocuk', src: R + '3-cgocuk-bakm-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/3-cgocuk-bakm-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Çocuk bakım hizmetini temsil eden görsel' },
  { id: 'hizmet-yemek', src: R + '4-kahvaltocoyemek-servisi-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/4-kahvaltocoyemek-servisi-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Kahvaltı ve yemek servisini temsil eden görsel' },
  { id: 'hizmet-bahce', src: R + '5-bahcge-cgicgek-bakm-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/5-bahcge-cgicgek-bakm-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Bahçe ve çiçek bakımını temsil eden görsel' },
  { id: 'hizmet-akilli-ev', src: R + '6-akll-ev-entegrasyonu-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/6-akll-ev-entegrasyonu-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Akıllı ev kontrol panelini temsil eden görsel' },
  { id: 'hizmet-fitness', src: R + '7-fitness-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/7-fitness-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Fitness alanını temsil eden görsel' },
  { id: 'hizmet-yoga', src: R + '8-yogaocopilates.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/8-yogaocopilates.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Yoga ve pilates stüdyosunu temsil eden görsel' },
  { id: 'hizmet-havuz', src: R + '9-kapal-yuezme-havuzu-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/9-kapal-yuezme-havuzu-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Kapalı yüzme havuzunu temsil eden görsel' },
  { id: 'hizmet-hamam', src: R + '10-hamam-ve-sauna-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/10-hamam-ve-sauna-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Hamam ve sauna alanını temsil eden görsel' },
  { id: 'hizmet-resepsiyon', src: R + '11-resepsiyon-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/11-resepsiyon-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Resepsiyon hizmetini temsil eden görsel' },
  { id: 'hizmet-kartli-gecis', src: R + '12-kisgiye-oezel-kartl-gecgisg-sistemi-200kb.jpg', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/12-kisgiye-oezel-kartl-gecgisg-sistemi-200kb.jpg', w: 1600, h: 900, widths: [480, 1600], alt: 'Kişiye özel kartlı geçiş sistemini temsil eden görsel' },

  // ——— Konum ve yerleşim ———
  { id: 'lokasyon', src: R + 'incek-premium-lokasyon.webp', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/incek-premium-lokasyon.webp', w: 1536, h: 1024, widths: [480, 1536], alt: 'Resmî lokasyon görseli: proje ve çevresindeki noktalar', note: 'Görsel üzerindeki mesafe etiketleri resmî görsele aittir; site metninde mesafe verilmez.' },
  { id: 'vaziyet', src: R + 'incek-premium-vaziyet-plan.webp', origin: 'resmi', sourceUrl: OFFICIAL + 'storage/pages/incek-premium-vaziyet-plan.webp', w: 1200, h: 675, widths: [480, 1200], alt: 'Vaziyet görseli: arsadaki yerleşimin kuşbakışı görünümü (mimari kat planı değildir)' }
];

/** @param {string} id */
export function getAsset(id) {
  const a = assets.find((x) => x.id === id);
  if (!a) throw new Error('Bilinmeyen görsel: ' + id);
  return a;
}

/** Sitede kullanılacak göreli yol (base eklenmeden). */
export function assetPath(id, width) {
  const a = getAsset(id);
  const w = width && a.widths.includes(width) ? width : Math.max(...a.widths);
  return `img/${id}-${w}.webp`;
}

/** Bir görselin büyük/küçük sürümleri: sahne seçiminde kullanılır. */
export function assetSources(id) {
  const a = getAsset(id);
  const sorted = [...a.widths].sort((x, y) => x - y);
  return { w: a.w, h: a.h, small: `img/${id}-${sorted[0]}.webp`, large: `img/${id}-${sorted[sorted.length - 1]}.webp`, smallW: sorted[0], largeW: sorted[sorted.length - 1] };
}
