/** Yazılı bilgiler sayfası: keşfe dönüş, galeri filtresi ve lightbox. */
import { safeStorage } from '../lib/storage.js';

export function initInfo() {
  // “Görsel keşfe dön”: son keşif durumunu (kat, tip, oda) korur
  const session = safeStorage('session');
  const last = session.get('incek-son-kesif');
  if (last && /^\?s=(bina|daire|olanak)(&[\w=%-]*)*$/.test(last)) {
    document.querySelectorAll('[data-return-explore]').forEach((a) => {
      a.href = a.getAttribute('href').split('?')[0] + last;
    });
  }

  // Galeri filtresi (JS yoksa bütün görseller görünür kalır)
  const filters = document.querySelector('[data-gallery-filters]');
  const items = Array.from(document.querySelectorAll('[data-gallery] .g-item'));
  if (filters) {
    filters.hidden = false;
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const f = btn.dataset.filter;
      filters.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      items.forEach((li) => { li.hidden = f !== 'all' && li.dataset.cat !== f; });
    });
  }

  // Lightbox: klavye (←/→/Esc), odak yönetimi, görünür öğeler arasında gezinme
  const dlg = document.getElementById('lightbox');
  if (!dlg) return;
  const img = dlg.querySelector('.lb-img');
  const cap = dlg.querySelector('.lb-cap');
  let list = [];
  let idx = 0;
  let opener = null;

  function show(i) {
    idx = (i + list.length) % list.length;
    const a = list[idx];
    img.classList.add('is-loading');
    const pre = new Image();
    pre.onload = pre.onerror = () => {
      img.src = a.dataset.full;
      img.alt = a.dataset.alt || '';
      img.classList.remove('is-loading');
    };
    pre.src = a.dataset.full;
    cap.textContent = `${a.dataset.caption} · ${idx + 1} / ${list.length}`;
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-lightbox]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    list = items.filter((li) => !li.hidden).map((li) => li.querySelector('[data-lightbox]'));
    opener = a;
    dlg.showModal();
    show(list.indexOf(a));
    dlg.querySelector('.lb-close').focus();
  });
  dlg.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
  dlg.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
  dlg.querySelector('.lb-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
  });
  dlg.addEventListener('close', () => { img.removeAttribute('src'); opener?.focus(); });
}
