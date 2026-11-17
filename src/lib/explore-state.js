/**
 * Keşif sahnesi durum modeli ve URL eşlemesi.
 *
 * Sahneler: intro → exterior → interior (daire/oda/görünüm) ; exterior → amenity.
 * URL (sorgu parametreleri, statik barındırmada yenilemeye dayanıklı):
 *   (boş)                              → intro
 *   ?s=bina[&kat=12]                   → exterior (isteğe bağlı seçili kat)
 *   ?s=daire&kat=12&tip=acik&oda=salon&aci=oturma → interior
 *   ?s=olanak&grup=spor&oge=havuz[&kat=12] → amenity
 *
 * Saf fonksiyonlar; DOM'a bağlı değildir.
 */

/** @typedef {{ scene:'intro'|'exterior'|'interior'|'amenity', floor:number|null, type:string|null, room:string|null, view:string|null, group:string|null, item:string|null }} ExploreState */

/**
 * Veriden doğrulama kataloğu üretir.
 * @param {{ floors:number[], types:Record<string, Record<string,string[]>>, groups:Record<string,string[]> }} c
 */
export function makeCatalog(c) { return c; }

export const INTRO = Object.freeze({ scene: 'intro', floor: null, type: null, room: null, view: null, group: null, item: null });

/** @returns {ExploreState} */
export function normalizeState(input, catalog) {
  const s = { ...INTRO, ...input };
  const floor = s.floor != null && catalog.floors.includes(Number(s.floor)) ? Number(s.floor) : null;
  if (s.scene === 'exterior') return { ...INTRO, scene: 'exterior', floor, type: s.type && catalog.types[s.type] ? s.type : null };
  if (s.scene === 'interior') {
    const type = catalog.types[s.type] ? s.type : Object.keys(catalog.types)[0];
    const rooms = catalog.types[type];
    const room = rooms[s.room] ? s.room : Object.keys(rooms)[0];
    const views = rooms[room];
    const view = views.includes(s.view) ? s.view : views[0];
    return { ...INTRO, scene: 'interior', floor, type, room, view };
  }
  if (s.scene === 'amenity') {
    const group = catalog.groups[s.group] ? s.group : Object.keys(catalog.groups)[0];
    const items = catalog.groups[group];
    const item = items.includes(s.item) ? s.item : items[0];
    return { ...INTRO, scene: 'amenity', floor, group, item };
  }
  return { ...INTRO };
}

const SCENE_TO_PARAM = { exterior: 'bina', interior: 'daire', amenity: 'olanak' };
const PARAM_TO_SCENE = { bina: 'exterior', daire: 'interior', olanak: 'amenity' };

/** @param {string} search  location.search */
export function parseState(search, catalog) {
  const p = new URLSearchParams(search || '');
  const scene = PARAM_TO_SCENE[p.get('s')] || 'intro';
  const kat = p.get('kat');
  return normalizeState({
    scene,
    floor: kat != null && /^\d{1,2}$/.test(kat) ? Number(kat) : null,
    type: p.get('tip'),
    room: p.get('oda'),
    view: p.get('aci'),
    group: p.get('grup'),
    item: p.get('oge')
  }, catalog);
}

/** @param {ExploreState} s @returns {string} "?…" veya "" */
export function serializeState(s) {
  if (!s || s.scene === 'intro') return '';
  const p = new URLSearchParams();
  p.set('s', SCENE_TO_PARAM[s.scene]);
  if (s.floor != null) p.set('kat', String(s.floor));
  if (s.scene === 'exterior' && s.type) p.set('tip', s.type);
  if (s.scene === 'interior') { p.set('tip', s.type); p.set('oda', s.room); p.set('aci', s.view); }
  if (s.scene === 'amenity') { p.set('grup', s.group); p.set('oge', s.item); }
  return '?' + p.toString();
}

export function stateEquals(a, b) {
  return serializeState(a) === serializeState(b) && a.scene === b.scene;
}

/**
 * Sahne içi “geri” düğmesinin hedefi (hiyerarşik, kullanıcıyı başlangıca atmaz):
 * interior → seçili kat ve tip açık dış cephe; amenity → dış cephe; exterior → intro.
 */
export function parentState(s) {
  if (s.scene === 'interior') return { ...INTRO, scene: 'exterior', floor: s.floor, type: s.type };
  if (s.scene === 'amenity') return { ...INTRO, scene: 'exterior', floor: s.floor };
  return { ...INTRO };
}

/**
 * Geçmişe yeni kayıt mı eklenmeli, mevcut kayıt mı değiştirilmeli?
 * Aynı sahnede yalnızca kat seçimi değişiyorsa (hızlı gezinme) replace; diğerleri push.
 */
export function historyMode(from, to) {
  if (from.scene === 'exterior' && to.scene === 'exterior') return 'replace';
  return 'push';
}
