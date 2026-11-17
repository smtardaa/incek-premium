# CLAUDE — İncek Premium etkileşimli web sitesi / açık beta

Bu çalışma klasöründe, gerçek İncek Premium projesini tanıtan, müşteriye gösterilebilecek bilgi ve işlev bakımından dolu bir açık beta web sitesi geliştir. Sadece öneri veya tasarım planı üretme: aşağıdaki kapsamı çalışan dosyalara dönüştür, derle, tarayıcıda kontrol et ve teslim et. Hedef kusursuz nihai ürün değil; ana deneyimlerin gerçekten çalıştığı, görsel olarak özenli ve geliştirilebilir bir sürüm.

## 1. Önce kaynakları incele

Çalışma klasörü: C:/Users/foren/Desktop/Plaza web

- kule-demo.html: önceki kat seçimi ve sahne geçişi prototipi. Etkileşim fikri referanstır; eski marka, kat koordinatları, daire türleri ve performans sorunları taşınmayacak.
- WhatsApp Video 2026-11-17 at 21.23.08.mp4: dış cepheden seçilen kata yaklaşma ve iç mekân keşfi için hareket referansı. Videoyu doğrudan site arka planı yapma.
- İncek Premium.jpg: kullanıcının verdiği asıl dış cephe görseli. Ana keşif sahnesini bu gerçek proje görseline göre kur.
- incek-premium-assets/brand/incek-premium-logo.png
- incek-premium-assets/brand/vertisa-logo.png
- incek-premium-assets/brand/favicon.png
- incek-premium-assets/brand/brand-colors.css
- incek-premium-assets/reference/: resmî görsel örnekleri.
- incek-premium-assets/asset-sources.json: dosyaların kaynakları.
- incek-premium-assets/MARKA-VE-KAYNAKLAR.md: önceki araştırma notları. Bu nottaki “açık kararlar” ve “prompt henüz hazırlanmayacak” kayıtları eski görüşme durumudur; bu prompttaki kararlar geçerlidir.

Özgün kullanıcı dosyalarını koru. Yeniden kullanılacak görsellerin optimize edilmiş kopyalarını uygun proje dizinlerine al. Mevcut dosyaları körlemesine silme. Varsa yerel proje talimatlarını oku.

Resmî kaynaklar:
https://incekpremium.com/
https://incekpremium.com/proje-hakkinda
https://incekpremium.com/ayricaliklar
https://incekpremium.com/galeri
https://incekpremium.com/iletisim

## 2. Teknoloji ve sınırlar

- Astro + HTML + CSS + JavaScript kullan.
- Statik çıktı üret. Backend, veritabanı, sunucu tarafı oturum, API anahtarı veya sürekli çalışan Node.js sunucusu gerektirme.
- Node.js yalnızca yerel geliştirme/derleme ve CI için kullanılabilir.
- React, Vue, Three.js, WebGL veya 3D oyun motoru ekleme. Gerçek 3D ve serbest 360° gezinme kapsam dışıdır.
- Etkileşimlerde öncelikle CSS ve native JavaScript / Web Animations API kullan; bu iş için ağır animasyon kütüphaneleri ekleme.
- GitHub Pages üzerinde yayımlanmaya hazır yapı kur. Hem kök alan adı hem repository alt yolu için asset ve bağlantıları doğru çöz; site/base ayarlarını tek yerde belgele. Derlenmiş alt sayfalar doğrudan açıldığında ve yenilendiğinde çalışsın.
- GitHub Actions yayın iş akışını hazırla; kullanıcı hesabına push veya yayın işlemini kendiliğinden yapma.
- İlk sürümü Türkçe hazırla. Metin/veri yapısını gelecekte ek dil ve backend eklenmesine uygun tut; bunları şimdi geliştirme.
- Hiçbir yerde fiyat, ödeme veya satış işlemi bulunmayacak.
- Mevcut sitenin tasarımını bütünüyle kopyalamak yerine onun marka kimliğini, doğru bilgilerini ve uygun görsellerini kullan.

## 3. Doğru proje bilgileri

