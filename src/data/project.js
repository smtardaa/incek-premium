/**
 * Proje temel bilgileri — resmî siteden 17.11.2026 tarihinde kontrol edildi.
 * Kaynaklar: https://incekpremium.com/proje-hakkinda , /iletisim , /galeri
 *
 * Bu dosya sitedeki bütün temel bilgilerin tek kaynağıdır. Bilgi değişirse
 * yalnızca burayı güncelleyin. Doğrulanmamış veri (daire numarası, m², kat
 * planı, fiyat vb.) buraya EKLENMEMELİDİR.
 */
export const project = {
  name: 'İncek Premium',
  developer: 'Vertisa',
  checkedAt: '17.11.2026',
  officialSite: 'https://incekpremium.com/',
  facts: [
    { label: 'Blok', value: '1' },
    { label: 'Kat', value: '30' },
    { label: 'Konut', value: '300' },
    { label: 'Proje alanı', value: '42.000 m²' },
    { label: 'Daire tipi', value: '2+1 · açık ve kapalı mutfak' },
    { label: 'Lokasyon', value: 'İncek / Ankara' }
  ],
  schedule: {
    start: '01.03.2025',
    delivery: '30.06.2027',
    note: 'Tarihler resmî sitede duyurulan proje takvimidir; kesinleşmiş teslim olayı olarak sunulmaz.'
  },
  /** Resmî “Proje Hakkında” sayfasında yer alan teknik/özellik ifadeleri */
  highlights: [
    { title: '30 katlı kule', text: 'Resmî siteye göre 110 m yüksekliğin üzerinde, 30 katlı tek blok kule yapısı.' },
    { title: '150 fore kazık', text: 'Zemin etüdüne dayalı olarak 150 adet fore kazıkla güçlendirilmiş taşıyıcı sistem.' },
    { title: '3,20 m tavan yüksekliği', text: 'Resmî proje metninde dairelerde 3,20 m tavan yüksekliği belirtiliyor.' },
    { title: 'Dört asansörlü sistem', text: 'Resmî galeri metninde dört asansörlü dikey ulaşım sisteminden söz ediliyor.' },
    { title: 'Kontrollü giriş', text: 'Resepsiyon ve kişiye özel kartlı geçiş sistemi projede planlanan güvenlik altyapısı arasında.' },
    { title: 'Geniş sosyal alanlar', text: 'Resmî sitede fitness, yoga-pilates, kapalı havuz, hamam ve sauna için 1.630 m² ifadesi yer alıyor.' }
  ],
  about: [
    'İncek Premium, Ankara’da İncek – Gölbaşı Taşpınar bölgesinde, Vertisa tarafından geliştirilen tek bloklu bir konut projesidir. Resmî bilgilere göre 30 katlı kulede toplam 300 konut bulunuyor ve proje 42.000 m² alan üzerinde konumlanıyor.',
    'Projede açık mutfaklı ve kapalı mutfaklı olmak üzere iki farklı 2+1 daire tipi sunuluyor. Resmî metinde yeşil alanlarla çevrili, şehir merkezinden kopmadan sakin bir yaşam hedeflendiği; Mogan Gölü’ne ve çevredeki eğitim, alışveriş ve kamu yapılarına yakınlık vurgulanıyor.',
    'Proje inşa sürecindedir. Bu sitede anlatılan hizmetler ve sosyal alanlar, projede sunulması planlanan olanaklardır.'
  ],
  /** Resmî sitede “yakınlık” vurgusuyla anılan noktalar (mesafe/süre verilmez). */
  nearby: [
    'Mogan Gölü', 'Eymir Gölü', 'ODTÜ Ormanı yürüyüş yolları', 'Ahlatlıbel Atatürk Parkı',
    'TED Ankara Koleji', 'Atılım Üniversitesi', 'Ufuk Üniversitesi', 'ODTÜ', 'Hacettepe Üniversitesi',
    'Bilkent Üniversitesi', 'Yargıtay Yeni Hizmet Binası', 'Panora AVM'
  ],
  contact: {
    address: 'Taşpınar Mahallesi 2803 Sokak No:14 İncek/ANKARA',
    phoneDisplay: '444 72 62',
    phoneHref: 'tel:4447262',
    mobileDisplay: '+90 542 492 15 71',
    whatsappNumber: '905424921571',
    whatsappBase: 'https://wa.me/905424921571',
    email: 'info@incekpremium.com',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Taşpınar Mahallesi 2803 Sokak No:14 İncek Gölbaşı Ankara')
  },
  disclaimer: 'Açık beta · Tanıtım amaçlı konsept sunum. Görseller resmî proje renderlarıdır; dekorasyon seçenekleri örnek niteliğindedir. Fiyat ve satış bilgisi içermez.'
};
