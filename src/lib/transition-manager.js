/**
 * Tek geçiş yöneticisi.
 *
 * - Aynı anda yalnızca bir geçiş çalışır.
 * - Geçiş sürerken yeni istek gelirse “en son istek kazanır”: bekleyen hedef güncellenir,
 *   çalışan geçiş hızlandırılır (kayıtlı animasyonlar hemen bitirilir) ve ardından
 *   yalnızca son hedef oynatılır. Böylece hızlı tıklama, geri/ileri ve kat değişimi çakışmaz.
 * - Geçiş hata verirse (ör. görsel yüklenemedi) mevcut sahne korunur, onError çağrılır,
 *   kuyruk tıkanmaz.
 *
 * run(target, ctx) imzası:
 *   ctx.fast      → kuyruk birikmişse/indirgenmiş hareket isteniyorsa true
 *   ctx.stale()   → bu geçişten sonra yeni bir istek geldiyse true
 *   ctx.track(a)  → Web Animation nesnesini kaydeder (hızlandırmada finish() edilir)
 */
export class TransitionManager {
  /** @param {{ run:(target:any, ctx:any)=>Promise<void>, onError?:(e:any, target:any)=>void }} o */
  constructor(o) {
    this._run = o.run;
    this._onError = o.onError || (() => {});
    this.running = false;
    this._pending = null;
    this._hasPending = false;
    this._anims = new Set();
    this._waiters = [];
    this.current = null;
  }

  /** @returns {Promise<void>} kuyruk boşaldığında çözülür */
  request(target) {
    this._pending = target;
    this._hasPending = true;
    const p = new Promise((res) => this._waiters.push(res));
    if (this.running) this.hurry();
    else this._loop();
    return p;
  }

  /** Çalışan animasyonları hemen bitirir. */
  hurry() {
    for (const a of this._anims) { try { a.finish(); } catch { try { a.cancel(); } catch { /* yoksay */ } } }
    this._anims.clear();
  }

  async _loop() {
    this.running = true;
    let queued = false;
    while (this._hasPending) {
      const target = this._pending;
      this._hasPending = false;
      this._pending = null;
      const ctx = {
        fast: queued,
        stale: () => this._hasPending,
        track: (a) => { if (a) { this._anims.add(a); if (this._hasPending) this.hurry(); const done = () => this._anims.delete(a); a.finished?.then(done, done); } return a; }
      };
      try {
        await this._run(target, ctx);
        this.current = target;
      } catch (e) {
        this._onError(e, target);
      }
      queued = true;
    }
    this.running = false;
    const w = this._waiters; this._waiters = [];
    w.forEach((r) => r());
  }
}
