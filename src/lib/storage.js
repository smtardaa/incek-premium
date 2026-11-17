/**
 * Erişim hatasına dayanıklı küçük depolama sarmalayıcısı.
 * Gizli pencere, engellenmiş site verisi veya kota hatasında bellek içi yedeğe düşer.
 * Kişisel veri saklanmaz; yalnızca dekorasyon tercihi ve son keşif adresi.
 */
export function safeStorage(kind = 'local') {
  const memory = new Map();
  let store = null;
  try {
    const s = typeof window !== 'undefined' ? (kind === 'session' ? window.sessionStorage : window.localStorage) : null;
    if (s) { const k = '__incek_test__'; s.setItem(k, '1'); s.removeItem(k); store = s; }
  } catch { store = null; }
  return {
    get(key) {
      try { if (store) return store.getItem(key); } catch { /* yedek */ }
      return memory.has(key) ? memory.get(key) : null;
    },
    set(key, value) {
      try { if (store) { store.setItem(key, value); return; } } catch { /* yedek */ }
      memory.set(key, value);
    },
    remove(key) {
      try { if (store) store.removeItem(key); } catch { /* yedek */ }
      memory.delete(key);
    },
    get persistent() { return !!store; }
  };
}
