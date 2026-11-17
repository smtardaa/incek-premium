# Test raporu — 17.11.2026

Ortam: Windows 11, Node 26.13.0 / npm 11.20.0, Astro 5.18.2. Tarayıcı testleri Claude masaüstü
uygulamasının **yerleşik Chromium tabanlı tarayıcısında** yapıldı; ekran boyutları emülasyondur.
**Gerçek cihaz testi yapılmadı** (aşağıya bakın).

## 1. Kurulum, derleme, önizleme

| Kontrol | Sonuç |
|---|---|
| `node_modules`, `dist` silinip `npm ci` | ✅ (npm 11 kurulum betiği uyarıları; esbuild/sharp çalışıyor) |
| `npm test` | ✅ 22/22 |
| `npm run build` | ✅ 3 sayfa (`/`, `/bilgiler/`, `/404.html`), hata/uyarı yok |
| `npm run check:links` (kök `/`) | ✅ 182 yerel yol, kırık yok, tüm sayfalarda noindex |
| Alt yol derlemesi `BASE_PATH=/incek-premium/` + denetim | ✅ 182 yerel yol, kırık yok |
| `npm run preview` ile yerel önizleme | ✅ |

## 2. Ana akış (masaüstü 1440×900)

Açılış → “Projeyi keşfet” → dış cephe → kat (18) seçimi → “Daireyi keşfet” (kata yakınlaşma, iç
mekâna geçiş) → beş oda → dekorasyon → sosyal sahne → “Tüm bilgileri incele” → “Görsel keşfe
dön” zinciri tıklanarak ve ekran görüntüsüyle kontrol edildi. ✅

- Kat çokgenleri tam çözünürlükte görselin üzerine çizilerek doğrulandı (`scripts/overlay-exterior.mjs`): sağ cephedeki 28 bant pencere sıralarına oturuyor; sol cephe yaklaşık; siluet dışına taşma kırpılıyor. Lobi ve “Gym Center” çokgenleri ayrı tutuldu.
- Geçiş sırasında alınan karede kamera seçili kata (altın vurgulu bant) yakınlaşıyor, ardından salon açılıyor.

## 3. Oda eşlemeleri ve dekorasyon

- İki tip × beş oda × tüm açılar (18 görünüm) program ile gezildi: her birinde doğru görsel tam çözünürlükte yüklendi, URL (`?s=daire&kat=…&tip=…&oda=…&aci=…`) eşleşti, bilgi noktaları oluştu. ✅
- A tipi: 6 kombinasyonun her biri için ekrandaki katmanlar doğrulandı:
  `keten+krem → Sıcak (katman yok)`, `keten+taş → Özel`, `adaçayı+krem → Doğal`, `adaçayı+taş → Özel`, `antrasit+krem → Özel`, `antrasit+taş → Modern`. Varsayılana dön → Sıcak, düğme pasif. ✅
- B tipi: Doğal paketinden sonra koltuk elle değiştirilince “Özel” görünüyor; katmanlar görsel olarak kontrol edildi. A ve B tercihleri ayrı saklanıyor. ✅
- Bozuk/erişilemeyen depolama ve geçersiz kayıt birim testlerinde kontrol edildi. ✅

## 4. WhatsApp (gerçek mesaj gönderilmedi)

- Hedef: `https://wa.me/905424921571?text=…` ✅
- “Çağrı Öztürk”, “İkinci oda… soracağım” gibi Türkçe metin ve satır sonları kayıpsız kodlanıyor (`%0A`, `%C4%9F` …); çözülen metin oluşturulan mesajla birebir aynı. ✅
- Geçmiş tarih (`2026-11-10`): “Geçmiş bir tarih seçilemez.” ve gönderme düğmesi pasif. `min` = bugün. ✅
- Keşif bağlamı (12. kat · örnek keşif seçimi, Kapalı yüzme havuzu) mesaja ekleniyor; daire numarası yok. ✅
- Gönderimden sonra yalnızca “mesajı WhatsApp'ta göndermeniz gerekir” bilgisi; onay mesajı yok. Kapatınca odak açan düğmeye dönüyor. ✅
- Telefon (`tel:4447262`) ve e-posta (`mailto:`) bağlantıları mevcut. ✅

## 5. Ekranlar, yön, hızlı tıklama, geçmiş, hareket azaltma

