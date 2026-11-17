/**
 * Galeri içerikleri (yazılı bölüm). Kategoriler filtre düğmelerine karşılık gelir.
 * Görsellerin kaynağı: src/data/assets.js. Fiyat/kampanya içeren resmî görseller kullanılmaz.
 */
export const galleryCategories = [
  { id: 'dis', label: 'Dış cephe' },
  { id: 'ic', label: 'İç mekân' },
  { id: 'sosyal', label: 'Sosyal alan' },
  { id: 'konum', label: 'Konum ve yerleşim' }
];

export const galleryItems = [
  { asset: 'dis-ana', cat: 'dis', caption: 'Genel görünüm' },
  { asset: 'dis-3', cat: 'dis', caption: 'Kule ve podyum' },
  { asset: 'dis-2', cat: 'dis', caption: 'Yol tarafı' },
  { asset: 'dis-4', cat: 'dis', caption: 'Geniş açı' },
  { asset: 'dis-5', cat: 'dis', caption: 'Giriş ve cephe' },
  { asset: 'dis-gunbatimi', cat: 'dis', caption: 'Gün batımı' },
  { asset: 'dis-gece', cat: 'dis', caption: 'Akşam görünümü' },
  { asset: 'dis-cadde', cat: 'dis', caption: 'Cadde seviyesi' },
  { asset: 'a-salon-oturma', cat: 'ic', caption: 'Açık mutfaklı tip · salon' },
  { asset: 'a-salon-yemek', cat: 'ic', caption: 'Açık mutfaklı tip · yemek alanı' },
  { asset: 'a-mutfak', cat: 'ic', caption: 'Açık mutfaklı tip · mutfak' },
  { asset: 'a-salon-mutfak', cat: 'ic', caption: 'Açık mutfaklı tip · salondan mutfağa' },
  { asset: 'b-salon-oturma', cat: 'ic', caption: 'Kapalı mutfaklı tip · salon' },
  { asset: 'b-salon-tv', cat: 'ic', caption: 'Kapalı mutfaklı tip · TV duvarı' },
  { asset: 'b-mutfak', cat: 'ic', caption: 'Kapalı mutfaklı tip · mutfak' },
  { asset: 'ortak-ebeveyn', cat: 'ic', caption: 'Ebeveyn odası (örnek)' },
  { asset: 'ortak-ikinci-calisma', cat: 'ic', caption: 'İkinci oda (örnek)' },
  { asset: 'ortak-banyo', cat: 'ic', caption: 'Banyo (örnek)' },
  { asset: 'ortak-hol', cat: 'ic', caption: 'Giriş holü (örnek)' },
  { asset: 'peyzaj-teras', cat: 'sosyal', caption: 'Peyzajlı teras' },
  { asset: 'peyzaj-yuruyus', cat: 'sosyal', caption: 'Ahşap yürüyüş yolu' },
  { asset: 'peyzaj-oyun', cat: 'sosyal', caption: 'Oturma ve oyun alanları' },
  { asset: 'peyzaj-gym', cat: 'sosyal', caption: '“Gym Center” yapısı' },
  { asset: 'peyzaj-otopark', cat: 'sosyal', caption: 'Otopark ve teras' },
  { asset: 'peyzaj-kusbakisi', cat: 'sosyal', caption: 'Teras kuşbakışı' },
  { asset: 'hizmet-fitness', cat: 'sosyal', caption: 'Fitness (temsilî görsel)' },
  { asset: 'hizmet-havuz', cat: 'sosyal', caption: 'Kapalı havuz (temsilî görsel)' },
  { asset: 'lokasyon', cat: 'konum', caption: 'Resmî lokasyon görseli' },
  { asset: 'vaziyet', cat: 'konum', caption: 'Vaziyet görseli (kat planı değildir)' }
];