17.11.2026 tarihinde resmî sitede kontrol edilen bilgiler:
- İncek Premium / Vertisa.
- 1 blok, 30 kat, toplam 300 konut.
- 42.000 m² proje alanı.
- Açık mutfaklı ve kapalı mutfaklı iki 2+1 daire tipi.
- Sitede belirtilen başlangıç 01.03.2025; teslim tarihi 30.06.2027. Teslimi kesinleşmiş olay gibi yazma; projenin duyurduğu takvim olarak sun.
- Konum: Taşpınar Mahallesi 2803 Sokak No:14 İncek/ANKARA.
- Telefon: 444 72 62.
- WhatsApp: +90 542 492 15 71.
- E-posta: info@incekpremium.com.

İnşa süren bir proje için hizmetleri bugünden faaliyetteymiş gibi anlatma; projede sunulması planlanan olanaklar olarak doğru bağlamda yaz.

Gerçek kat başına daire dağılımı, daire numaraları, kesin cephe eşleşmeleri, daire metrekareleri ve mimari kat planları bu aşamada doğrulanmadı. Bunları üretip resmî bilgi gibi sunma. 300/30 hesabından her katta 10 daire sonucu çıkarma. Eski demodaki 25 kat, 3+1, 4+1 ve penthouse bilgilerini kullanma. Kat seçimi sonrası açık/kapalı mutfaklı ÖRNEK daire keşfi sun; bu katın kesin envanteri iddiası yaratma.

## 4. Görsel dil

Kaynak CSS değerleri:
- Ana yeşil: #0B533D
- Koyu yeşil: #0A4634
- Çok koyu yeşil: #062F22
- Yeşil etkileşim tonu: #19775A
- Altın: #997536
- Krem: #F7F5EF
- Başlık koyusu: #1C1C25
- Beyaz: #FFFFFF
- Kaynak font aileleri: Cal Sans ve Plus Jakarta Sans.

Özgün logoların oranlarını ve renklerini koru. Beyaz/yeşil/krem alanlar arasında dengeli, mimari görselleri öne çıkaran, temiz bir düzen tasarla. Altını seçili kat, ince vurgu ve kontrollü etkileşimlerde kullan. Metin kontrastını ayrıca kontrol et; kaynak renklerin her eşleşmesini otomatik olarak erişilebilir sayma.

Büyük görseller, okunur tipografi, yeterli boşluk ve sade kontroller kullan. Yoğun cam efekti, aşırı parlama, sürekli hareket, gereksiz dönen nesneler, özel imleç ve kaydırmayı ele geçiren efektler ekleme. Logo ve büyük binanın bulunduğu ekranı kalabalık kartlarla örtme.

## 5. Kullanıcının kesinleştirdiği giriş ve gezinme

Ana akış:
Açılış ekranı → “Projeyi keşfet” → dış cephe / kat seçimi → örnek daire tipi → oda keşfi.

- Site ilk açıldığında marka, güçlü bina görseli ve belirgin “Projeyi keşfet” düğmesi görünür.
- Düğmeye basınca kısa, kontrollü bir geçişle dış cephe keşif sahnesi açılır.
- Katlar ve bina üzerindeki ilgili alanlar bu sahnede keşfedilir.
- Görsel deneyimin alt orta bölümünde “Tüm bilgileri incele” düğmesi bulunur. Mobilde güvenli alanları ve alttaki kontrolleri gözet; düğme sahne/kart altında kaybolmasın.
- Bu düğme, projenin yazıyla ve normal sayfa kaydırmasıyla anlatıldığı /bilgiler/ bölümüne götürür. Kullanıcı bu bölüme geçince klasik, rahat okunur bir site deneyimi yaşar.
- Yazılı bölümden “Görsel keşfe dön” ile keşfe dönülebilir. Mümkün olduğunda seçilen kat, daire tipi ve dekorasyon korunur.
- Kullanıcı yazılı bilgilere erişmek için bütün turu tamamlamak zorunda kalmaz. Açılışta da daha geri planda bir metin bağlantısı bulunabilir; ana çağrı “Projeyi keşfet” olarak kalır.
- Tarayıcının geri/ileri davranışını ve sahne içi geri düğmelerini tutarlı kıl. Geri düğmesi kullanıcıyı beklenmedik biçimde başlangıca atmasın.

## 6. Dış cephe ve kat seçimi

