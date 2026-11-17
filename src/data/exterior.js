/**
 * Dış cephe keşif sahnesi verisi — “İncek Premium.jpg” (1920×1080) üzerinde ölçülmüştür.
 *
 * TEMSİLİ KAT EŞLEŞTİRMESİ: Resmî mimari kat numaralandırması ve cephe–daire eşleşmesi
 * doğrulanmadı. Görselde lobi bandının üstünde 28 tipik cephe bandı ve en üstte bir taç
 * bandı ölçüldü. Resmî toplam 30 kat bilgisiyle uyum için en üst tipik bant “Kat 30”
 * kabul edilip aşağı doğru numaralandırıldı (en alt seçilebilir bant “Kat 3”). Lobi/giriş
 * bandı ve podyum ortak alan olarak ayrı tutuldu; otopark ve çatı konut katı sayılmaz.
 * Gerçek numaralandırma doğrulandığında yalnızca `floorNumberTop` / `lines` güncellenir.
 *
 * Koordinat sistemi: görselin doğal pikselleri. SVG viewBox ile birebir aynıdır;
 * ekran pikseline bağlı değildir.
 */
export const exteriorImage = { id: 'dis-ana', w: 1920, h: 1080 };

/** Sağ (koyu cam) cephede x=768'de ölçülen döşeme çizgileri (yukarıdan aşağı). */
export const lines = [36.5, 60.5, 83.5, 107, 131.5, 155, 179, 203, 226.5, 250, 274, 298, 321.5, 345.5,
  369, 393, 417, 441, 464.5, 488, 512, 535.5, 559, 583, 607, 630.5, 654, 676.5, 698];

/** Lobi/giriş bandının alt sınırı (x=768). */
export const lobbyBottom = 776;

/** Cephe geometrisi: köşe x'i, sağ cephe sağ kenarı, sol cephe sol kenarı. */
export const facade = { corner: 752, right: 883, left: 634, measureX: 768 };

/** Bina silueti (kat vurgularının gökyüzüne taşmaması için kırpma yolu). */
export const silhouette = [[750, 8], [883, 82], [885, 786], [700, 800], [632, 802], [632, 198], [646, 176], [711, 64], [729, 45], [733, 38]];

export const floorNumberTop = 30;
export const floorCount = lines.length - 1; // 28 seçilebilir bant

/**
 * Bina üzerindeki sosyal alan erişim noktaları (çokgen, görsel pikseli).
 * Yalnızca görselde fiziksel olarak seçilebilen bölgeler işaretlenmiştir.
 */
export const exteriorHotspots = [
  {
    id: 'giris', amenity: 'giris', label: 'Giriş ve lobi', hint: 'Temsili konum',
    points: [[634, 714], [752, 698], [883, 699], [883, 777], [752, 787], [703, 792], [701, 746], [634, 746]],
    anchor: [800, 742]
  },
  {
    id: 'spor', amenity: 'spor', label: 'Spor ve sağlıklı yaşam', hint: 'Görselde “Gym Center” yazan yapı',
    points: [[548, 742], [634, 744], [701, 746], [703, 800], [596, 806], [556, 784]],
    anchor: [600, 772]
  },
  {
    id: 'peyzaj', amenity: 'peyzaj', label: 'Peyzajlı teras', hint: 'Podyum üstü ortak alan',
    points: [[598, 806], [700, 801], [885, 787], [885, 768], [1010, 778], [1100, 795], [1188, 812], [1190, 826], [640, 830]],
    anchor: [1030, 806]
  },
  {
    id: 'otopark', amenity: 'otopark', label: 'Otopark ve vale', hint: 'Podyum altındaki otopark katları',
    points: [[642, 834], [1188, 830], [1244, 862], [1258, 918], [656, 914]],
    anchor: [960, 872]
  }
];

/** Mobil/dikey ekranda ilk odak (görsel pikseli). */
export const exteriorFocus = { x: 800, y: 560 };
