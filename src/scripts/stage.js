/**
 * Stage: görsel + hotspot/SVG katmanını TEK transform ile taşıyan sahne.
 *
 * - Sahne elemanı görselin doğal boyutundadır (ör. 1920×1080 px); ekrana “cover” ölçeğiyle sığdırılır.
 * - Görsel, SVG çokgenleri ve işaretler aynı elemanın çocuklarıdır → koordinatlar asla kopmaz.
 * - Kamera durumu { cx, cy, z }: görsel pikselinde merkez ve cover'a göre yakınlaşma.
 * - Hareket yalnızca transform ile yapılır (Web Animations API); boşta rAF döngüsü yoktur.
 */
export class Stage {
  constructor(viewport, el, w, h, opts = {}) {
    this.vp = viewport;
    this.el = el;
    this.w = w;
    this.h = h;
    this.maxZoom = opts.maxZoom ?? 2.6;
    this.focus = opts.focus || { x: w / 2, y: h / 2 };
    this.onMove = opts.onMove || null;
    this.fit = opts.fit || 'cover';
    this.anim = null;
    this.locked = false;
    this.justDragged = false;
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    this.v = { cx: this.focus.x, cy: this.focus.y, z: 1 };
    this.measure();
    this.apply();
    if (opts.pannable !== false) this._bindPan();
  }

  measure() {
    const r = this.vp.getBoundingClientRect();
    this.vw = r.width || window.innerWidth;
    this.vh = r.height || window.innerHeight;
    this.s0 = this.fit === 'contain' ? Math.min(this.vw / this.w, this.vh / this.h) : Math.max(this.vw / this.w, this.vh / this.h);
  }

  clamp(v) {
    const z = Math.min(Math.max(v.z ?? 1, 1), this.maxZoom);
    const s = this.s0 * z;
    const hw = this.vw / 2 / s;
    const hh = this.vh / 2 / s;
    const cx = hw * 2 >= this.w ? this.w / 2 : Math.min(Math.max(v.cx, hw), this.w - hw);
    const cy = hh * 2 >= this.h ? this.h / 2 : Math.min(Math.max(v.cy, hh), this.h - hh);
    return { cx, cy, z };
  }

  transformOf(v) {
    const s = this.s0 * v.z;
    return `translate3d(${(this.vw / 2 - v.cx * s).toFixed(2)}px, ${(this.vh / 2 - v.cy * s).toFixed(2)}px, 0) scale(${s.toFixed(5)})`;
  }

  _commitStyle() {
    this.el.style.transform = this.transformOf(this.v);
    this.el.style.setProperty('--inv', (1 / (this.s0 * this.v.z)).toFixed(5));
    this.vp.classList.toggle('can-pan', this.canPan());
  }

  apply(v = this.v) {
    this.v = this.clamp(v);
    this._commitStyle();
    if (this.onMove) this.onMove(this);
  }

  canPan() {
    const s = this.s0 * this.v.z;
    return this.w * s > this.vw + 2 || this.h * s > this.vh + 2;
  }

  /** Görsel pikselini ekran koordinatına çevirir (viewport'a göre). */
  toScreen(x, y) {
    const s = this.s0 * this.v.z;
    return { x: this.vw / 2 + (x - this.v.cx) * s, y: this.vh / 2 + (y - this.v.cy) * s, s };
  }

  resize() {
    this.stop();
    this.measure();
    this.apply();
  }

  stop() {
    if (this.anim) { const a = this.anim; this.anim = null; try { a.cancel(); } catch { /* yoksay */ } this._commitStyle(); }
  }

  home(z = 1) { return { cx: this.focus.x, cy: this.focus.y, z }; }

  /** Normalize dikdörtgeni ekrana sığdıran kamera değeri. */
  fitRect(r, pad = 0.92) {
    const rw = r.w * this.w, rh = r.h * this.h;
    const z = Math.min(this.vw / (rw * this.s0), this.vh / (rh * this.s0)) * pad;
    return { cx: (r.x + r.w / 2) * this.w, cy: (r.y + r.h / 2) * this.h, z: Math.min(Math.max(z, 1), this.maxZoom) };
  }

  /** @returns {Animation|null} */
  animateTo(target, { duration = 800, easing = 'cubic-bezier(0.65, 0, 0.35, 1)' } = {}) {
    this.stop();
    const to = this.clamp(target);
    const from = this.v;
    if (!duration || duration <= 0 || typeof this.el.animate !== 'function') { this.apply(to); return null; }
    const a = this.el.animate([{ transform: this.transformOf(from) }, { transform: this.transformOf(to) }], { duration, easing, fill: 'forwards' });
    this.anim = a;
    this.v = to;
    a.finished.then(() => {
      if (this.anim === a) this.anim = null;
      this._commitStyle();
      try { a.cancel(); } catch { /* yoksay */ }
      if (this.onMove) this.onMove(this);
    }, () => { /* iptal: stop() zaten son durumu uyguladı */ });
    return a;
  }

  _bindPan() {
    let id = null, sx = 0, sy = 0, start = null, moved = false, raf = 0, pending = null;
    const vp = this.vp;
    vp.addEventListener('pointerdown', (e) => {
      if ((e.pointerType === 'mouse' && e.button !== 0) || this.anim || this.locked || !this.canPan()) return;
      if (e.target.closest && e.target.closest('button, a, input, select, label, textarea')) return;
      id = e.pointerId; sx = e.clientX; sy = e.clientY; start = { ...this.v }; moved = false;
    });
    vp.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved) {
        if (Math.hypot(dx, dy) < 7) return;
        moved = true;
        try { vp.setPointerCapture(id); } catch { /* yoksay */ }
        vp.classList.add('is-dragging');
      }
      const s = this.s0 * start.z;
      pending = { cx: start.cx - dx / s, cy: start.cy - dy / s, z: start.z };
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (pending) { this.apply(pending); pending = null; } });
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      vp.classList.remove('is-dragging');
      if (moved) { this.justDragged = true; setTimeout(() => { this.justDragged = false; }, 0); }
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('click', (e) => { if (this.justDragged) { e.stopPropagation(); e.preventDefault(); } }, true);
  }
}

/** Görseli yükler ve decode eder; zaman aşımı ve hata durumunda reddeder. Aynı adres önbelleklenir. */
const cache = new Map();
export function loadImage(src, timeout = 15000) {
  if (cache.has(src)) return cache.get(src);
  const p = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    let done = false;
    const t = setTimeout(() => { if (!done) { done = true; reject(new Error('Zaman aşımı: ' + src)); } }, timeout);
    img.onload = () => {
      const fin = () => { if (!done) { done = true; clearTimeout(t); resolve(img); } };
      if (img.decode) img.decode().then(fin, fin); else fin();
    };
    img.onerror = () => { if (!done) { done = true; clearTimeout(t); reject(new Error('Yüklenemedi: ' + src)); } };
    img.src = src;
  });
  cache.set(src, p);
  p.catch(() => cache.delete(src));
  return p;
}

/** Aynı görselin sahnede kullanılacak bağımsız kopyası (önbellekten). */
export async function imageElement(src, cls, alt = '') {
  await loadImage(src);
  const el = new Image();
  el.decoding = 'async';
  el.src = src;
  el.className = cls;
  el.alt = alt;
  el.draggable = false;
  if (el.decode) { try { await el.decode(); } catch { /* önbellekte; yoksay */ } }
  return el;
}

export function settle(anim) {
  return anim && anim.finished ? anim.finished.then(() => {}, () => {}) : Promise.resolve();
}
