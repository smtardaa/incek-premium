import test from 'node:test';
import assert from 'node:assert/strict';
import { parseState, serializeState, parentState, historyMode, normalizeState } from '../src/lib/explore-state.js';
import { buildCatalog } from '../src/lib/catalog.js';
import { apartmentTypes, roomOrder } from '../src/data/apartments.js';
import { getAsset } from '../src/data/assets.js';

const cat = buildCatalog();

test('katalog: 28 temsili kat bandı, 30 → 3 arası', () => {
  assert.equal(cat.floors.length, 28);
  assert.equal(cat.floors[0], 30);
  assert.equal(cat.floors.at(-1), 3);
});

test('boş adres intro sahnesidir', () => {
  assert.equal(parseState('', cat).scene, 'intro');
  assert.equal(serializeState(parseState('', cat)), '');
});

test('URL gidiş-dönüş tutarlı (her tip, oda ve görünüm)', () => {
  for (const t of apartmentTypes) for (const r of roomOrder) for (const v of t.rooms[r].views) {
    const s = { scene: 'interior', floor: 12, type: t.id, room: r, view: v.id };
    const q = serializeState(normalizeState(s, cat));
    const back = parseState(q, cat);
    assert.deepEqual([back.type, back.room, back.view, back.floor], [t.id, r, v.id, 12], q);
  }
});

test('geçersiz parametreler güvenli varsayılana düşer', () => {
  const s = parseState('?s=daire&kat=99&tip=penthouse&oda=mutfakx&aci=zzz', cat);
  assert.equal(s.scene, 'interior');
  assert.equal(s.floor, null);
  assert.equal(s.type, 'acik');
  assert.equal(s.room, 'salon');
  assert.equal(s.view, 'oturma');
  assert.equal(parseState('?s=bilinmeyen', cat).scene, 'intro');
  assert.equal(parseState('?s=bina&kat=1', cat).floor, null, 'otopark/lobi seviyesi konut katı değildir');
});

test('sahne içi geri: başlangıca atmaz, hiyerarşide bir üst seviyeye döner', () => {
  const room = parseState('?s=daire&kat=14&tip=kapali&oda=banyo&aci=dus', cat);
  const up = parentState(room);
  assert.equal(up.scene, 'exterior');
  assert.equal(up.floor, 14);
  assert.equal(up.type, 'kapali');
  const am = parseState('?s=olanak&grup=spor&oge=havuz&kat=20', cat);
  assert.deepEqual([parentState(am).scene, parentState(am).floor], ['exterior', 20]);
});

test('kat değişimi geçmişi şişirmez (replace), sahne değişimi push', () => {
  const a = parseState('?s=bina&kat=10', cat);
  const b = parseState('?s=bina&kat=11', cat);
  const c = parseState('?s=daire&kat=11&tip=acik&oda=salon', cat);
  assert.equal(historyMode(a, b), 'replace');
  assert.equal(historyMode(b, c), 'push');
});

test('her görünümün görseli manifestte var ve hotspotlar normalize aralıkta', () => {
  for (const t of apartmentTypes) for (const r of roomOrder) for (const v of t.rooms[r].views) {
    getAsset(v.asset);
    for (const h of v.hotspots) {
      assert.ok(h.x >= 0 && h.x <= 1 && h.y >= 0 && h.y <= 1, `${t.id}/${r}/${v.id}`);
      if (h.kind === 'go') assert.ok(cat.types[t.id][h.to.room].includes(h.to.view), `go hedefi yok: ${t.id}/${r}/${v.id} → ${h.to.room}/${h.to.view}`);
    }
  }
});