- Kullanıcının verdiği binanın perspektifine oturan SVG/polygon alanları kullan.
- Koordinatlar görselin doğal boyutlarına veya normalize koordinatlara bağlı olsun; ekran piksellerine sabitlenmesin.
- Görsel object-fit, ölçek, kırpma ve kamera transformları ile tıklama alanları aynı koordinat sistemini kullansın.
- Eski demodaki eşit aralıklı 25 kat formülünü kopyalama. Yeni görselde taban, otopark, sosyal alan, konut katları ve çatı ayrımını görsel olarak incele.
- Resmî mimari numaralandırma bulunamazsa seçimi “temsili kat eşleştirmesi” olarak belirt. Otoparkı veya çatı kaplamasını konut katı gibi etiketleme.
- Masaüstünde hover ile nazik kat vurgusu ve tıklayarak seçim; mobilde dokunarak seçim ve açık bir “Daireyi keşfet” düğmesi sun.
- Alternatif erişim olarak klavyeyle kullanılabilen kat listesi/seçici de bulunsun.
- Kat seçilince kat numarası ve iki örnek 2+1 tip gösterilir: açık mutfaklı ve kapalı mutfaklı.
- Seçilen katın penceresine doğru kontrollü yakınlaşma, ardından iç mekân sahnesine yumuşak geçiş yap. Büyük blur ve aşırı zoom ile düşük çözünürlük kusurlarını örtmeye çalışma.
- Kat değişince iç mekânın örnek niteliği korunur; her kat için farklı gerçek manzara veya kesin daire envanteri varmış izlenimi oluşturma.

## 7. İç mekân keşfi — ilk betada tam kapsam

Her iki örnek daire tipi için:
1. Salon.
2. Mutfak; açık ve kapalı mutfak farkı içerikte ve sahnede anlaşılır olsun.
3. Ebeveyn odası.
4. İkinci oda.
5. Banyo.

İkinci odanın kullanımı ayrıca seçilmedi. Makul başlangıç olarak çok amaçlı / çalışma odası düzenle; bunu “İkinci oda” olarak adlandır, resmî yerleşim iddiası yaratma.

Sabit kamera açılarından oluşan, görsellerle çalışan bir sahne sistemi kur:
- Oda menüsü ve uygun tıklanabilir noktalar ile geçiş.
- Görsel içinde sınırlı pan/zoom ve gerekirse hafif katman hareketi.
- Gerçekçi konumlandırılmış bilgi noktaları; noktalar ekran değişiminde hedefinden kopmasın.
- Salon içindeki ayrıntıya yaklaşma ve tekrar oda geneline dönme.
- Kullanıcıya daire tipi, oda adı ve geri yönü anlaşılır biçimde gösterilsin.
- Keskin perspektif farkı olan iki görsel arasında kesintisiz fiziksel yürüyüş varmış gibi sahte geometri üretme; uygun fade/cut/zoom geçişi tasarla.
- Küçük ekranda oda menüsü, dekorasyon ve açıklama panelleri görüntüyü aynı anda kapatmasın.

## 8. Dekorasyon: hazır paket + elle ayarlama

İlk betada salonda çalışan dekorasyon özelliği zorunlu. Diğer odalar da keşfedilebilir olacak; bu aşamada hepsine dekorasyon editörü eklemek gerekmiyor.

- “Sıcak”, “Modern”, “Doğal” hazır paketlerini sun.
- Ayrıca kullanıcı perde rengini ve mobilya alternatifini birbirinden bağımsız seçebilsin.
- Başlangıç kapsamı: 3 perde rengi ve 2 mobilya alternatifi; 6 geçerli kombinasyonun tamamı gerçekten görüntülenebilsin.
- Paket, bu seçeneklerin önceden tanımlanmış kombinasyonudur. Paket seçimi kontrolleri günceller; elle değişiklik yapıldığında mevcut kombinasyon bir paketle eşleşmiyorsa “Özel” görünür.
- Paket ve manuel seçim aynı durum modelini kullanır; birbiriyle çelişmez.
- “Varsayılana dön” kontrolü bulunur.
- Seçimler tip bazında korunur. Depolama kullanılıyorsa erişim hatasında deneyim bozulmasın; kişisel veri saklama.
- Dekorasyon “örnek dekorasyon / konsept seçenek” olarak tanımlanır; firmanın gerçek satış paketi veya teslim taahhüdü olarak sunulmaz.

