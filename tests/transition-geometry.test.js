import test from 'node:test';
import assert from 'node:assert/strict';
import { TransitionManager } from '../src/lib/transition-manager.js';
import { buildFloors } from '../src/lib/geometry.js';
import { lines, facade, floorNumberTop } from '../src/data/exterior.js';

const tick = (ms = 5) => new Promise((r) => setTimeout(r, ms));

function fakeAnim(ms) {
  let done; const finished = new Promise((r) => (done = r));
  const t = setTimeout(done, ms);
  return { finished, finish() { clearTimeout(t); done(); }, cancel() { clearTimeout(t); done(); } };
}

test('hızlı ardışık isteklerde yalnızca son hedef uygulanır, geçişler çakışmaz', async () => {
  const applied = []; let concurrent = 0, maxConcurrent = 0;
  const tm = new TransitionManager({
    async run(target, ctx) {
      concurrent++; maxConcurrent = Math.max(maxConcurrent, concurrent);
      const a = ctx.track(fakeAnim(200));
      await a.finished;
      applied.push(target);
      concurrent--;
    }
  });
  tm.request('kat-10');
  await tick();
  tm.request('kat-11'); tm.request('kat-12'); const last = tm.request('kat-13');
  await last;
  assert.equal(maxConcurrent, 1);
  assert.deepEqual(applied, ['kat-10', 'kat-13']);
  assert.equal(tm.current, 'kat-13');
});

test('hızlandırma: bekleyen istek varken çalışan animasyon hemen biter', async () => {
  const t0 = Date.now();
  const tm = new TransitionManager({ async run(_t, ctx) { await ctx.track(fakeAnim(1000)).finished; } });
  tm.request('a'); await tick(); await tm.request('b');
  assert.ok(Date.now() - t0 < 1500, 'iki tam 1 sn animasyon beklenmemeli');
});

test('hata veren geçiş mevcut durumu korur ve kuyruğu tıkamaz', async () => {
  const errors = [];
  const tm = new TransitionManager({
    async run(t) { if (t === 'bozuk') throw new Error('görsel yüklenemedi'); },
    onError: (e, t) => errors.push(t)
  });
  await tm.request('salon');
  await tm.request('bozuk');
  assert.equal(tm.current, 'salon');
  await tm.request('mutfak');
  assert.equal(tm.current, 'mutfak');
  assert.deepEqual(errors, ['bozuk']);
});

test('kat çokgenleri: 28 bant, üst üste binmeyen ve aşağı doğru sıralı', () => {
  const floors = buildFloors(lines, facade, floorNumberTop);
  assert.equal(floors.length, 28);
  assert.equal(floors[0].number, 30);
  assert.equal(floors.at(-1).number, 3);
  for (let i = 1; i < floors.length; i++) {
    assert.ok(floors[i].target.y > floors[i - 1].target.y);
    // üst bandın alt kenarı = alt bandın üst kenarı (ortak çizgi)
    assert.deepEqual(floors[i - 1].points[4], floors[i].points[1]);
  }
  for (const f of floors) for (const [x, y] of f.points) assert.ok(x >= 600 && x <= 900 && y >= 0 && y <= 800);
});
