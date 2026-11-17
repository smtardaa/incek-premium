/**
 * Görsel keşif orkestrasyonu.
 * Sahneler: intro → exterior (kat seçimi) → interior (örnek daire / oda / görünüm) ; exterior → amenity.
 * Tüm sahne değişimleri TEK geçiş yöneticisinden geçer (src/lib/transition-manager.js).
 */
import { Stage, loadImage, imageElement, settle } from './stage.js';
import { TransitionManager } from '../lib/transition-manager.js';
import { INTRO, normalizeState, parseState, serializeState, parentState, historyMode } from '../lib/explore-state.js';
import { createDecorStore } from '../lib/decor-state.js';
import { safeStorage } from '../lib/storage.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const EASE_IO = 'cubic-bezier(0.65, 0, 0.35, 1)';
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const ICON = {
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  go: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  zoom: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11h6M11 8v6M16 16l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

export function initExplore() {
  const data = JSON.parse($('#explore-data').textContent);
  const root = $('#explore');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const session = safeStorage('session');

  // ——— Katalog (URL doğrulaması) ———
  const catalog = {
    floors: data.exterior.floors.map((f) => f.number),
    types: Object.fromEntries(data.types.map((t) => [t.id, Object.fromEntries(data.roomOrder.map((r) => [r, t.rooms[r].views.map((v) => v.id)]))])),
    groups: Object.fromEntries(data.amenities.groups.map((g) => [g.id, g.items]))
  };
  const typeById = (id) => data.types.find((t) => t.id === id);
  const floorByNumber = (n) => data.exterior.floors.find((f) => f.number === n);
  const groupById = (id) => data.amenities.groups.find((g) => g.id === id);

  const decor = createDecorStore({ ...data.decor, storage: safeStorage('local'), key: 'incek-dekor-v1' });

  // ——— Elemanlar ———
  const el = {
    back: $('[data-action="back"]', root), backLabel: $('[data-back-label]', root), crumb: $('[data-crumb]', root),
    ext: $('#scene-exterior'), intro: $('#scene-intro'), int: $('#scene-interior'), am: $('#scene-amenity'),
    floorTip: $('[data-floor-tip]', root), floorTitle: $('[data-floor-title]', root), floorHint: $('[data-floor-hint]', root),
    floorSelect: $('[data-floor-select]', root), typeChoice: $('[data-type-choice]', root), enter: $('[data-action="enter"]', root),
    enterLabel: $('[data-enter-label]', root), toast: $('[data-toast]', root), infoCta: $('[data-info-cta]', root),
    roomList: $('[data-room-list]', root), viewTabs: $('[data-view-tabs]', root), zoomOut: $('[data-action="zoom-out"]', root),
    infoToggle: $('[data-action="info-toggle"]', root), decorToggle: $('[data-action="decor-toggle"]', root),
    roomInfo: $('#room-info'), decorPanel: $('#decor-panel'), hsCard: $('[data-hs-card]', root),
    amGroups: $('[data-am-groups]', root), amGroup: $('[data-am-group]', root), amTabs: $('[data-am-tabs]', root), amTitle: $('[data-am-title]', root),
    amText: $('[data-am-text]', root), amNote: $('[data-am-note]', root), amSource: $('[data-am-source]', root), amAppt: $('[data-am-appt]', root)
  };

  // ——— Dış cephe sahnesi ———
  const extVp = $('[data-viewport]', el.ext);
  const extStageEl = $('[data-stage]', el.ext);
  const ext = new Stage(extVp, extStageEl, data.exterior.w, data.exterior.h, { focus: data.exterior.focus, maxZoom: 2.6, onMove: () => hideFloorTip() });
  const INTRO_Z = 1.07;
  /** Açılış kamerası: yatay ekranda kuleyi sola kaydırır, metin alanı gökyüzüne düşer. */
  function introView() {
    const base = ext.home(INTRO_Z);
    if (ext.vw / ext.vh < 1.05 || ext.vw < 761) return base;
    const s = ext.s0 * INTRO_Z;
    return { ...base, cx: data.exterior.focus.x + (ext.vw * 0.2) / s };
  }

  function durations(ctx, opts) {
    if (ctx.fast || opts?.instant) return { move: 0, fade: 140, short: 0 };
    if (reduceMotion.matches) return { move: 0, fade: 180, short: 0 };
    return { move: 950, fade: 480, short: 300 };
  }

  function pickSrc(img, headroom = 1.2) {
    const s0 = Math.max(window.innerWidth / img.w, window.innerHeight / img.h);
    const need = img.w * s0 * (window.devicePixelRatio || 1) * headroom;
    return need > img.smallW * 1.12 ? img.large : img.small;
  }

  // ——— Çift tamponlu görsel sahnesi (iç mekân ve sosyal alan) ———
  class BufferedScene {
    constructor(section, w, h) {
      this.section = section;
      this.container = $('[data-buffers]', section);
      this.w = w; this.h = h;
      this.buffers = [this._make(), this._make()];
      this.front = null;
    }
    _make() {
      const b = document.createElement('div');
      b.className = 'buffer';
      b.setAttribute('aria-hidden', 'true');
      b.inert = true;
      const vp = document.createElement('div'); vp.className = 'viewport';
      const st = document.createElement('div'); st.className = 'stage';
      vp.appendChild(st); b.appendChild(vp); this.container.appendChild(b);
      const stage = new Stage(vp, st, this.w, this.h, { maxZoom: 2.4, onMove: () => this.onMove && this.onMove() });
      return { el: b, vp, st, stage, spec: null };
    }
    back() { return this.buffers.find((b) => b !== this.front); }
    /** Arka tamponu hazırlar: görseller yüklenmeden ön tampona dokunulmaz. */
    async prepare(spec, build) {
      const b = this.back();
      const nodes = await build(spec); // reddedilirse mevcut sahne korunur
      b.st.replaceChildren(...nodes);
      b.spec = spec;
      b.stage.focus = { x: spec.focus[0] * this.w, y: spec.focus[1] * this.h };
      b.stage.measure();
      b.stage.apply(b.stage.home(1));
      return b;
    }
    /** Arka tamponu öne alır (yumuşak geçiş). */
    async swap(b, ctx, d, { scaleFrom = 1.04 } = {}) {
      const old = this.front;
      b.el.style.zIndex = '2';
      if (old) old.el.style.zIndex = '1';
      b.el.setAttribute('aria-hidden', 'false');
      b.el.inert = false;
      const anims = [];
      if (d.fade > 0 && old) {
        anims.push(ctx.track(b.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: d.fade, easing: 'ease-out' })));
        if (d.move > 0 && scaleFrom !== 1) anims.push(ctx.track(b.el.animate([{ transform: `scale(${scaleFrom})` }, { transform: 'scale(1)' }], { duration: Math.round(d.move * 0.8), easing: EASE_OUT })));
      }
      this.front = b;
      await Promise.all(anims.map(settle));
      if (old) { old.el.setAttribute('aria-hidden', 'true'); old.el.inert = true; old.st.replaceChildren(); old.spec = null; old.stage.stop(); }
    }
    resize() { this.buffers.forEach((b) => b.stage.resize()); }
  }

  const interior = new BufferedScene(el.int, 1600, 900);
  const amenity = new BufferedScene(el.am, 1600, 900);

  // ——— Durum ———
  let state = { ...INTRO };
  let openPanel = null; // 'info' | 'decor' | 'hs'
  let panelOpener = null;
  let zoomed = false;

  const tm = new TransitionManager({
    run: async (req, ctx) => {
      const from = state;
      const to = req.state;
      await transition(from, to, ctx, req.opts || {});
      state = to;
      afterSettle(from, to, req);
    },
    onError: (err, req) => {
      console.warn(err);
      setEnterBusy(false);
      showToast('Görsel yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin; bulunduğunuz sahne korunuyor.');
      if (req.history === 'none') history.replaceState(history.state, '', location.pathname + serializeState(state));
    }
  });

  function go(next, opts = {}) {
    const s = normalizeState(next, catalog);
    return tm.request({ state: s, history: opts.history || 'auto', opts });
  }

  function afterSettle(from, to, req) {
    const url = location.pathname + serializeState(to);
    if (req.history === 'auto' && serializeState(from) !== serializeState(to)) {
      if (historyMode(from, to) === 'push') history.pushState({ incek: 1, prev: serializeState(from) }, '', url);
      else history.replaceState({ ...(history.state || {}), incek: 1 }, '', url);
    } else if (req.history === 'replace') {
      history.replaceState({ incek: 1, prev: history.state?.prev ?? null }, '', url);
    }
    session.set('incek-son-kesif', serializeState(to));
    const t = to.type ? typeById(to.type) : null;
    const amItem = to.scene === 'amenity' ? data.amenities.items[to.item]?.title : null;
    const typeTitle = to.scene === 'interior' ? t.title : (to.scene === 'exterior' && to.floor != null ? typeById(to.type || selectedType())?.title : null);
    session.set('incek-baglam', JSON.stringify({ floor: to.floor ?? null, typeTitle: typeTitle || null, amenity: amItem || null }));
    updateChrome(to);
    setEnterBusy(false);
    invalidateEdges();
  }

  // ——— Geçişler ———
  async function transition(from, to, ctx, opts) {
    const d = durations(ctx, opts);
    if (from.scene === to.scene) {
      if (to.scene === 'exterior') { updateExteriorUI(to); return; }
      if (to.scene === 'interior') {
        if (from.type === to.type && from.room === to.room && from.view === to.view) { updateInteriorUI(to); return; }
        closePanels(false);
        const b = await interior.prepare(interiorSpec(to), buildInterior);
        setZoomed(false);
        updateInteriorUI(to);
        await interior.swap(b, ctx, d);
        afterInteriorShown(to);
        return;
      }
      if (to.scene === 'amenity') {
        updateAmenityUI(to);
        if (from.item === to.item) return;
        const b = await amenity.prepare(amenitySpec(to), buildAmenity);
        await amenity.swap(b, ctx, d);
        return;
      }
      return;
    }

    // intro ↔ exterior: aynı görsel, kamera yerleşir
    if (from.scene === 'intro' && to.scene === 'exterior') {
      setScene('exterior');
      updateExteriorUI(to);
      const a1 = ctx.track(ext.animateTo(ext.home(1), { duration: d.move, easing: EASE_OUT }));
      const a2 = d.fade ? ctx.track(el.intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: d.fade, easing: 'ease-in', fill: 'forwards' })) : null;
      await Promise.all([settle(a1), settle(a2)]);
      el.intro.hidden = true; el.intro.inert = true; a2?.cancel();
      return;
    }
    if (to.scene === 'intro' && from.scene === 'exterior') {
      el.intro.hidden = false; el.intro.inert = false;
      const a2 = d.fade ? ctx.track(el.intro.animate([{ opacity: 0 }, { opacity: 1 }], { duration: d.fade, easing: 'ease-out' })) : null;
      setScene('intro');
      const a1 = ctx.track(ext.animateTo(introView(), { duration: d.move, easing: EASE_IO }));
      await Promise.all([settle(a1), settle(a2)]);
      return;
    }

    // → iç mekân
    if (to.scene === 'interior') {
      const b = await interior.prepare(interiorSpec(to), buildInterior); // önce yükle
      closePanels(false);
      setZoomed(false);
      updateInteriorUI(to);
      if (from.scene === 'exterior' || from.scene === 'intro') {
        const f = to.floor != null ? floorByNumber(to.floor) : null;
        el.ext.classList.add('is-moving', 'ui-out');
        hideFloorTip();
        if (f && from.scene === 'exterior' && d.move) {
          await settle(ctx.track(ext.animateTo({ cx: f.target.x, cy: f.target.y, z: 2.5 }, { duration: d.move, easing: EASE_IO })));
        }
        await revealScene(el.int, ctx, d, () => interior.swap(b, ctx, { ...d, fade: 0 }), { scaleFrom: d.move ? 1.1 : 1, stage: b.el });
        hideIntro();
        hideScene(el.ext);
        el.ext.classList.remove('is-moving', 'ui-out');
        ext.apply(ext.home(1));
      } else {
        await interior.swap(b, ctx, { ...d, fade: 0 });
        await revealScene(el.int, ctx, d, null, {});
        hideScene(from.scene === 'amenity' ? el.am : null);
      }
      afterInteriorShown(to);
      return;
    }

    // → sosyal olanak
    if (to.scene === 'amenity') {
      const b = await amenity.prepare(amenitySpec(to), buildAmenity);
      updateAmenityUI(to);
      if (from.scene === 'exterior' || from.scene === 'intro') {
        const hs = data.exterior.hotspots.find((h) => h.amenity === to.group);
        el.ext.classList.add('is-moving', 'ui-out');
        hideFloorTip();
        if (hs && from.scene === 'exterior' && d.move) {
          await settle(ctx.track(ext.animateTo({ cx: hs.anchor[0], cy: hs.anchor[1], z: 1.9 }, { duration: Math.round(d.move * 0.85), easing: EASE_IO })));
        }
        await revealScene(el.am, ctx, d, () => amenity.swap(b, ctx, { ...d, fade: 0 }), { scaleFrom: d.move ? 1.08 : 1, stage: b.el });
        hideIntro();
        hideScene(el.ext);
        el.ext.classList.remove('is-moving', 'ui-out');
        ext.apply(ext.home(1));
      } else {
        await amenity.swap(b, ctx, { ...d, fade: 0 });
        await revealScene(el.am, ctx, d, null, {});
        hideScene(el.int);
      }
      return;
    }

    // iç mekân / sosyal alan → dış cephe veya açılış
    if (to.scene === 'exterior' || to.scene === 'intro') {
      const top = from.scene === 'interior' ? el.int : el.am;
      closePanels(false);
      showScene(el.ext);
      el.ext.classList.add('is-moving', 'ui-out');
      const f = from.scene === 'interior' && from.floor != null ? floorByNumber(from.floor) : null;
      const hs = from.scene === 'amenity' ? data.exterior.hotspots.find((h) => h.amenity === from.group) : null;
      if (d.move && f) ext.apply({ cx: f.target.x, cy: f.target.y, z: 2.5 });
      else if (d.move && hs) ext.apply({ cx: hs.anchor[0], cy: hs.anchor[1], z: 1.9 });
      else ext.apply(ext.home(to.scene === 'intro' ? INTRO_Z : 1));
      updateExteriorUI(to.scene === 'exterior' ? to : { ...to, floor: null });
      const fade = d.fade ? ctx.track(top.animate([{ opacity: 1 }, { opacity: 0 }], { duration: Math.round(d.fade * 0.85), easing: 'ease-in', fill: 'forwards' })) : null;
      await settle(fade);
      hideScene(top);
      fade?.cancel();
      if (to.scene === 'intro') {
        el.intro.hidden = false; el.intro.inert = false;
        setScene('intro');
        const a = d.fade ? ctx.track(el.intro.animate([{ opacity: 0 }, { opacity: 1 }], { duration: d.fade })) : null;
        await Promise.all([settle(a), settle(ctx.track(ext.animateTo(introView(), { duration: d.move, easing: EASE_IO })))]);
      } else {
        setScene('exterior');
        el.ext.classList.remove('ui-out');
        await settle(ctx.track(ext.animateTo(ext.home(1), { duration: Math.round(d.move * 0.9), easing: EASE_IO })));
      }
      el.ext.classList.remove('is-moving');
      return;
    }
  }

  async function revealScene(section, ctx, d, beforeFade, { scaleFrom = 1, stage = null }) {
    showScene(section);
    section.style.opacity = '0';
    if (beforeFade) await beforeFade();
    setScene(section === el.int ? 'interior' : 'amenity');
    const anims = [];
    if (d.fade) anims.push(ctx.track(section.animate([{ opacity: 0 }, { opacity: 1 }], { duration: d.fade, easing: 'ease-out', fill: 'forwards' })));
    if (stage && scaleFrom !== 1 && d.move) anims.push(ctx.track(stage.animate([{ transform: `scale(${scaleFrom})` }, { transform: 'scale(1)' }], { duration: d.move, easing: EASE_OUT })));
    section.style.opacity = '';
    if (!d.fade) section.style.opacity = '1';
    await Promise.all(anims.map(settle));
    anims.forEach((a) => { try { if (a.effect?.getComputedTiming().fill === 'forwards') a.cancel(); } catch { /* yoksay */ } });
    section.style.opacity = '';
  }

  function setScene(name) { root.dataset.scene = name; }
  function showScene(section) { if (!section) return; section.hidden = false; section.inert = false; }
  function hideScene(section) { if (!section) return; section.hidden = true; section.inert = true; section.style.opacity = ''; }
  function hideIntro() { el.intro.hidden = true; el.intro.inert = true; }

  // ——— İç mekân içerikleri ———
  function interiorSpec(s) {
    const type = typeById(s.type);
    const room = type.rooms[s.room];
    const view = room.views.find((v) => v.id === s.view);
    const isDecor = room.decor === view.id;
    return { kind: 'interior', type, room, view, focus: view.focus, decor: isDecor ? decor.get(type.id) : null, key: `${s.type}/${s.room}/${s.view}` };
  }

  async function buildInterior(spec) {
    const src = pickSrc(spec.view.img);
    const tasks = [imageElement(src, 'base', spec.view.img.alt)];
    if (spec.decor) {
      const L = data.decor.layers[spec.type.id];
      const c = L.curtain[spec.decor.curtain], f = L.sofa[spec.decor.sofa];
      tasks.push(c ? imageElement(c, 'layer layer-curtain') : Promise.resolve(null));
      tasks.push(f ? imageElement(f, 'layer layer-sofa') : Promise.resolve(null));
    }
    const imgs = (await Promise.all(tasks)).filter(Boolean);
    const hsLayer = document.createElement('div');
    hsLayer.className = 'hs-layer';
    for (const h of spec.view.hotspots) hsLayer.appendChild(makeHotspot(h));
    return [...imgs, hsLayer];
  }

  function makeHotspot(h) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `hs hs-${h.kind}`;
    b.style.left = h.x * 100 + '%';
    b.style.top = h.y * 100 + '%';
    b.dataset.x = String(h.x);
    b.dataset.y = String(h.y);
    b.dataset.label = h.kind === 'info' ? h.title : h.label;
    if (h.kind === 'info') {
      b.innerHTML = `<span class="hs-ring">${ICON.info}</span><span class="hs-tip"></span>`;
      b.querySelector('.hs-tip').textContent = h.title;
      b.setAttribute('aria-label', 'Bilgi: ' + h.title);
      b.setAttribute('aria-expanded', 'false');
      b.addEventListener('click', () => openHotspotCard(h, b));
    } else if (h.kind === 'go') {
      b.innerHTML = `<span class="hs-pill"><span></span>${ICON.go}</span>`;
      b.querySelector('.hs-pill span').textContent = h.label;
      b.addEventListener('click', () => go({ ...state, room: h.to.room, view: h.to.view }));
    } else if (h.kind === 'zoom') {
      b.innerHTML = `<span class="hs-pill">${ICON.zoom}<span></span></span>`;
      b.querySelector('.hs-pill span').textContent = h.label;
      b.addEventListener('click', () => zoomTo(h.rect));
    }
    return b;
  }

  function zoomTo(rect) {
    const f = interior.front;
    if (!f || tm.running) return;
    closePanels(false);
    el.int.classList.add('is-moving');
    const a = f.stage.animateTo(f.stage.fitRect(rect), { duration: reduceMotion.matches ? 0 : 750, easing: EASE_IO });
    settle(a).then(() => { el.int.classList.remove('is-moving'); });
    setZoomed(true);
  }
  function zoomOut() {
    const f = interior.front;
    if (!f) return;
    el.int.classList.add('is-moving');
    const a = f.stage.animateTo(f.stage.home(1), { duration: reduceMotion.matches ? 0 : 650, easing: EASE_IO });
    settle(a).then(() => { el.int.classList.remove('is-moving'); });
    setZoomed(false);
  }
  function setZoomed(z) {
    zoomed = z;
    el.zoomOut.hidden = !z;
    if (z) requestAnimationFrame(() => el.zoomOut.focus({ preventScroll: true }));
  }

  function updateInteriorUI(s) {
    const type = typeById(s.type);
    const room = type.rooms[s.room];
    $$('[data-room]', el.roomList).forEach((b) => b.setAttribute('aria-current', String(b.dataset.room === s.room)));
    el.viewTabs.replaceChildren(...room.views.map((v) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'view-tab'; b.textContent = v.label;
      b.setAttribute('aria-pressed', String(v.id === s.view));
      b.addEventListener('click', () => go({ ...state, view: v.id }));
      return b;
    }));
    el.viewTabs.hidden = room.views.length < 2;
    el.decorToggle.hidden = !room.decor;
    $('[data-room-eyebrow]', el.roomInfo).textContent = `${s.floor != null ? s.floor + '. kat · ' : ''}${type.title} · örnek daire`;
    $('[data-room-title]', el.roomInfo).textContent = room.label;
    $('[data-room-intro]', el.roomInfo).textContent = room.intro;
    const kn = $('[data-kitchen-note]', el.roomInfo);
    kn.hidden = s.room !== 'mutfak' && s.room !== 'salon';
    kn.textContent = type.kitchenNote;
    const sh = $('[data-room-shared]', el.roomInfo);
    sh.hidden = !room.shared;
    sh.textContent = room.shared || '';
    if (openPanel === 'decor' && !room.decor) closePanels(false);
    syncDecorControls(s.type);
  }

  function afterInteriorShown() {
    invalidateEdges();
  }

  // ——— Kenar okları: ekran dışında kalan bilgi/geçiş noktalarını gösterir ———
  // Yalnızca kaydırarak ulaşılabilen noktalar için ok çizilir; oka dokununca kamera o noktaya kayar.
  const edgeLayer = document.createElement('div');
  edgeLayer.className = 'edge-layer';
  edgeLayer.setAttribute('role', 'group');
  edgeLayer.setAttribute('aria-label', 'Ekran dışındaki noktalar');
  el.int.appendChild(edgeLayer);
  let edgeRect = null;
  let edgeRaf = 0;
  let edgeKey = '';
  interior.onMove = () => scheduleEdges();
  function invalidateEdges() { edgeRect = null; scheduleEdges(); }
  function scheduleEdges() {
    if (edgeRaf) return;
    edgeRaf = requestAnimationFrame(() => { edgeRaf = 0; updateEdges(); });
  }
  /** Görselin kontrollerle örtülmeyen, gerçekten görünen alanı (ekran koordinatı). */
  function visibleRect() {
    if (edgeRect) return edgeRect;
    const vw = window.innerWidth, vh = window.innerHeight;
    const nav = $('.room-nav', el.int).getBoundingClientRect();
    const dock = $('.int-dock', el.int).getBoundingClientRect();
    const cta = el.infoCta.getBoundingClientRect();
    let right = vw, bottom = Math.min(dock.top, cta.top, vh);
    if (openPanel) {
      const pr = panels[openPanel].getBoundingClientRect();
      if (pr.left > vw * 0.35) right = pr.left; else bottom = Math.min(bottom, pr.top);
    }
    edgeRect = { left: 0, top: nav.bottom, right, bottom };
    return edgeRect;
  }
  function updateEdges() {
    const f = interior.front;
    if (!f || state.scene !== 'interior' || decorMode || tm.running) { if (edgeKey) { edgeLayer.replaceChildren(); edgeKey = ''; } return; }
    const R = visibleRect();
    const M = 14; // kenar payı
    const st = f.stage;
    const vpr = f.vp.getBoundingClientRect();
    const s = st.s0 * st.v.z;
    const items = [];
    for (const hs of f.st.querySelectorAll('.hs')) {
      const X = Number(hs.dataset.x) * st.w, Y = Number(hs.dataset.y) * st.h;
      const p = st.toScreen(X, Y);
      const x = vpr.left + p.x, y = vpr.top + p.y;
      if (x >= R.left + M && x <= R.right - M && y >= R.top + M && y <= R.bottom - M) continue; // görünüyor
      // Ulaşılabilir mi? Nokta merkeze alınmaya çalışıldığında görünür alana giriyorsa evet.
      const c = st.clamp({ cx: X, cy: Y, z: st.v.z });
      const ax = vpr.left + st.vw / 2 + (X - c.cx) * s, ay = vpr.top + st.vh / 2 + (Y - c.cy) * s;
      if (!(ax >= R.left + M && ax <= R.right - M && ay >= R.top + M && ay <= R.bottom - M)) continue;
      const left = x < R.left + M, right = x > R.right - M;
      const side = left ? 'left' : right ? 'right' : (y < R.top + M ? 'top' : 'bottom');
      const ex = Math.min(Math.max(x, R.left + 22), R.right - 22);
      const ey = Math.min(Math.max(y, R.top + 22), R.bottom - 22);
      items.push({ hs, X, Y, side, ex, ey });
    }
    // Her kenarda tek ok: kenardaki noktalar gruplanır, ok en yakın noktaya götürür (kalabalığı önler)
    const groups = [];
    for (const sd of ['left', 'right', 'top', 'bottom']) {
      const list = items.filter((i) => i.side === sd);
      if (!list.length) continue;
      const cx = st.v.cx, cy = st.v.cy;
      list.sort((p, q) => Math.hypot(p.X - cx, p.Y - cy) - Math.hypot(q.X - cx, q.Y - cy));
      const near = list[0];
      const ey = sd === 'left' || sd === 'right' ? list.reduce((s, i) => s + i.ey, 0) / list.length : near.ey;
      groups.push({ ...near, ey, count: list.length });
    }
    const key = groups.map((i) => `${i.hs.dataset.label}|${i.side}|${i.count}|${Math.round(i.ex / 8)}|${Math.round(i.ey / 8)}`).join(';');
    if (key === edgeKey) return;
    edgeKey = key;
    edgeLayer.replaceChildren(...groups.map((i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'edge-arrow edge-' + i.side;
      const label = i.hs.dataset.label || 'Nokta';
      const text = i.count > 1 ? i.count + ' nokta' : (label.length > 16 ? label.slice(0, 15) + '…' : label);
      btn.setAttribute('aria-label', i.count > 1 ? `Bu yönde ekran dışında ${i.count} nokta; en yakını: ${label}` : `Ekran dışında: ${label} — oraya kaydır`);
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span>';
      btn.querySelector('span').textContent = text;
      if (i.side === 'left') { btn.style.left = (R.left + 8) + 'px'; btn.style.top = i.ey + 'px'; }
      else if (i.side === 'right') { btn.style.right = (window.innerWidth - R.right + 8) + 'px'; btn.style.top = i.ey + 'px'; }
      else { btn.style.left = i.ex + 'px'; btn.style.top = (i.side === 'top' ? R.top + 8 : R.bottom - 8) + 'px'; }
      btn.addEventListener('click', () => panToHotspot(i.hs, i.X, i.Y));
      return btn;
    }));
  }
  function panToHotspot(hs, X, Y) {
    const f = interior.front;
    if (!f || tm.running) return;
    el.int.classList.add('is-moving');
    const a = f.stage.animateTo({ cx: X, cy: Y, z: f.stage.v.z }, { duration: reduceMotion.matches ? 0 : 520, easing: EASE_IO });
    settle(a).then(() => {
      el.int.classList.remove('is-moving');
      if (!hs.isConnected) return;
      hs.classList.add('hs-pulse');
      setTimeout(() => hs.classList.remove('hs-pulse'), 1700);
      hs.focus({ preventScroll: true });
      scheduleEdges();
    });
  }

  // ——— Paneller (tek seferde bir panel) ———
  const panels = { info: el.roomInfo, decor: el.decorPanel, hs: el.hsCard };
  const toggles = { info: el.infoToggle, decor: el.decorToggle };
  function openPanelById(id, opener, focus = true) {
    closePanels(false);
    panels[id].hidden = false;
    openPanel = id;
    panelOpener = opener;
    if (toggles[id]) toggles[id].setAttribute('aria-expanded', 'true');
    root.classList.add('sheet-open');
    invalidateEdges();
    if (id === 'decor') decorLayout(true);
    if (focus) requestAnimationFrame(() => $('[data-close-panel]', panels[id])?.focus({ preventScroll: true }));
  }
  function closePanels(restoreFocus = true) {
    if (!openPanel) return;
    const id = openPanel;
    panels[id].hidden = true;
    if (toggles[id]) toggles[id].setAttribute('aria-expanded', 'false');
    if (id === 'decor') decorLayout(false);
    $$('.hs-info[aria-expanded="true"]', el.int).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    openPanel = null;
    root.classList.remove('sheet-open');
    invalidateEdges();
    if (restoreFocus && panelOpener && panelOpener.isConnected) panelOpener.focus({ preventScroll: true });
    panelOpener = null;
  }
  /**
   * Dekorasyon modu: salon görselinin TAMAMI panelin yanındaki/üstündeki boş alana sığdırılır,
   * böylece perde ve koltuk hiçbir zaman panelin altında kalmaz.
   */
  let decorMode = false;
  function decorLayout(on) {
    const box = $('[data-buffers]', el.int);
    decorMode = on;
    el.int.classList.toggle('decor-mode', on);
    if (on) {
      const vw = window.innerWidth, vh = window.innerHeight;
      const pr = el.decorPanel.getBoundingClientRect();
      const nav = $('.room-nav', el.int).getBoundingClientRect();
      const wide = pr.left > vw * 0.35 && pr.width < vw * 0.7; // yan panel (masaüstü, yatay telefon) / alt panel (dikey)
      const top = Math.round(nav.bottom + 8);
      const right = wide ? Math.round(vw - pr.left + 12) : 0;
      const bottom = wide ? Math.round(vh - Math.min(el.infoCta.getBoundingClientRect().top, $('.int-dock', el.int).getBoundingClientRect().top) + 8) : Math.round(vh - pr.top + 4);
      const safeBottom = Math.min(Math.max(bottom, 0), vh - top - 120);
      Object.assign(box.style, { top: top + 'px', right: right + 'px', bottom: safeBottom + 'px', left: '0px' });
    } else {
      Object.assign(box.style, { top: '', right: '', bottom: '', left: '' });
    }
    for (const b of interior.buffers) { b.stage.fit = on ? 'contain' : 'cover'; }
    const f = interior.front;
    for (const b of interior.buffers) if (b !== f) { b.stage.measure(); b.stage.apply(b.stage.home(1)); }
    if (f) {
      const prev = f.stage.transformOf(f.stage.v);
      f.stage.stop();
      f.stage.measure();
      const target = f.stage.clamp(f.stage.home(1));
      f.stage.v = target;
      const next = f.stage.transformOf(target);
      f.stage.el.style.setProperty('--inv', (1 / (f.stage.s0 * target.z)).toFixed(5));
      if (!reduceMotion.matches && f.stage.el.animate) {
        const a = f.stage.el.animate([{ transform: prev }, { transform: next }], { duration: 420, easing: EASE_IO });
        f.stage.el.style.transform = next;
        settle(a);
      } else f.stage.el.style.transform = next;
    }
    setZoomed(false);
  }

  function openHotspotCard(h, btn) {
    if (openPanel === 'hs' && panelOpener === btn) { closePanels(); return; }
    $('[data-hs-title]', el.hsCard).textContent = h.title;
    $('[data-hs-text]', el.hsCard).textContent = h.text;
    openPanelById('hs', btn);
    btn.setAttribute('aria-expanded', 'true');
  }
  $$('[data-close-panel]', root).forEach((b) => b.addEventListener('click', () => closePanels()));
  el.infoToggle.addEventListener('click', () => (openPanel === 'info' ? closePanels() : openPanelById('info', el.infoToggle)));
  el.decorToggle.addEventListener('click', async () => {
    if (openPanel === 'decor') { closePanels(); return; }
    const room = typeById(state.type).rooms[state.room];
    if (room.decor && state.view !== room.decor) await go({ ...state, view: room.decor });
    openPanelById('decor', el.decorToggle);
  });

  // ——— Dekorasyon ———
  const decorEls = {
    pkgs: $$('input[name="decor-package"]', el.decorPanel),
    curtains: $$('input[name="decor-curtain"]', el.decorPanel),
    sofas: $$('input[name="decor-sofa"]', el.decorPanel),
    desc: $('[data-decor-desc]', el.decorPanel),
    reset: $('[data-decor-reset]', el.decorPanel),
    loading: $('[data-decor-loading]', el.decorPanel)
  };
  function syncDecorControls(type = state.type) {
    if (!type) return;
    const s = decor.get(type);
    decorEls.pkgs.forEach((i) => { i.checked = i.value === s.package; });
    decorEls.curtains.forEach((i) => { i.checked = i.value === s.curtain; });
    decorEls.sofas.forEach((i) => { i.checked = i.value === s.sofa; });
    const p = data.decor.packages.find((x) => x.id === s.package);
    const cLabel = data.decor.curtains.find((c) => c.id === s.curtain)?.label;
    const fLabel = data.decor.sofas.find((c) => c.id === s.sofa)?.label;
    decorEls.desc.textContent = p ? `${p.label}: ${p.description}` : `Özel kombinasyon: ${cLabel} perde, ${fLabel.toLowerCase()} koltuk.`;
    decorEls.reset.disabled = decor.isDefault(type);
  }
  decorEls.pkgs.forEach((i) => i.addEventListener('change', () => { if (i.value !== 'ozel') decor.applyPackage(state.type, i.value); }));
  decorEls.curtains.forEach((i) => i.addEventListener('change', () => decor.setCurtain(state.type, i.value)));
  decorEls.sofas.forEach((i) => i.addEventListener('change', () => decor.setSofa(state.type, i.value)));
  decorEls.reset.addEventListener('click', () => decor.reset(state.type));

  // Görsel katmanları durumla eşitler (yeni katman yüklenmeden eskisi kaldırılmaz)
  let decorToken = 0;
  decor.subscribe(async (type, s) => {
    syncDecorControls(type);
    const f = interior.front;
    if (!f || !f.spec || f.spec.type.id !== type || !f.spec.decor) return;
    const token = ++decorToken;
    const L = data.decor.layers[type];
    decorEls.loading.hidden = false;
    try {
      await Promise.all([swapLayer(f, 'curtain', L.curtain[s.curtain] || null, token), swapLayer(f, 'sofa', L.sofa[s.sofa] || null, token)]);
      f.spec.decor = { curtain: s.curtain, sofa: s.sofa };
    } catch (e) {
      console.warn(e);
      showToast('Dekorasyon görseli yüklenemedi. Önceki görünüm korunuyor.');
    } finally {
      if (token === decorToken) decorEls.loading.hidden = true;
    }
  });

  async function swapLayer(buf, kind, src, token) {
    const cls = 'layer-' + kind;
    const current = buf.st.querySelector('.' + cls + ':not(.is-leaving)');
    if ((current?.getAttribute('src') || null) === src) return;
    const dur = reduceMotion.matches ? 120 : 300;
    let incoming = null;
    if (src) {
      incoming = await imageElement(src, 'layer ' + cls);
      if (token !== decorToken || !buf.st.isConnected || interior.front !== buf) return;
      const anchor = kind === 'curtain' ? (buf.st.querySelector('.layer-sofa') || buf.st.querySelector('.hs-layer')) : buf.st.querySelector('.hs-layer');
      buf.st.insertBefore(incoming, anchor);
      incoming.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, easing: 'ease-out' });
    }
    if (current) {
      current.classList.add('is-leaving');
      const a = current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: 'ease-in', fill: 'forwards' });
      await settle(a);
      current.remove();
    }
  }

  // ——— Sosyal olanak içerikleri ———
  function amenitySpec(s) {
    const item = data.amenities.items[s.item];
    return { kind: 'amenity', item, focus: [0.5, 0.5], key: s.item };
  }
  async function buildAmenity(spec) {
    return [await imageElement(pickSrc(spec.item.img, 1.05), 'base', spec.item.img.alt)];
  }
  function updateAmenityUI(s) {
    const g = groupById(s.group);
    const item = data.amenities.items[s.item];
    el.amGroups.replaceChildren(...data.amenities.groups.map((gr) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'am-group-btn'; b.textContent = gr.label;
      b.setAttribute('aria-current', String(gr.id === s.group));
      b.addEventListener('click', () => { if (gr.id !== state.group) go({ ...state, group: gr.id, item: gr.items[0] }); });
      return b;
    }));
    el.amGroup.textContent = g.label;
    el.amTabs.replaceChildren(...g.items.map((id) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'am-tab'; b.textContent = data.amenities.items[id].title;
      b.setAttribute('aria-pressed', String(id === s.item));
      b.addEventListener('click', () => { if (id !== state.item) go({ ...state, item: id }); });
      return b;
    }));
    el.amTabs.hidden = g.items.length < 2;
    el.amTitle.textContent = item.title;
    el.amText.textContent = item.text;
    el.amNote.hidden = !g.note;
    el.amNote.textContent = g.note || '';
    el.amSource.textContent = item.source;
    el.amAppt.dataset.amenity = item.title;
  }

  // ——— Dış cephe arayüzü ———
  const floorPolys = new Map($$('.floor', el.ext).map((p) => [Number(p.dataset.floor), p]));
  function selectedType() {
    return ($('input[name="apt-type"]:checked', el.typeChoice) || {}).value || 'acik';
  }
  function updateExteriorUI(s) {
    floorPolys.forEach((p, n) => p.classList.toggle('is-selected', n === s.floor));
    el.floorSelect.value = s.floor != null ? String(s.floor) : '';
    el.floorTitle.textContent = s.floor != null ? `${s.floor}. kat` : 'Bir kat seçin';
    el.floorHint.textContent = s.floor != null ? 'Örnek daire tipini seçip keşfe başlayın.' : 'Binanın üzerindeki bir kata dokunun veya aşağıdan seçin.';
    el.typeChoice.disabled = s.floor == null;
    el.enter.disabled = s.floor == null;
    if (s.type) { const r = $(`input[name="apt-type"][value="${s.type}"]`, el.typeChoice); if (r) r.checked = true; }
    if (s.floor != null) preloadInterior(selectedType());
  }
  function preloadInterior(typeId) {
    const t = typeById(typeId);
    const v = t.rooms.salon.views[0];
    loadImage(pickSrc(v.img)).catch(() => {});
  }
  let lastRequestedFloor = null;
  function selectFloor(n) {
    if (state.scene !== 'exterior') return;
    lastRequestedFloor = n;
    go({ ...state, floor: n, type: selectedType() }, { history: 'auto' });
  }
  function setEnterBusy(b) {
    el.enter.setAttribute('aria-busy', String(b));
    el.enterLabel.textContent = b ? 'Yükleniyor…' : 'Daireyi keşfet';
  }

  // Kat çokgenleri: masaüstünde hover, her cihazda tıklama/dokunma
  const svg = $('.ext-svg', el.ext);
  svg.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const p = e.target.closest('.floor');
    const a = e.target.closest('.amenity-area');
    if (p) { p.classList.add('is-hover'); showFloorTip(Number(p.dataset.floor)); }
    if (a) { a.classList.add('is-hover'); $(`[data-amenity-hs="${a.dataset.amenityArea}"]`, el.ext)?.classList.add('is-hover'); }
  });
  svg.addEventListener('pointerout', (e) => {
    const p = e.target.closest('.floor');
    const a = e.target.closest('.amenity-area');
    if (p) { p.classList.remove('is-hover'); hideFloorTip(); }
    if (a) { a.classList.remove('is-hover'); $(`[data-amenity-hs="${a.dataset.amenityArea}"]`, el.ext)?.classList.remove('is-hover'); }
  });
  svg.addEventListener('click', (e) => {
    if (state.scene !== 'exterior') return;
    const p = e.target.closest('.floor');
    if (p) { selectFloor(Number(p.dataset.floor)); return; }
    const a = e.target.closest('.amenity-area');
    if (a) { const hs = data.exterior.hotspots.find((h) => h.id === a.dataset.amenityArea); openAmenity(hs.amenity); }
  });
  $$('[data-amenity-hs]', el.ext).forEach((b) => {
    const area = $(`[data-amenity-area="${b.dataset.amenityHs}"]`, el.ext);
    b.addEventListener('pointerenter', () => area?.classList.add('is-hover'));
    b.addEventListener('pointerleave', () => area?.classList.remove('is-hover'));
    b.addEventListener('focus', () => area?.classList.add('is-hover'));
    b.addEventListener('blur', () => area?.classList.remove('is-hover'));
    b.addEventListener('click', () => openAmenity(b.dataset.amenity));
  });
  function openAmenity(groupId) {
    const g = groupById(groupId);
    go({ scene: 'amenity', group: g.id, item: g.items[0], floor: state.floor });
  }
  $('[data-amenity-hub]', el.ext).addEventListener('click', () => openAmenity('hizmetler'));

  function showFloorTip(n) {
    const f = floorByNumber(n);
    if (!f || ext.anim) return;
    const p = ext.toScreen(f.bbox.x + f.bbox.w, f.target.y);
    el.floorTip.textContent = `${n}. kat`;
    el.floorTip.style.transform = `translate(${Math.round(p.x + 12)}px, ${Math.round(p.y - 14)}px)`;
    el.floorTip.classList.add('is-on');
  }
  function hideFloorTip() { el.floorTip?.classList.remove('is-on'); }

  el.floorSelect.addEventListener('change', () => { const v = el.floorSelect.value; if (v) selectFloor(Number(v)); });
  $$('[data-floor-step]', el.ext).forEach((b) => b.addEventListener('click', () => {
    const step = Number(b.dataset.floorStep);
    const list = catalog.floors; // 30 → 3
    const known = tm.running && lastRequestedFloor != null ? lastRequestedFloor : state.floor;
    const cur = known ?? (step > 0 ? list[list.length - 1] - 1 : list[0] + 1);
    const next = Math.min(list[0], Math.max(list[list.length - 1], cur + step));
    selectFloor(next);
  }));
  $$('input[name="apt-type"]', el.typeChoice).forEach((r) => r.addEventListener('change', () => {
    if (state.scene === 'exterior' && state.floor != null) go({ ...state, type: r.value });
  }));
  el.enter.addEventListener('click', () => {
    if (state.floor == null || tm.running) return;
    setEnterBusy(true);
    go({ scene: 'interior', floor: state.floor, type: selectedType(), room: 'salon', view: typeById(selectedType()).rooms.salon.views[0].id });
  });

  // ——— Genel kontroller ———
  $('[data-action="start"]', root).addEventListener('click', () => go({ scene: 'exterior' }));
  $$('[data-room]', el.roomList).forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.room === state.room) return;
    go({ ...state, room: b.dataset.room, view: null });
  }));
  el.zoomOut.addEventListener('click', zoomOut);
  $('[data-action="back-to-building"]', root).addEventListener('click', () => goUp());
  el.back.addEventListener('click', () => goUp());

  /** Sahne içi geri: bir üst seviye; geçmişte zaten oradan geldiysek tarayıcı geçmişini kullan. */
  function goUp() {
    if (zoomed) { zoomOut(); return; }
    const parent = normalizeState(parentState(state), catalog);
    const ps = serializeState(parent);
    if (history.state && history.state.incek && history.state.prev === ps) { history.back(); return; }
    go(parent);
  }

  function updateChrome(s) {
    setScene(s.scene);
    el.back.hidden = s.scene === 'intro';
    el.backLabel.textContent = s.scene === 'exterior' ? 'Giriş' : 'Bina';
    el.back.setAttribute('aria-label', s.scene === 'exterior' ? 'Açılış ekranına dön' : 'Binaya dön');
    const t = s.type ? typeById(s.type) : null;
    let crumb = '';
    if (s.scene === 'exterior') crumb = s.floor != null ? `<strong>${s.floor}. kat</strong> · temsili seçim` : 'Kat seçimi';
    if (s.scene === 'interior') crumb = `${s.floor != null ? s.floor + '. kat · ' : ''}${t.short} · <strong>${t.rooms[s.room].label}</strong>`;
    if (s.scene === 'amenity') crumb = `Sosyal olanaklar · <strong>${groupById(s.group).label}</strong>`;
    el.crumb.innerHTML = crumb;
    el.infoCta.href = data.infoUrl + (s.scene === 'amenity' ? '#olanaklar' : s.scene === 'interior' ? '#daire-tipleri' : '');
    const label = s.scene === 'intro' ? 'İncek Premium' : s.scene === 'exterior' ? 'Kat seçimi' : s.scene === 'interior' ? `${t.rooms[s.room].label} — ${t.title}` : data.amenities.items[s.item].title;
    document.title = `${label} · İncek Premium`;
  }

  // ——— Tarayıcı geçmişi ———
  window.addEventListener('popstate', () => {
    go(parseState(location.search, catalog), { history: 'none' });
  });

  // ——— Klavye ———
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || document.querySelector('dialog[open]')) return;
    if (openPanel) { e.preventDefault(); closePanels(); return; }
    if (zoomed) { e.preventDefault(); zoomOut(); }
  });

  // ——— Boyut / yön değişimi ———
  let rz = 0;
  const onResize = () => {
    if (rz) return;
    rz = requestAnimationFrame(() => {
      rz = 0;
      ext.resize();
      if (decorMode) decorLayout(true); else interior.resize();
      invalidateEdges();
      amenity.resize();
      hideFloorTip();
    });
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  // ——— Bildirim ———
  let toastTimer = 0;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, 6000);
  }

  // ——— Başlangıç ———
  const initial = parseState(location.search, catalog);
  history.replaceState({ incek: 1, prev: history.state?.prev ?? null }, '', location.pathname + serializeState(initial));
  ext.apply(introView());
  updateChrome(INTRO);
  if (initial.scene !== 'intro') {
    if (initial.scene === 'exterior') { el.intro.hidden = true; el.intro.inert = true; }
    go(initial, { history: 'none', instant: true });
  }
  window.__incekExplore = { go, get state() { return state; }, tm, decor };
}
