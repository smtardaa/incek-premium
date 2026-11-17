# Görsel kaynakları

Kontrol tarihi: 17.11.2026. Ayrıntılı kayıt ve kaynak URL'leri: `src/data/assets.js` (her görselin
`origin`, `sourceUrl`, `note` alanları). Sitede hotlink yoktur; tüm görseller `public/img/` altında
yerel WebP kopyalarıdır.

## Türler

| Tür | Açıklama | Sayı |
|---|---|---|
| **Kullanıcı** | `İncek Premium.jpg` — ana dış cephe. Resmî galerideki `assets/images/gallery/1.jpg` ile bayt bayt aynı. Kat seçimi ve açılış bu görsel üzerinde. | 1 |
| **Resmî** | incekpremium.com galerisi, ana sayfa ve “Ayrıcalıklar” sayfasından indirilen renderlar ve hizmet görselleri. Orijinalleri `kaynak-gorseller/resmi-galeri/`. | 44 |
| **Türetilmiş** | Salon dekorasyon katmanları (`public/img/dekor/`): resmî salon render'ı üzerinde yalnızca perde/koltuk yüzeyinin maskeyle yeniden renklendirilmesi. Yeni nesne veya model üretilmemiştir. | 6 |
| **Yapay zekâ üretimi** | **Yok.** Bu ortamda görsel üretim aracı bulunmadığı için üretilmiş görsel kullanılmadı. | 0 |

Resmî sitedeki fiyat/peşinat/vade/altın kampanyası içeren görseller (`slider-1`, `slider-1m`,
`incek-premium-1080x1080`, `incek-premium-1600x900-1`) bilinçli olarak alınmadı.

## Oda / tip eşlemesi (içeriğe bakılarak yapıldı, dosya adına göre değil)

| Sahne | A · açık mutfak | B · kapalı mutfak |
|---|---|---|
| Salon (dekorlu açı) | `a-tipi-salon-1` | `b-tipi-salon-2` |
| Salon (diğer açılar) | `a-tipi-salon-3` (yemek), `a-tipi-acik-mutfak06` (TV) | `b-tipi-salon-1` (TV) |
| Mutfak | `a-tipi-mutfak-2`, `a-tipi-salon-2` (salondan mutfağa), `a-tipi-acik-mutfak01` (detay) | `b-tipi-mutfak` |
| Ebeveyn odası | `a-tipi-acik-mutfak07` | **Ortak:** aynı görsel (B için ayrı yatak odası görseli yok) |
| İkinci oda | `a-tipi-acik-mutfak11`, `a-tipi-acik-mutfak10` | **Ortak:** `a-tipi-acik-mutfak11` (= resmî `b-tipi-kapali-mutfak09`) |
| Banyo | `banyo-2`, `a-tipi-acik-mutfak08` | **Ortak:** aynı görseller (resmî kaynakta tip ayrımı yok) |

Ortak görsel kullanılan odalarda sitede küçük bir not gösterilir.

**Dosya adı yanıltıcı olanlar:** resmî galerideki `b-tipi-kapali-mutfak01…08` dış mekân/peyzaj,
otopark ve “Gym Center” görselleridir; sitede peyzaj/sosyal alan olarak kullanıldı. `vaziyet-plani`
bir yerleşim görselidir, kat planı değildir. `a-tipi-acik-mutfak03…13` mutfak değil salon,
yatak odası, banyo ve hol görselleridir.

## Sosyal olanak sahneleri

Otopark: resmî otopark + teras render'ı ve vale hizmet görseli. Spor: “Gym Center” yapısı dış
cephede işaretli; fitness, yoga-pilates, kapalı havuz, hamam-sauna için resmî “Ayrıcalıklar”
görselleri (fotoğraf benzeri **temsilî** görseller; projenin kendi iç mekânı olduğu doğrulanmadı,
sitede “temsilî” olarak belirtildi). Giriş: resmî giriş kapısı render'ı + resepsiyon, konsiyerj,
kartlı geçiş görselleri. Teras: resmî peyzaj renderları.

## Dekorasyon katmanları — yöntem ve sınırlar

- Kaynak: aynı resmî salon render'ı, aynı çözünürlük (1600×900), aynı kamera ve ışık.
- Perde ve koltuk için elle çizilmiş çokgen maskeler (`src/data/decor-masks.js`); önde kalan
  nesneler (bitki yaprakları, şal, yastıklar, B tipinde masa/sandalye/sehpa) maskeden çıkarıldı.
- Piksel parlaklığı korunarak hedef renge taşındı (kıvrım ve gölgeler kalır), tam kare şeffaf
  WebP olarak kaydedildi. Bütün sahneye renk filtresi uygulanmadı.
- 3 perde × 2 koltuk = 6 kombinasyonun tamamı iki tipte de görüntülenebilir.
- **Sınır:** “Mobilya alternatifi” bu sürümde aynı koltuğun **kumaş/renk** alternatifidir
  (krem ↔ taş grisi). Farklı model koltuk için aynı kameradan, temiz arka planlı ve gölgeli yeni
  render gerekir.

## Eksik / gelecekte gereken görseller

| İhtiyaç | Neden |
|---|---|
| B tipi (kapalı mutfak) ebeveyn odası, ikinci oda ve banyo renderları | Şu an A tipinin görselleri ortak örnek olarak gösteriliyor. |
| Salon için farklı model koltuk varyantı (aynı kamera, aynı ışık, temiz arka plan + gölge katmanı) | Gerçek “mobilya modeli” alternatifi için. |
| Diğer odalar için dekor varyantları (yatak odası tekstili vb.) | Bu sürümde dekorasyon yalnızca salonda. |
| Doğrulanmış mimari kat planları (iki tip) | Şu an “temsili oda şeması” gösteriliyor. |
| Projeye ait fitness, havuz, hamam, lobi iç mekân renderları | Şu an resmî sitedeki temsilî hizmet fotoğrafları kullanılıyor. |
| Daha yüksek çözünürlüklü ana dış cephe (≥ 3840 px) | Kata yakınlaşma 2,5× ile sınırlandı; daha yakın kadraj için gerekli. |
| Dış cephe ile eşleşen pencere/kat yakın plan görseli | Yakınlaşmadan iç mekâna geçişte ara kare olarak. |
