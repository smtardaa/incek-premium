/**
 * WhatsApp randevu talebi: mesaj metni ve bağlantı oluşturma.
 * Bağlantı yalnızca WhatsApp'ı hazır metinle açar; mesajı kullanıcı kendisi gönderir.
 * Tarih/saat bir müsaitlik takvimi değil, tercih bilgisidir.
 */

export const TIME_SLOTS = ['10:00 – 12:00', '12:00 – 14:00', '14:00 – 16:00', '16:00 – 18:00'];

const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

/** "YYYY-MM-DD" → {y,m,d} ; geçersizse null (saat dilimi kayması olmadan) */
export function parseIsoDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return { y, m: mo, d, weekday: dt.getUTCDay() };
}

/** Yerel saate göre bugünün "YYYY-MM-DD" karşılığı */
export function todayIso(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function formatDateTR(iso) {
  const d = parseIsoDate(iso);
  if (!d) return '';
  return `${String(d.d).padStart(2, '0')}.${String(d.m).padStart(2, '0')}.${d.y} ${DAYS[d.weekday]}`;
}

/** @returns {{ok:true}|{ok:false,error:string}} */
export function validateVisitDate(iso, today) {
  if (!iso) return { ok: false, error: 'Lütfen tercih ettiğiniz ziyaret tarihini seçin.' };
  if (!parseIsoDate(iso)) return { ok: false, error: 'Tarih geçerli değil.' };
  if (iso < today) return { ok: false, error: 'Geçmiş bir tarih seçilemez.' };
  return { ok: true };
}

/**
 * @param {{ name?:string, date:string, slot:string, note?:string,
 *   context?: { floor?:number|null, typeTitle?:string|null, amenity?:string|null } }} f
 */
export function buildMessage(f) {
  const clean = (s, max) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, max);
  const lines = ['Merhaba, İncek Premium için ziyaret randevusu talep etmek istiyorum.', ''];
  const name = clean(f.name, 60);
  if (name) lines.push(`Ad: ${name}`);
  lines.push(`Tercih ettiğim tarih: ${formatDateTR(f.date)}`);
  if (f.slot) lines.push(`Tercih ettiğim saat aralığı: ${f.slot}`);
  const c = f.context || {};
  if (c.typeTitle) lines.push(`İlgilendiğim örnek daire tipi: ${c.typeTitle}`);
  if (c.floor != null) lines.push(`Görsel keşifte baktığım kat: ${c.floor}. kat (örnek keşif seçimi)`);
  if (c.amenity) lines.push(`İlgilendiğim sosyal alan: ${c.amenity}`);
  const note = clean(f.note, 300);
  if (note) { lines.push('', `Not: ${note}`); }
  lines.push('', 'Tarih ve saat tercih bilgisidir; uygunluk için dönüşünüzü rica ederim.');
  return lines.join('\n');
}

export function buildWhatsAppUrl(number, message) {
  const digits = String(number).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