Görsel yöntem:
Aynı oda, aynı çözünürlük, aynı kamera, aynı pencere/duvar konumları ve aynı ışık düzeni korunarak alternatif görseller veya doğru hazırlanmış şeffaf nesne katmanları oluştur. Bütün sahneye hue-rotate uygulayıp perde değişmiş gibi yapma. Yeni koltuğu eski koltuğun üstüne yapıştırıp iki mobilyayı birlikte bırakma; gerekiyorsa temiz arka plan ve doğru gölge katmanı hazırla.

## 9. Görsel üretimi ve kaynak doğruluğu

- Yerel dış cepheyi ve resmî logoları esas al.
- Resmî galeride mevcut iç mekân görsellerini incele; uygun olanları temel/referans olarak kullan.
- İncek Premium'un görsel kimliğine uyumlu eksik oda sahnelerini ve dekorasyon alternatiflerini, erişebildiğin görsel üretim/düzenleme araçlarıyla hazırla. Üretimleri gerçek proje görseli diye tanıtma.
- Kaynak adıyla görsel içeriğini karıştırma: reference/b-tipi-kapali-mutfak01.jpg aslında peyzaj gösteriyor. reference/vaziyet-plani.webp bir yerleşim görselidir, mimari kat planı değildir.
- Kat planı bölümünü oluştur. Doğrulanmış plan bulursan kaynakla kullan. Bulamazsan “Temsili oda şeması — mimari kat planı değildir” açıklamalı, oda seçimine yardımcı bir şema sun; uydurma ölçü/alan verme.
- Görsel üretim aracın yoksa varmış gibi davranma. Mevcut uygun görsellerle tamamlayabildiğin akışları kur; eksik özgün görselleri ve gereken açı/varyantları açıkça belgeleyip teslimde belirt. Görsel değişmeyen düğmeyi tamamlanmış dekorasyon özelliği diye sunma.
- Her asset için kaynak/üretim türü, oda/tip ve varyant eşlemesini kaydet.
- Dış siteden hotlink kullanma. Kullanılan görselleri yerel optimize edilmiş dosyalar olarak sun.
- Başlangıçta bütün odaları ve 6 dekorasyon kombinasyonunu indirme. İlk sahne, bir sonraki muhtemel sahne ve seçilen varyantları kontrollü yükle.

## 10. Sosyal olanaklar — ayrı sahneler

Bina keşfindeki ilgili noktalara basınca iç mekân turuna benzer ayrı bir görsel sahne aç. Bu sahnenin üzerinde okunur bilgi kartları bulunur; basit toast ile geçiştirme.

Örnekler:
- Otopark → otopark/vale sahnesi ve vale hizmeti kartı.
- Sosyal yaşam/spor alanları → fitness, yoga-pilates, kapalı havuz, hamam ve sauna sahneleri veya uygun alt sahne seçimi.
- Giriş/lobi → resepsiyon, konsiyerj ve kartlı geçiş bilgileri.
- Peyzaj/ortak alan → ilgili olanaklar.

Resmî sitede yer alan çocuk bakım, yemek servisi, bahçe bakım ve akıllı ev gibi diğer olanaklar yazılı bölümde ve uygun bilgi kartlarında anlatılsın. Her hizmet için dış cephede ayrı bir fiziksel konum icat etme. Bina üzerindeki konumu doğrulanmayan hizmetleri “Sosyal olanaklar” gibi genel bir erişim noktasından aç.

Sahne kartları:
- Başlık, kısa ve anlamlı açıklama, uygun görsel.
- Gerekli olduğunda ilgili olanaklar arasında geçiş.
- “Randevu talep et” ve “Binaya dön”.
- Ücret, çalışma saati, kapasite veya garantili hizmet seviyesi gibi doğrulanmayan bilgileri ekleme.

## 11. Yazılı bilgi bölümü

/Tüm bilgileri incele/ erişiminin hedefi olan /bilgiler/ sayfasında, gerekirse ilgili statik alt sayfalara ayrılarak:
- Proje hakkında.
- Açık ve kapalı mutfaklı daire tipleri.
- Kat planları / temsili oda şemaları.
- Sosyal olanaklar.
- Galeri: dış cephe, iç mekân ve sosyal alan filtreleri; çalışan lightbox.
- Konum: doğrulanmış adres, ulaşılabilir harita bağlantısı; uydurma mesafe veya yolculuk süresi yok.
- İletişim ve WhatsApp randevu talebi.
- Görsel keşfe dönüş.

