import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMessage, buildWhatsAppUrl, validateVisitDate, formatDateTR, parseIsoDate } from '../src/lib/whatsapp.js';
import { project } from '../src/data/project.js';

test('resmî WhatsApp numarası ve hedef', () => {
  const url = buildWhatsAppUrl(project.contact.whatsappNumber, 'x');
  assert.ok(url.startsWith('https://wa.me/905424921571?text='));
  assert.equal(project.contact.whatsappBase, 'https://wa.me/905424921571');
});

test('Türkçe karakterler ve satır sonları kayıpsız kodlanır', () => {
  const msg = buildMessage({ name: 'Çağrı Işıkoğlu', date: '2026-11-21', slot: '14:00 – 16:00', note: 'Şubat’ta taşınmayı düşünüyorum; öğleden sonra uygun.', context: { floor: 12, typeTitle: 'Açık mutfaklı 2+1', amenity: 'Kapalı yüzme havuzu' } });
  const url = buildWhatsAppUrl('+90 542 492 15 71', msg);
  const decoded = decodeURIComponent(new URL(url).searchParams.get('text') ? url.split('?text=')[1] : '');
  assert.equal(decoded, msg);
  assert.ok(url.includes('%0A'), 'satır sonu %0A olarak kodlanmalı');
  assert.ok(!/[çğışöüÇĞİŞÖÜ\n ]/.test(url.split('?text=')[1]), 'ham karakter kalmamalı');
  assert.match(msg, /Ad: Çağrı Işıkoğlu/);
  assert.match(msg, /21\.11\.2026 Cumartesi/);
  assert.match(msg, /12\. kat \(örnek keşif seçimi\)/);
  assert.doesNotMatch(msg, /daire no|numara/i, 'hayalî daire numarası eklenmez');
});

test('isteğe bağlı alanlar boşsa satır eklenmez', () => {
  const msg = buildMessage({ date: '2026-12-01', slot: '10:00 – 12:00' });
  assert.doesNotMatch(msg, /Ad:|Not:|kat|sosyal alan/);
});

test('geçmiş tarih ve geçersiz tarih reddedilir', () => {
  assert.equal(validateVisitDate('2026-11-16', '2026-11-17').ok, false);
  assert.equal(validateVisitDate('2026-11-17', '2026-11-17').ok, true);
  assert.equal(validateVisitDate('2026-02-30', '2026-01-01').ok, false);
  assert.equal(validateVisitDate('', '2026-01-01').ok, false);
  assert.equal(parseIsoDate('2027-06-30').weekday, 3);
  assert.equal(formatDateTR('2027-06-30'), '30.06.2027 Çarşamba');
});
