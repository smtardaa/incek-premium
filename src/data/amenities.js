/**
 * Sosyal olanaklar ve hizmetler — resmî “Ayrıcalıklar” sayfasındaki liste esas alınmıştır.
 * Proje inşa sürecinde olduğundan metinler “planlanan” bağlamında yazılmıştır.
 * Ücret, çalışma saati, kapasite, hizmet seviyesi gibi doğrulanmamış bilgi EKLENMEMELİDİR.
 *
 * Gruplar dış cephedeki erişim noktalarına (src/data/exterior.js) karşılık gelir.
 * Bina üzerinde konumu doğrulanmayan hizmetler “hizmetler” grubunda, genel
 * “Sosyal olanaklar” düğmesinden açılır.
 */
export const amenityItems = {
  otopark: { title: 'Otopark', asset: 'peyzaj-otopark', text: 'Görselde podyumun altında iki katlı otopark görülüyor. Otopark katlarının üzerinde peyzajlı ortak teras yer alıyor.', source: 'Dış cephe ve galeri görselleri' },
  vale: { title: 'Vale', asset: 'hizmet-vale', text: 'Resmî sitede vale hizmeti projenin ayrıcalıkları arasında sayılıyor: konforlu ve zahmetsiz bir park deneyimi hedefleniyor.', source: 'incekpremium.com/ayricaliklar' },
  fitness: { title: 'Fitness', asset: 'hizmet-fitness', text: 'Projede sakinlerin kullanımı için fitness alanı planlanıyor. Resmî sitede fitness, yoga-pilates, kapalı havuz, hamam ve sauna için toplam 1.630 m² ifadesi yer alıyor.', source: 'incekpremium.com/proje-hakkinda' },
  yoga: { title: 'Yoga – Pilates', asset: 'hizmet-yoga', text: 'Yoga ve pilates stüdyoları, projede sunulması planlanan sağlıklı yaşam alanları arasında.', source: 'incekpremium.com/ayricaliklar' },
  havuz: { title: 'Kapalı yüzme havuzu', asset: 'hizmet-havuz', text: 'Resmî sitede dört mevsim kullanıma yönelik kapalı yüzme havuzu planlanan olanaklar arasında listeleniyor.', source: 'incekpremium.com/ayricaliklar' },
  hamam: { title: 'Hamam ve sauna', asset: 'hizmet-hamam', text: 'Hamam ve sauna, projede planlanan dinlenme alanları arasında yer alıyor.', source: 'incekpremium.com/ayricaliklar' },
  girisCephe: { title: 'Giriş', asset: 'dis-giris', text: 'Resmî görsellerde İncek Premium yazılı giriş kapısı ve kule girişi görülüyor.', source: 'Resmî galeri' },
  resepsiyon: { title: 'Resepsiyon', asset: 'hizmet-resepsiyon', text: 'Projede profesyonel resepsiyon hizmeti planlanıyor.', source: 'incekpremium.com/ayricaliklar' },
  konsiyerj: { title: '7/24 Konsiyerj', asset: 'hizmet-konsiyerj', text: 'Resmî sitede 7/24 konsiyerj hizmeti, sakinlerin günlük işlerini kolaylaştıracak ayrıcalıklar arasında sayılıyor.', source: 'incekpremium.com/ayricaliklar' },
  kartli: { title: 'Kişiye özel kartlı geçiş', asset: 'hizmet-kartli-gecis', text: 'Kişiye özel, kartlı ve kontrollü geçiş sistemi projenin planlanan güvenlik altyapısı arasında.', source: 'incekpremium.com/ayricaliklar' },
  teras: { title: 'Peyzajlı teras', asset: 'peyzaj-teras', text: 'Podyum üzerinde ahşap kaplı yürüyüş yolları, pergolalı oturma alanları ve yeşil alanlar görselleştirilmiş.', source: 'Resmî galeri' },
  oyun: { title: 'Oturma ve oyun alanları', asset: 'peyzaj-oyun', text: 'Resmî görsellerde terasta oturma grupları ve çocuk oyun alanı yer alıyor.', source: 'Resmî galeri' },
  bahce: { title: 'Bahçe bakım', asset: 'hizmet-bahce', text: 'Resmî sitede bahçe ve çiçek bakım hizmeti planlanan ayrıcalıklar arasında sayılıyor.', source: 'incekpremium.com/ayricaliklar' },
  cocuk: { title: 'Çocuk bakım', asset: 'hizmet-cocuk', text: 'Çocuk bakım hizmeti, resmî sitede listelenen planlanan ayrıcalıklardan biri.', source: 'incekpremium.com/ayricaliklar' },
  yemek: { title: 'Kahvaltı ve yemek servisi', asset: 'hizmet-yemek', text: 'Kahvaltı ve yemek servisi, projede sunulması planlanan hizmetler arasında yer alıyor.', source: 'incekpremium.com/ayricaliklar' },
  akilli: { title: 'Akıllı ev entegrasyonu', asset: 'hizmet-akilli-ev', text: 'Resmî sitede akıllı ev entegrasyonu ayrıcalıklar arasında listeleniyor. Kapsamı ve donanımı için satış ekibine danışın.', source: 'incekpremium.com/ayricaliklar' }
};

export const amenityGroups = [
  { id: 'otopark', label: 'Otopark ve vale', items: ['otopark', 'vale'], note: null },
  { id: 'spor', label: 'Spor ve sağlıklı yaşam', items: ['fitness', 'yoga', 'havuz', 'hamam'], note: 'Görselde “Gym Center” yazan yapı işaretlendi. Yoga, havuz, hamam ve saunanın bina içindeki konumları doğrulanmadı.' },
  { id: 'giris', label: 'Giriş ve lobi', items: ['girisCephe', 'resepsiyon', 'konsiyerj', 'kartli'], note: 'Lobi bandı temsili olarak işaretlendi.' },
  { id: 'peyzaj', label: 'Peyzajlı teras', items: ['teras', 'oyun', 'bahce'], note: null },
  { id: 'hizmetler', label: 'Diğer hizmetler', items: ['cocuk', 'yemek', 'akilli', 'konsiyerj', 'bahce'], note: 'Bu hizmetler için binada ayrı bir fiziksel konum işaretlenmedi.' }
];

/** Resmî “Ayrıcalıklar” sayfasındaki sıralama (yazılı bölüm için). */
export const officialPrivileges = ['konsiyerj', 'vale', 'cocuk', 'yemek', 'bahce', 'akilli', 'fitness', 'yoga', 'havuz', 'hamam', 'resepsiyon', 'kartli'];

export function getGroup(id) {
  return amenityGroups.find((g) => g.id === id) || null;
}