Yazılı bölüm normal kaydırılabilsin; keşif sahnesinin overflow:hidden ayarı bu sayfayı kilitlemesin. Başlık hiyerarşisi, bağlantılar ve temel proje bilgileri JavaScript olmadan da okunabilir olsun. Siteye dağılmış boş, “yakında” kartlarıyla içerik varmış izlenimi oluşturma.

## 12. Çalışan WhatsApp randevu akışı

Resmî bağlantı: https://wa.me/905424921571

Bir randevu talep panelinde:
- İsteğe bağlı ad.
- Tercih edilen ziyaret tarihi ve saat aralığı.
- İsteğe bağlı kısa not.
- Varsa seçilmiş kat, örnek daire tipi ve ilgilenilen sosyal alan bağlamı.

“WhatsApp üzerinden talep gönder” düğmesi, bu alanlardan oluşturulan metni encodeURIComponent ile kodlayarak WhatsApp bağlantısını açsın. Bu işlem mesajı otomatik göndermez; kullanıcı WhatsApp'ta gönderir. Kullanıcı mesajı kendisi göndermeden “Talebiniz alındı” veya “Randevunuz onaylandı” gösterme.

Tarih/saat bir müsaitlik takvimi değildir; tercih bilgisidir. Geçmiş tarih seçimini kontrol et. Mesajda katın örnek keşif seçimi olduğu anlaşılsın; hayalî daire numarası eklenmesin. Sunum testi için gerçek mesaj gönderme; bağlantı hedefini ve metin kodlamasını doğrula. Mobil WhatsApp ve masaüstü WhatsApp Web akışına uygun normal bağlantı kullan. Telefon/e-posta bağlantıları da çalışsın.

## 13. Animasyon ve performans — öncelikli kabul şartı

Kullanıcı özellikle akıcı, az sayıda ama iyi uygulanmış animasyon istiyor. Büyük kapsamı sürekli efekt üretmek olarak yorumlama.

Hareketi şu noktalarda yoğunlaştır:
- Açılıştan dış cepheye geçiş.
- Kat seçiminin görsel vurgusu.
- Seçilen kata yaklaşma ve iç mekâna geçiş.
- Oda / sosyal sahne değişimi.
- Dekorasyon varyantının kısa geçişi.
- Panel açılışı/kapanışı.

Uygulama ilkeleri:
- Genellikle transform ve opacity kullan; animasyon boyunca sürekli layout hesaplatma.
- Büyük resimlerde animasyonlu blur, çok katmanlı drop-shadow, yaygın backdrop-filter ve dev GPU katmanlarından kaçın.
- Sahne hareketsizken sürekli requestAnimationFrame döngüsü çalışmasın. Gizli sahneleri her karede güncelleme.
- requestAnimationFrame gerekiyorsa yalnızca hareket süresince çalıştır; bitince/sekme gizlenince durdur.
- Mobilde mouse parallax yok; masaüstünde varsa çok hafif, isteğe bağlı ve durabilir olsun.
- prefers-reduced-motion için geçişleri kaldır veya basit kısa fade'e indir; içerik ve düğmeler aynen kullanılabilir kalsın.
- Yeni sahnenin görselini yükle/decode etmeden eskisini kaldırma. Yavaş ağda mevcut sahne korunmalı; başarısız asset yüklemesi sonsuz spinner veya boş ekran üretmemeli.
- Üst üste tıklama, hızlı kat değişimi, ileri/geri, ekran döndürme ve resize sırasında geçişler çakışmasın. Tek geçiş yöneticisi, iptal/temizleme ve tutarlı state kullan.
- Görseller ve hotspot katmanı aynı transformu paylaşsın.
- will-change yalnızca gerektiğinde ve sınırlı elemanda kullanılsın; sahnelerden çıkınca gereksiz katmanları bırakma.
- Düğmeler küçük ekranlarda rahat dokunulabilir olsun; kritik kontroller hover'a bağımlı kalmasın.
- Uzun bir zorunlu sinematik veya bütün sayfayı bekleten yükleme ekranı kurma.
- Hedef, yaygın güncel cihazlarda akıcı ve mümkün olduğunca 60 fps'ye yakın ana geçişlerdir. Bunu ölçmeden “her cihazda kusursuz 60 fps” diye raporlama.
- Desteklenmeyen efektlerde sade görünüm ve çalışan gezinme devam etsin.

