/**
 * Örnek daire tipleri, odalar, kamera açıları (görünümler) ve bilgi noktaları.
 *
 * - Görseller resmî proje renderlarıdır (bkz. src/data/assets.js).
 * - Hotspot koordinatları görselin normalize koordinatlarıdır (0–1). Ekran pikseline bağlı değildir.
 * - Bu daireler ÖRNEKTİR: seçilen katın kesin envanteri, daire numarası veya m² bilgisi değildir.
 * - İkinci odanın kullanımı resmî olarak belirtilmedi; çok amaçlı / çalışma odası örneği gösterilir.
 *
 * hotspot türleri:
 *   info → bilgi kartı açar
 *   go   → başka bir oda/görünüme geçer   { to: { room, view } }
 *   zoom → aynı görselde ayrıntıya yaklaşır { rect: { x, y, w, h } } (normalize)
 */

const CEILING = { kind: 'info', title: '3,20 m tavan yüksekliği', text: 'Resmî proje metninde dairelerde 3,20 m tavan yüksekliği belirtiliyor.' };

export const roomOrder = ['salon', 'mutfak', 'ebeveyn', 'ikinci', 'banyo'];

export const roomLabels = {
  salon: 'Salon',
  mutfak: 'Mutfak',
  ebeveyn: 'Ebeveyn odası',
  ikinci: 'İkinci oda',
  banyo: 'Banyo'
};

/** Temsili oda şeması (mimari plan DEĞİLDİR; ölçü/alan içermez). Birim: şema ızgarası. */
const schemeBase = {
  salon: { x: 0, y: 0, w: 56, h: 40 },
  mutfak: { x: 56, y: 0, w: 26, h: 22 },
  hol: { x: 56, y: 22, w: 26, h: 18 },
  banyo: { x: 82, y: 22, w: 18, h: 18 },
  ebeveyn: { x: 0, y: 40, w: 46, h: 30 },
  ikinci: { x: 46, y: 40, w: 36, h: 30 }
};

