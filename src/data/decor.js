/**
 * Salon dekorasyon seçenekleri — ÖRNEK / KONSEPT seçeneklerdir.
 * Firmanın satış paketi veya teslim taahhüdü değildir.
 *
 * Paketler, perde + koltuk seçeneklerinin önceden tanımlı kombinasyonlarıdır.
 * Paket ve elle seçim aynı durum modelini (src/lib/decor-state.js) kullanır.
 *
 * `color` alanı scripts/build-decor.mjs tarafından katman üretiminde kullanılır;
 * `original: true` olan seçenek render'ın kendisidir (katman gerekmez).
 */
export const curtains = [
  { id: 'keten', label: 'Keten bej', swatch: '#b9ab98', original: true },
  { id: 'adacayi', label: 'Adaçayı yeşili', swatch: '#6f7c62', color: [104, 116, 92] },
  { id: 'antrasit', label: 'Antrasit', swatch: '#45464a', color: [66, 66, 66] }
];

export const sofas = [
  { id: 'krem', label: 'Krem kumaş', swatch: '#e4ded5', original: true },
  { id: 'tas', label: 'Taş grisi kumaş', swatch: '#8d877e', color: [132, 126, 117] }
];

export const packages = [
  { id: 'sicak', label: 'Sıcak', description: 'Keten bej perde, krem koltuk. Render’daki özgün düzen.', curtain: 'keten', sofa: 'krem' },
  { id: 'modern', label: 'Modern', description: 'Antrasit perde ve taş grisi koltukla daha kontrastlı bir düzen.', curtain: 'antrasit', sofa: 'tas' },
  { id: 'dogal', label: 'Doğal', description: 'Adaçayı yeşili perde ve krem koltukla yumuşak, doğal tonlar.', curtain: 'adacayi', sofa: 'krem' }
];

export const defaultDecor = { curtain: 'keten', sofa: 'krem' };

/** Katman dosya yolu (base eklenmeden). Orijinal seçenek için null. */
export function decorLayerPath(type, kind, optionId) {
  const list = kind === 'curtain' ? curtains : sofas;
  const opt = list.find((o) => o.id === optionId);
  if (!opt || opt.original) return null;
  return `img/dekor/${type}-${kind === 'curtain' ? 'perde' : 'koltuk'}-${optionId}.webp`;
}