## 14. Yapı, erişilebilirlik ve gelecekte geliştirme

- Proje bilgileri, kat eşlemesi, daire tipleri, odalar, hotspotlar, hizmetler ve dekorasyon kombinasyonlarını düzenlenebilir veri dosyalarında tut.
- Sahne durumları açık olsun: intro, exterior, apartment-type, room, amenity, information gibi. Geçişin yüklenme ve hata durumlarını da düşün.
- CSS/JS/görselleri tek dev HTML ve base64 içine gömme.
- Her bileşenin sorumluluğu anlaşılır olsun; ileride backend eklenebilmesi için veri ile görüntüleme katmanını ayır, şimdiden gereksiz servis mimarisi kurma.
- Klavye erişimi, görünür focus, anlamlı button/link kullanımı, modal focus yönetimi, Escape ile kapatma ve geri dönüş focus'u sağla.
- Gizli sahneler tab sırasına ve ekran okuyucu akışına sızmasın.
- Font yüklemesi metni uzun süre görünmez yapmasın.
- Beta/konsept bilgisi gerekli yerlerde küçük ve anlaşılır olsun; görseli kaplayan uyarı duvarı oluşturma.
- Müşteri gösterimi sürümünde robots meta ile noindex kullan; bunun erişim kontrolü olmadığını README'de belirt. Nihai yayında değiştirilmesini belgele.

## 15. Doğrulama ve teslim

Önce kaynakları incele ve kısa uygulama sırasını belirt; ardından geliştirmeye devam et. Bu promptta kararlaştırılan şeyleri tekrar sorma. Düşük etkili detaylarda makul karar ver. Gerçekten zorunlu eksik veri varsa tahmini gerçekmiş gibi yazmadan açıkça ayır.

Tamamlanınca:
1. Temiz kurulum, derleme ve yerel önizlemeyi doğrula.
2. Açılış → dış cephe → kat → daire tipi → beş oda → dekorasyon → sosyal sahne → yazılı bilgiler → keşfe dönüş zincirini kontrol et.
3. İki daire tipi için oda eşlemelerini; üç paket, manuel kontroller ve altı dekorasyon kombinasyonunu kontrol et.
4. WhatsApp hedefini, Türkçe karakterleri ve satır sonlarını gerçek mesaj göndermeden kontrol et.
5. Masaüstü, dar telefon ve tablet düzenlerini; yatay/dikey değişimi, hızlı tıklamayı, geri/ileri davranışını ve reduced-motion ayarını kontrol et.
6. En az bir ana geçişi tarayıcı performans kaydıyla incele; belirgin uzun görevleri, sürekli boşta render ve görsel yükleme takılmalarını düzelt.
7. Kök URL ile repository alt yolunu ve alt sayfa yenilemesini kontrol et. Kırık görsel, bağlantı, console hatası ve taşma bırakma.
8. Yapabildiğin tarayıcı/cihaz testlerini gerçekten çalıştır. Emülasyonu gerçek cihaz testi gibi raporlama. Erişimin olmayan Safari/iOS/Android testlerini yapılmış sayma.
9. Durum/geçiş yönetimi, paket-manuel seçim eşleşmesi ve URL oluşturma gibi hata riski olan mantık için anlamlı kontroller ekle; sadece uygulamayı tekrar eden gereksiz testler üretme.

Teslim dosyaları:
- Çalışan Astro projesi.
- README.md: kurulum, geliştirme, build, preview, GitHub Pages site/base ve yayın adımları.
- ilerleme.md: tamamlananlar, açık kalanlar, kullanılan varsayımlar ve sonraki adımlar.
- GORSEL-KAYNAKLAR.md: resmî/üretilmiş/temsili görsel ayrımı ve eksik varyantlar.
- TEST-RAPORU.md: çalıştırılan kontroller, kullanılan ekran/tarayıcılar, performans gözlemleri ve doğrulanamayan gerçek cihazlar.
- Gelecekte değiştirilecek verilerin dosya konumları.

Son cevabında neyin çalıştığını, nasıl önizleneceğini ve varsa gerçekten eksik kalan şeyi kısa ve dürüst biçimde açıkla. Açılabilen sayfayı tek başına “tamamlandı” sayma. Özellikle animasyonların, oda geçişlerinin ve dekorasyon kontrollerinin gerçekten çalışmasına önem ver.