| Kontrol | Sonuç |
|---|---|
| Dar telefon 375×812 (emülasyon): açılış, kat seçimi, iç mekân, dekorasyon alt paneli | ✅ (Vertisa satırı taşması düzeltildi; dekorasyon modunda işaretler gizleniyor) |
| Yatay telefon 812×375: dikeyden yataya döndürme sırasında dekorasyon açık | ✅ (ilk denemede görsel alanı sıfıra iniyordu → yerleşim panel konumuna göre hesaplanacak şekilde düzeltildi) |
| Tablet 768×1024 | ✅ (kat paneli binayı örtüyordu → dikey tablette alta alındı) |
| `/bilgiler/` mobil: yatay taşma yok, sabit randevu düğmesi | ✅ |
| Hızlı ardışık 4 oda isteği | ✅ tek görünür tampon, son hedef uygulanıyor, kalan animasyon yok |
| Kat okuna 12 hızlı tıklama | ⚠️→✅ ilk sürümde birikmiyordu; düzeltildi |
| Tarayıcı geri/ileri | ✅ önceki odaya / ileri doğru; kat değişimi geçmişi şişirmiyor (replace) |
| Uygulama içi “Bina” | ✅ seçili kat ve tip korunarak dış cepheye dönüyor |
| Escape | ✅ önce paneli, sonra yakınlaşmayı kapatıyor |
| Reduced motion (MediaQueryList.matches simülasyonu) | ✅ kamera hareketi yok, yalnızca 150–180 ms opaklık geçişi |
| Gizli sahnelerin sekme sırasına sızması | ✅ yok (dış cephede 16, iç mekânda 19 odaklanabilir öğe; hepsi görünür sahnede) |

## 6. Performans

Yerleşik tarayıcı paneli görünürken (rAF 16,7 ms) `requestAnimationFrame` kare süreleri ve
`longtask` gözlemcisiyle ölçüldü. Yerel sunucu, masaüstü bilgisayar; ağ gecikmesi yok.

| Geçiş | Süre | Ort. kare | En kötü kare | >33 ms kare | Uzun görev |
|---|---|---|---|---|---|
| Dış cephe → kata yakınlaşma → salon | 1950 ms | 16,7 ms | 17,0 ms | 0 | yok |
| Oda değişimi (önbellekte olmayan görsel) | 803 ms | 16,7 ms | 17,0 ms | 0 | yok |
| Salon → dış cephe (uzaklaşma) | 1284 ms | 16,7 ms | 17,0 ms | 0 | yok |
| Dış cephe → sosyal alan | 1802 ms | 16,7 ms | 17,3 ms | 0 | yok |
| Sosyal alan içi geçiş | 802 ms | 16,7 ms | 17,0 ms | 0 | yok |
| Boşta 1,5 sn | — | — | — | — | rAF çağrısı 0, çalışan animasyon 0 |

- İlk açılışta yüklenen: HTML, ~10 KB (gzip) keşif JS'i, CSS, fontlar (latin + latin-ext), logolar ve dış cephe (1920 px WebP, 253 KB). İç mekân görselleri yalnızca kat seçilince (önden) veya sahne açılırken; dekor katmanları yalnızca seçilince yüklenir.
- Not: Panel gizliyken yapılan ilk ölçümlerde rAF ~217 ms'ye düşüyordu (arka plan sayfası kısıtlaması); bu değerler rapora alınmadı.
- Bu sonuçlar **tek bir masaüstü ortamında** alınmıştır; “her cihazda 60 fps” iddiası değildir.

## 7. Kök ve alt yol

`dist-sub` (`/incek-premium/`) GitHub Pages benzeri yerel sunucuda (`scripts/serve-pages.mjs`):
`/incek-premium/bilgiler` → `/bilgiler/` yönlendirmesi, doğrudan açma/yenileme, fontlar, tüm
görseller, keşif derin bağlantısı (`?s=daire&kat=22&tip=kapali&oda=mutfak`), dekor katmanları ve
404 sayfası çalıştı; 4xx kaynak hatası yok. Konsolda hata yok. ✅

## Doğrulanamayanlar

- **iPhone / Safari (iOS ve macOS)**: erişim yok, test edilmedi. `inert`, `<dialog>`, `:has()` ve Web Animations kullanıldı; güncel Safari sürümleri bunları destekler ancak gerçek cihazda doğrulanmadı.
- **Android cihazlar, Firefox**: test edilmedi.
- **Gerçek dokunmatik hareketler** (sürükleyerek kaydırma, iki parmak yakınlaştırma): yalnızca fare/emülasyon ile denendi.
- **Yavaş ağ**: görsel önce yüklenip sonra sahne değiştirilecek, zaman aşımında (15 sn) mevcut sahne korunup bildirim gösterilecek şekilde kodlandı ve birim testiyle (geçiş hatası) doğrulandı; gerçek ağ kısıtlamasıyla tarayıcıda denenmedi.
- **Ekran okuyucu** ile uçtan uca deneme yapılmadı (yapı ve etiketler kod düzeyinde kontrol edildi).
- GitHub Actions iş akışı çalıştırılmadı (depoya push yapılmadı); adımları yerelde aynı sırayla başarıyla çalıştı.