export const apartmentTypes = [
  {
    id: 'acik',
    code: 'A',
    title: 'Açık mutfaklı 2+1',
    short: 'Açık mutfak',
    summary: 'Mutfak, yemek alanı ve salon aynı hacmi paylaşır. Delikli paravanlar alanları ayırırken ışığın geçmesine izin verir.',
    kitchenNote: 'Açık mutfak: salonla arasında duvar yoktur; yemek masası mutfak tezgâhının hemen önündedir.',
    scheme: { ...schemeBase, openKitchen: true },
    rooms: {
      salon: {
        intro: 'Geniş pencere önünde oturma grubu, TV duvarı ve paravanlarla ayrılan yemek alanı.',
        decor: 'oturma',
        views: [
          {
            id: 'oturma', label: 'Oturma alanı', asset: 'a-salon-oturma', focus: [0.55, 0.55],
            hotspots: [
              { kind: 'info', x: 0.165, y: 0.34, title: 'Fon perde, tül ve stor', text: 'Render’da pencere önünde fon perde, tül ve stor perde birlikte kullanılmış. Fon perde rengini “Dekorasyon” panelinden örnek seçeneklerle değiştirebilirsiniz.' },
              { kind: 'zoom', x: 0.4, y: 0.42, label: 'Pencereye yaklaş', rect: { x: 0.1, y: 0.02, w: 0.52, h: 0.74 } },
              { kind: 'zoom', x: 0.72, y: 0.7, label: 'Oturma grubuna yaklaş', rect: { x: 0.46, y: 0.46, w: 0.54, h: 0.54 } },
              { ...CEILING, x: 0.75, y: 0.17 },
              { kind: 'go', x: 0.14, y: 0.56, label: 'TV duvarı', to: { room: 'salon', view: 'tv' } },
              { kind: 'go', x: 0.93, y: 0.24, label: 'Yemek alanı', to: { room: 'salon', view: 'yemek' } }
            ]
          },
          {
            id: 'yemek', label: 'Yemek alanı', asset: 'a-salon-yemek', focus: [0.45, 0.5],
            hotspots: [
              { kind: 'info', x: 0.25, y: 0.3, title: 'Delikli paravanlar', text: 'Yemek ve oturma alanı arasında, ışığı geçiren delikli paravanlar kullanılmış (render).' },
              { kind: 'info', x: 0.55, y: 0.78, title: 'Yemek masası', text: 'Açık mutfaklı tipte yemek masası, mutfak ile salon arasındaki ortak alanda konumlanıyor.' },
              { kind: 'go', x: 0.15, y: 0.62, label: 'Oturma alanı', to: { room: 'salon', view: 'oturma' } },
              { kind: 'go', x: 0.88, y: 0.42, label: 'Mutfağa bak', to: { room: 'mutfak', view: 'salondan' } }
            ]
          },
          {
            id: 'tv', label: 'TV duvarı', asset: 'a-salon-tv', focus: [0.5, 0.5],
            hotspots: [
              { kind: 'info', x: 0.55, y: 0.38, title: 'TV duvarı', text: 'Ahşap dokulu panel ve açık raflarla düzenlenmiş TV duvarı (örnek dekorasyon).' },
              { kind: 'go', x: 0.9, y: 0.55, label: 'Oturma alanı', to: { room: 'salon', view: 'oturma' } }
            ]
          }
        ]
      },
      mutfak: {
        intro: 'Açık mutfak salonla birleşir; tezgâh, cam kapaklı üst dolaplar ve yemek masası aynı hacimde.',
        views: [
          {
            id: 'genel', label: 'Mutfak ve yemek', asset: 'a-mutfak', focus: [0.5, 0.45],
            hotspots: [
              { kind: 'info', x: 0.5, y: 0.2, title: 'Açık mutfak', text: 'Mutfak, salon ve yemek alanıyla aynı hacmi paylaşıyor; arada duvar bulunmuyor.' },
              { kind: 'info', x: 0.3, y: 0.12, title: 'Cam kapaklı üst dolaplar', text: 'Aydınlatmalı, cam kapaklı üst dolaplar render’da tezgâh boyunca uzanıyor.' },
              { kind: 'zoom', x: 0.6, y: 0.5, label: 'Tezgâha yaklaş', rect: { x: 0.18, y: 0.08, w: 0.64, h: 0.64 } },
              { kind: 'go', x: 0.06, y: 0.55, label: 'Salona bak', to: { room: 'mutfak', view: 'salondan' } },
              { kind: 'go', x: 0.93, y: 0.5, label: 'Tezgâh detayı', to: { room: 'mutfak', view: 'detay' } }
            ]
          },
          {
            id: 'salondan', label: 'Salondan mutfağa', asset: 'a-salon-mutfak', focus: [0.6, 0.45],
            hotspots: [
              { kind: 'info', x: 0.62, y: 0.32, title: 'Açık plan', text: 'Salondan bakıldığında mutfak, paravanların arkasında görülebiliyor. Kapalı mutfaklı tipte bu bölüm ayrı bir odadır.' },
              { kind: 'go', x: 0.08, y: 0.6, label: 'Salon', to: { room: 'salon', view: 'yemek' } },
              { kind: 'go', x: 0.9, y: 0.6, label: 'Mutfak', to: { room: 'mutfak', view: 'genel' } }
            ]
          },
          {
            id: 'detay', label: 'Tezgâh detayı', asset: 'a-mutfak-detay', focus: [0.5, 0.5],
            hotspots: [
              { kind: 'info', x: 0.8, y: 0.83, title: 'Ankastre fırın', text: 'Render’da tezgâh altında ankastre fırın görülüyor. Teslim donanımı için resmî satış ekibine danışın.' },
              { kind: 'info', x: 0.55, y: 0.6, title: 'Mermer görünümlü tezgâh arası', text: 'Tezgâh arası ve tezgâh, açık renkli damarlı yüzeyle gösterilmiş (render).' },
              { kind: 'go', x: 0.06, y: 0.5, label: 'Mutfak geneli', to: { room: 'mutfak', view: 'genel' } }
            ]
          }
        ]
      },
      ebeveyn: {
        intro: 'Boy dolabı ve geniş pencereli ebeveyn yatak odası örneği.',
        views: [
          {
            id: 'genel', label: 'Ebeveyn odası', asset: 'ortak-ebeveyn', focus: [0.55, 0.55],
            hotspots: [
              { kind: 'info', x: 0.5, y: 0.6, title: 'Yatak alanı', text: 'Örnek dekorasyonda çift kişilik yatak ve iki yanda komodinler kullanılmış.' },
              { kind: 'info', x: 0.1, y: 0.4, title: 'Boy dolabı', text: 'Odanın bir duvarı boyunca koyu tonlu boy dolabı görülüyor (render).' },
              { kind: 'info', x: 0.86, y: 0.32, title: 'Pencere', text: 'Odanın gün ışığı aldığı pencere, stor perde ile gösterilmiş.' }
            ]
          }
        ]
      },
      ikinci: {
        intro: 'Çok amaçlı kullanılabilecek ikinci oda; bu örnekte yatak ve çalışma masasıyla düzenlenmiş.',
        views: [
          {
            id: 'calisma', label: 'Çalışma köşesi', asset: 'ortak-ikinci-calisma', focus: [0.55, 0.5],
            hotspots: [
              { kind: 'info', x: 0.72, y: 0.52, title: 'Çalışma masası', text: 'İkinci oda bu örnekte çalışma masası ve tek kişilik yatakla düzenlenmiş. Kullanım tercihe göre değişebilir; resmî yerleşim önerisi değildir.' },
              { kind: 'info', x: 0.3, y: 0.62, title: 'Yatak nişi', text: 'Raf ve dolap nişine yerleştirilmiş tek kişilik yatak (örnek).' },
              { kind: 'go', x: 0.06, y: 0.45, label: 'Odanın diğer açısı', to: { room: 'ikinci', view: 'genel' } }
            ]
          },
          {
            id: 'genel', label: 'Oda geneli', asset: 'a-ikinci-genel', focus: [0.5, 0.5],
            hotspots: [
              { kind: 'info', x: 0.62, y: 0.42, title: 'Çok amaçlı düzen', text: 'Dolap, raf ve çalışma yüzeyi bir arada; oda misafir, çocuk veya çalışma odası olarak kurgulanabilir (örnek).' },
              { kind: 'go', x: 0.93, y: 0.5, label: 'Çalışma köşesi', to: { room: 'ikinci', view: 'calisma' } }
            ]
          }
        ]
      },
      banyo: {
        intro: 'Yuvarlak aynalı lavabo dolabı ve cam duş bölmeli banyo örneği.',
        views: [
          {
            id: 'lavabo', label: 'Lavabo ve duş', asset: 'ortak-banyo', focus: [0.55, 0.45],
            hotspots: [
              { kind: 'info', x: 0.6, y: 0.17, title: 'Aydınlatmalı ayna', text: 'Arkadan aydınlatmalı yuvarlak ayna ve asma lavabo dolabı (render).' },
              { kind: 'info', x: 0.82, y: 0.5, title: 'Cam duş bölmesi', text: 'Siyah profilli cam duş bölmesi gösterilmiş.' },
              { kind: 'go', x: 0.06, y: 0.5, label: 'Diğer açı', to: { room: 'banyo', view: 'dus' } }
            ]
          },
          {
            id: 'dus', label: 'Duş alanı', asset: 'ortak-banyo-dus', focus: [0.45, 0.5],
            hotspots: [
              { kind: 'info', x: 0.3, y: 0.45, title: 'Duş alanı', text: 'Tavan ve el duşlu duş alanı ile asma klozet (render).' },
              { kind: 'go', x: 0.93, y: 0.5, label: 'Lavabo', to: { room: 'banyo', view: 'lavabo' } }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'kapali',
    code: 'B',
    title: 'Kapalı mutfaklı 2+1',
    short: 'Kapalı mutfak',
    summary: 'Mutfak salondan ayrı, kapı açıklığı olan kendi hacmindedir. Salon oturma ve yemek alanına ayrılır.',
    kitchenNote: 'Kapalı mutfak: salondan duvar ve kapı açıklığıyla ayrılan, kendi penceresi olan ayrı bir hacim.',
    scheme: { ...schemeBase, openKitchen: false },
    rooms: {
      salon: {
        intro: 'Yemek masası, köşe oturma grubu ve TV duvarı; mutfak ayrı bir odada.',
        decor: 'oturma',
        views: [
          {
            id: 'oturma', label: 'Oturma ve yemek', asset: 'b-salon-oturma', focus: [0.62, 0.6],
            hotspots: [
              { kind: 'info', x: 0.96, y: 0.3, title: 'Fon perde', text: 'Pencere kenarındaki fon perde. Rengini “Dekorasyon” panelinden örnek seçeneklerle değiştirebilirsiniz.' },
              { kind: 'zoom', x: 0.78, y: 0.72, label: 'Oturma grubuna yaklaş', rect: { x: 0.52, y: 0.5, w: 0.48, h: 0.48 } },
              { kind: 'info', x: 0.3, y: 0.72, title: 'Yemek alanı', text: 'Kapalı mutfaklı tipte yemek masası salonun içinde, oturma grubunun yanında konumlanıyor.' },
              { ...CEILING, x: 0.72, y: 0.15 },
              { kind: 'go', x: 0.2, y: 0.46, label: 'TV duvarı', to: { room: 'salon', view: 'tv' } }
            ]
          },
          {
            id: 'tv', label: 'TV duvarı', asset: 'b-salon-tv', focus: [0.45, 0.5],
            hotspots: [
              { kind: 'info', x: 0.25, y: 0.35, title: 'TV duvarı', text: 'Gizli aydınlatmalı panel ve alçak TV ünitesi (örnek dekorasyon).' },
              { kind: 'info', x: 0.455, y: 0.36, title: 'Duvar paneli', text: 'Render’da kapı yanında bir duvar paneli görülüyor. Resmî sitede akıllı ev entegrasyonu planlanan hizmetler arasında listeleniyor; panelin işlevi doğrulanmadı.' },
              { kind: 'go', x: 0.52, y: 0.5, label: 'Mutfağa geç', to: { room: 'mutfak', view: 'genel' } },
              { kind: 'go', x: 0.93, y: 0.55, label: 'Oturma alanı', to: { room: 'salon', view: 'oturma' } }
            ]
          }
        ]
      },
      mutfak: {
        intro: 'Salondan ayrı, kapı açıklığı ve kendi penceresi olan kapalı mutfak.',
        views: [
          {
            id: 'genel', label: 'Kapalı mutfak', asset: 'b-mutfak', focus: [0.5, 0.45],
            hotspots: [
              { kind: 'info', x: 0.55, y: 0.18, title: 'Kapalı mutfak', text: 'Mutfak salondan duvar ve kapı açıklığıyla ayrılıyor; pencereli, ayrı bir hacim olarak gösteriliyor.' },
              { kind: 'info', x: 0.185, y: 0.5, title: 'Kapı açıklığı', text: 'Görseldeki çerçeve, mutfağı salondan ayıran açıklığı gösteriyor. Açık mutfaklı tipte bu ayrım yoktur.' },
              { kind: 'info', x: 0.58, y: 0.7, title: 'Mutfak içi yemek köşesi', text: 'Pencere önünde küçük bir yemek masası kurgulanmış (örnek dekorasyon).' },
              { kind: 'zoom', x: 0.42, y: 0.48, label: 'Pencereye yaklaş', rect: { x: 0.25, y: 0.05, w: 0.55, h: 0.6 } },
              { kind: 'go', x: 0.06, y: 0.62, label: 'Salona dön', to: { room: 'salon', view: 'tv' } }
            ]
          }
        ]
      },
      ebeveyn: {
        intro: 'Ebeveyn yatak odası örneği.',
        shared: 'Kapalı mutfaklı tip için ayrı bir yatak odası görseli bulunamadı; resmî galerideki ortak örnek görsel gösteriliyor.',
        views: [
          {
            id: 'genel', label: 'Ebeveyn odası', asset: 'ortak-ebeveyn', focus: [0.55, 0.55],
            hotspots: [
              { kind: 'info', x: 0.5, y: 0.6, title: 'Yatak alanı', text: 'Örnek dekorasyonda çift kişilik yatak ve iki yanda komodinler kullanılmış.' },
              { kind: 'info', x: 0.1, y: 0.4, title: 'Boy dolabı', text: 'Odanın bir duvarı boyunca koyu tonlu boy dolabı görülüyor (render).' },
              { kind: 'info', x: 0.86, y: 0.32, title: 'Pencere', text: 'Odanın gün ışığı aldığı pencere, stor perde ile gösterilmiş.' }
            ]
          }
        ]
      },
      ikinci: {
        intro: 'Çok amaçlı kullanılabilecek ikinci oda; bu örnekte yatak ve çalışma masasıyla düzenlenmiş.',
        shared: 'Bu görsel resmî galeride iki tipin sekmesinde de yer alıyor.',
        views: [
          {
            id: 'calisma', label: 'Çalışma köşesi', asset: 'ortak-ikinci-calisma', focus: [0.55, 0.5],
            hotspots: [
              { kind: 'info', x: 0.72, y: 0.52, title: 'Çalışma masası', text: 'İkinci oda bu örnekte çalışma masası ve tek kişilik yatakla düzenlenmiş. Kullanım tercihe göre değişebilir; resmî yerleşim önerisi değildir.' },
              { kind: 'info', x: 0.3, y: 0.62, title: 'Yatak nişi', text: 'Raf ve dolap nişine yerleştirilmiş tek kişilik yatak (örnek).' }
            ]
          }
        ]
      },
      banyo: {
        intro: 'Yuvarlak aynalı lavabo dolabı ve cam duş bölmeli banyo örneği.',
        shared: 'Banyo görselleri için resmî kaynakta tip ayrımı belirtilmiyor; ortak örnek olarak gösteriliyor.',
        views: [
          {
            id: 'lavabo', label: 'Lavabo ve duş', asset: 'ortak-banyo', focus: [0.55, 0.45],
            hotspots: [
              { kind: 'info', x: 0.6, y: 0.17, title: 'Aydınlatmalı ayna', text: 'Arkadan aydınlatmalı yuvarlak ayna ve asma lavabo dolabı (render).' },
              { kind: 'info', x: 0.82, y: 0.5, title: 'Cam duş bölmesi', text: 'Siyah profilli cam duş bölmesi gösterilmiş.' },
              { kind: 'go', x: 0.06, y: 0.5, label: 'Diğer açı', to: { room: 'banyo', view: 'dus' } }
            ]
          },
          {
            id: 'dus', label: 'Duş alanı', asset: 'ortak-banyo-dus', focus: [0.45, 0.5],
            hotspots: [
              { kind: 'info', x: 0.3, y: 0.45, title: 'Duş alanı', text: 'Tavan ve el duşlu duş alanı ile asma klozet (render).' },
              { kind: 'go', x: 0.93, y: 0.5, label: 'Lavabo', to: { room: 'banyo', view: 'lavabo' } }
            ]
          }
        ]
      }
    }
  }
];

export function getType(id) {
  return apartmentTypes.find((t) => t.id === id) || null;
}
