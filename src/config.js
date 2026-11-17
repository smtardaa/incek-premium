/**
 * Site genel ayarları.
 *
 * NOINDEX: Müşteri gösterimi / açık beta sürümünde arama motorlarına “dizinleme” denir.
 * Bu bir erişim kontrolü DEĞİLDİR; bağlantıyı bilen herkes siteyi açabilir.
 * Nihai yayında `PUBLIC_NOINDEX=false` ortam değişkeniyle derleyin (README → Nihai yayın).
 */
export const NOINDEX = (import.meta.env.PUBLIC_NOINDEX ?? 'true') !== 'false';
export const LANG = 'tr';
export const SITE_TITLE = 'İncek Premium · Etkileşimli Tanıtım (Açık Beta)';
export const SITE_DESCRIPTION = 'İncek Premium projesini dış cepheden kat seçimine, örnek daire tiplerinden sosyal olanaklara kadar görsel olarak keşfedin. Vertisa · İncek / Ankara.';
