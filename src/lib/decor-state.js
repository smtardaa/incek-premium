/**
 * Dekorasyon durum modeli — paket ve elle seçim TEK modeli paylaşır.
 *
 * Durum yalnızca { curtain, sofa } çiftidir. Paket, bu çiftin önceden tanımlı adıdır:
 * - applyPackage(pkg) çifti paketin değerlerine ayarlar (kontroller güncellenir),
 * - setCurtain / setSofa yalnızca ilgili alanı değiştirir,
 * - matchPackage(çift) eşleşen paketi bulur; yoksa 'ozel' döner.
 * Böylece paket ve elle seçim hiçbir zaman çelişmez.
 * Tercihler tip bazında saklanır (acik / kapali).
 */
export const CUSTOM = 'ozel';

export function matchPackage(combo, packages) {
  const p = packages.find((x) => x.curtain === combo.curtain && x.sofa === combo.sofa);
  return p ? p.id : CUSTOM;
}

/**
 * @param {{ curtains:{id:string}[], sofas:{id:string}[], packages:{id:string,curtain:string,sofa:string}[], defaults:{curtain:string,sofa:string}, storage?:{get(k:string):string|null,set(k:string,v:string):void}, key?:string }} opts
 */
export function createDecorStore(opts) {
  const { curtains, sofas, packages, defaults } = opts;
  const key = opts.key || 'incek-dekor-v1';
  const validCurtain = (id) => curtains.some((c) => c.id === id);
  const validSofa = (id) => sofas.some((s) => s.id === id);
  /** @type {Record<string,{curtain:string,sofa:string}>} */
  let byType = {};
  const listeners = new Set();

  try {
    const raw = opts.storage && opts.storage.get(key);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === 'object') {
      for (const [t, v] of Object.entries(parsed)) {
        if (v && validCurtain(v.curtain) && validSofa(v.sofa)) byType[t] = { curtain: v.curtain, sofa: v.sofa };
      }
    }
  } catch { byType = {}; }

  function persist() {
    try { opts.storage && opts.storage.set(key, JSON.stringify(byType)); } catch { /* sessizce yoksay */ }
  }
  function emit(type) { const s = api.get(type); listeners.forEach((fn) => fn(type, s)); }
  function commit(type, next) {
    const prev = api.get(type);
    if (prev.curtain === next.curtain && prev.sofa === next.sofa) return prev;
    byType[type] = next; persist(); emit(type);
    return api.get(type);
  }

  const api = {
    get(type) {
      const c = byType[type] || defaults;
      return { curtain: c.curtain, sofa: c.sofa, package: matchPackage(c, packages) };
    },
    setCurtain(type, id) { if (!validCurtain(id)) return api.get(type); return commit(type, { ...api.get(type), curtain: id }); },
    setSofa(type, id) { if (!validSofa(id)) return api.get(type); return commit(type, { ...api.get(type), sofa: id }); },
    applyPackage(type, pkgId) {
      const p = packages.find((x) => x.id === pkgId);
      if (!p) return api.get(type);
      return commit(type, { curtain: p.curtain, sofa: p.sofa });
    },
    reset(type) { return commit(type, { ...defaults }); },
    isDefault(type) { const s = api.get(type); return s.curtain === defaults.curtain && s.sofa === defaults.sofa; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    /** Tüm geçerli kombinasyonlar (test/önyükleme için) */
    combinations() { return curtains.flatMap((c) => sofas.map((s) => ({ curtain: c.id, sofa: s.id }))); }
  };
  return api;
}
