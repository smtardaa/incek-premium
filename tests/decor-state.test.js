import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createDecorStore, matchPackage, CUSTOM } from '../src/lib/decor-state.js';
import { curtains, sofas, packages, defaultDecor, decorLayerPath } from '../src/data/decor.js';

function memStore() { const m = new Map(); return { get: (k) => m.get(k) ?? null, set: (k, v) => m.set(k, v), m }; }
const mk = (storage) => createDecorStore({ curtains, sofas, packages, defaults: defaultDecor, storage });

test('kapsam: 3 perde × 2 koltuk = 6 kombinasyon, 3 paket', () => {
  assert.equal(curtains.length, 3);
  assert.equal(sofas.length, 2);
  assert.equal(packages.length, 3);
  assert.equal(mk().combinations().length, 6);
});

test('her paket geçerli bir kombinasyon ve paketler birbirinden farklı', () => {
  const keys = new Set(packages.map((p) => p.curtain + '/' + p.sofa));
  assert.equal(keys.size, 3);
  for (const p of packages) assert.equal(matchPackage(p, packages), p.id);
});

test('paket seçimi kontrolleri günceller; elle değişiklik eşleşme yoksa “Özel” gösterir', () => {
  const s = mk();
  s.applyPackage('acik', 'modern');
  assert.deepEqual([s.get('acik').curtain, s.get('acik').sofa, s.get('acik').package], ['antrasit', 'tas', 'modern']);
  s.setSofa('acik', 'krem');
  assert.equal(s.get('acik').package, CUSTOM);
  s.setCurtain('acik', 'adacayi');
  assert.equal(s.get('acik').package, 'dogal', 'elle seçim bir paketle eşleşirse paket adı görünür');
});

test('6 kombinasyonun tamamına elle ulaşılabilir ve paket eşleşmesi tutarlı', () => {
  const s = mk();
  let custom = 0;
  for (const c of curtains) for (const f of sofas) {
    s.setCurtain('kapali', c.id); s.setSofa('kapali', f.id);
    const st = s.get('kapali');
    assert.deepEqual([st.curtain, st.sofa], [c.id, f.id]);
    if (st.package === CUSTOM) custom++;
  }
  assert.equal(custom, 3);
});

test('varsayılana dön ve tip bazında ayrı saklama', () => {
  const store = memStore();
  const s = mk(store);
  s.applyPackage('acik', 'dogal');
  s.applyPackage('kapali', 'modern');
  const again = mk(store);
  assert.equal(again.get('acik').package, 'dogal');
  assert.equal(again.get('kapali').package, 'modern');
  again.reset('acik');
  assert.ok(again.isDefault('acik'));
  assert.equal(again.get('kapali').package, 'modern');
});

test('bozuk/erişilemeyen depolama deneyimi bozmaz', () => {
  const broken = { get() { throw new Error('SecurityError'); }, set() { throw new Error('QuotaExceeded'); } };
  const s = mk(broken);
  assert.equal(s.get('acik').package, 'sicak');
  s.applyPackage('acik', 'modern');
  assert.equal(s.get('acik').package, 'modern');
  const junk = { get: () => '{"acik":{"curtain":"mor","sofa":"krem"}}', set() {} };
  assert.ok(mk(junk).isDefault('acik'), 'geçersiz kayıt yok sayılır');
});

test('orijinal olmayan her seçenek için iki tipte de katman dosyası üretilmiş', () => {
  for (const type of ['acik', 'kapali']) {
    for (const c of curtains) {
      const p = decorLayerPath(type, 'curtain', c.id);
      if (c.original) assert.equal(p, null); else assert.ok(fs.existsSync('public/' + p), p);
    }
    for (const f of sofas) {
      const p = decorLayerPath(type, 'sofa', f.id);
      if (f.original) assert.equal(p, null); else assert.ok(fs.existsSync('public/' + p), p);
    }
  }
});
