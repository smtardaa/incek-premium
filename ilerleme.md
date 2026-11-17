# İlerleme — açık beta v0.1.0 (17.11.2026)

## Tamamlananlar

- **Astro statik proje**, GitHub Pages iş akışı, kök alan adı + alt yol desteği (tek yerden `SITE_URL` / `BASE_PATH`).
- **Açılış**: marka, ana dış cephe, “Projeyi keşfet”; geri planda “Yazılı bilgileri okuyun” bağlantısı.
- **Dış cephe / kat seçimi**: gerçek görsel üzerinde ölçülmüş 28 kat bandı (SVG, görselin doğal koordinatları; görsel ve çokgenler aynı transformda). Hover vurgusu, tıklama/dokunma seçimi, klavye için kat listesi + üst/alt kat düğmeleri, iki örnek 2+1 tip seçimi, “Daireyi keşfet”.
- **Kata yakınlaşma → iç mekân**: seçili kat bandına 2,5× kamera hareketi, ardından iç mekâna yumuşak geçiş (görsel önce yüklenir/decode edilir; hata olursa mevcut sahne korunur ve bildirim gösterilir).
- **İç mekân**: iki tip × beş oda (salon, mutfak, ebeveyn, ikinci oda, banyo), toplam 18 kamera açısı; oda menüsü, açı sekmeleri, bilgi/geçiş/yakınlaşma noktaları, sınırlı sürükleyerek kaydırma, salonda ayrıntıya yaklaşma ve “Oda geneline dön”. Açık/kapalı mutfak farkı içerikte ve sahnelerde (salondan mutfağa bakış, kapı açıklığı) anlatılıyor.
- **Salon dekorasyonu (iki tip)**: Sıcak / Modern / Doğal paketleri, 3 perde rengi, 2 koltuk seçeneği, 6 kombinasyonun tamamı gerçek görsel katmanla; eşleşmeyen kombinasyonda “Özel”, “Varsayılana dön”, tip bazında saklama (depolama hatasına dayanıklı). Panel açıkken salonun tamamı panelin yanına sığdırılır.
- **Sosyal olanak sahneleri**: otopark/vale, spor (fitness, yoga-pilates, havuz, hamam-sauna), giriş/lobi (resepsiyon, konsiyerj, kartlı geçiş), peyzajlı teras; konumu doğrulanmayan hizmetler “Sosyal olanaklar” düğmesinden. Kartlarda “Randevu talep et” ve “Binaya dön”.
- **Yazılı bilgiler** (`/bilgiler/`): proje, takvim (duyurulan), daire tipleri, temsili oda şemaları, 12 ayrıcalık, filtreli galeri + lightbox, konum + harita bağlantısı, iletişim; “Görsel keşfe dön” son seçimleri korur.
- **WhatsApp randevu**: isteğe bağlı ad, tarih (geçmiş tarih engelli), saat aralığı, not, keşif bağlamı (kat/tip/sosyal alan, işaret kaldırılabilir); `encodeURIComponent` ile `wa.me` bağlantısı; onay mesajı gösterilmez.
- **Erişilebilirlik**: klavye ile tüm akış, görünür odak, native `<dialog>` (Escape, odak geri dönüşü), gizli sahneler `inert`, reduced-motion'da yalnızca kısa opaklık geçişi.
- **Performans**: tek geçiş yöneticisi (son istek kazanır, çakışma yok), yalnızca transform/opacity animasyonları, boşta rAF yok, aşamalı görsel yükleme. Ölçümler `TEST-RAPORU.md`.
- **Mobil gezinme (güncelleme)**: ekran dışındaki noktalar için kenar okları (her kenarda tek ok; dokununca en yakın noktaya kayar, nokta vurgulanır) ve mobilde küçültülmüş kontroller (dokunma alanı korunarak).
- **Testler**: 22 birim testi (`npm test`), derleme sonrası bağlantı/asset denetimi (`npm run check:links`).

## Kullanılan varsayımlar (doğrulanması gerekenler)

1. **Kat numaralandırması temsilidir.** Görselde lobi bandı üstünde 28 tipik bant ölçüldü; resmî 30 kat bilgisiyle uyum için en üst bant “30. kat”, en alt seçilebilir bant “3. kat” kabul edildi. Lobi/giriş bandı ve podyum ortak alan sayıldı. Gerçek numaralandırma öğrenilince yalnızca `src/data/exterior.js` güncellenir.
2. Kat başına daire sayısı, daire numaraları, m², cephe eşleşmesi **gösterilmez**; her katta aynı iki örnek tip sunulur.
3. “Giriş ve lobi” bandı temsilidir; “Spor” noktası görselde “Gym Center” yazan yapıya bağlandı, diğer spor alanlarının konumu doğrulanmadı (sitede belirtildi).
4. İkinci oda “çok amaçlı / çalışma odası” örneği olarak gösterilir.
5. Dekorasyondaki “mobilya alternatifi” aynı koltuğun kumaş rengi alternatifidir (yeni model üretilmedi).
6. Teslim tarihi “duyurulan proje takvimi” olarak sunulur; hizmetler “planlanan” olarak yazılmıştır.

## Açık kalanlar

- B tipi için ayrı ebeveyn odası / ikinci oda / banyo renderları yok (ortak örnek gösteriliyor).
- Doğrulanmış mimari kat planı yok (temsili şema var).
- Farklı model koltuk ve diğer odalar için dekorasyon görselleri yok.
- Dikey telefonda kat paneli küçüldü; “Giriş ve lobi” görünür, ancak otopark ve teras işaretleri hâlâ panelin arkasında. Bu alanlara “Sosyal olanaklar” düğmesi ve sahnedeki grup sekmeleriyle erişiliyor.
- Kenar okları yalnızca iç mekânda; dış cephede görsel ekran yüksekliğine tam sığdığı için dikey kaydırma yok, bu yüzden panel arkasındaki noktalara ok gösterilmiyor.
- Gerçek iOS/Safari ve Android cihaz testleri yapılmadı (yalnızca Chromium tabanlı uygulama içi tarayıcıda emülasyon).
- Referans video, bir sosyal medya gönderisinin düşük çözünürlüklü ekran kaydı; gömülü demonun hareketi örneklenen karelerde net seçilemedi. Hareket kurgusu promptta tarif edilen akışa göre yapıldı.

## Sonraki adımlar (öneri)

1. Satış ekibinden gerçek kat numaralandırması ve tip–cephe bilgisini alıp `exterior.js`'i güncellemek.
2. Eksik B tipi oda renderlarını ve mimari planları eklemek (`assets.js` + `apartments.js`).
3. Aynı kameradan farklı model koltuk render'ı ile gerçek mobilya alternatifi.
4. Gerçek cihazlarda (iPhone Safari, Android Chrome) dokunma ve performans testi.
5. Nihai yayında `PUBLIC_NOINDEX=false`, özel alan adı ve gerekirse ikinci dil (veri modülleri dil anahtarlı hâle getirilebilir).
