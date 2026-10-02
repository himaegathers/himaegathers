(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- falling leaves (Himaé palette) ---------- */
  const palette = ['#c8694a', '#85856a', '#e0bc96', '#d9a252', '#5f6b4f', '#d6865a'];
  const shapes = [
    // pointed leaf with midrib
    '<path d="M12 1C20 8 21 19 12 31C3 19 4 8 12 1Z" fill="currentColor"/><path d="M12 6V28" stroke="rgba(255,255,255,.35)" stroke-width="1" fill="none"/>',
    // round petal
    '<path d="M12 2C20 8 20 22 12 29C4 22 4 8 12 2Z" fill="currentColor"/>',
    // slim leaf
    '<path d="M12 1C17 10 17 22 12 31C7 22 7 10 12 1Z" fill="currentColor"/><path d="M12 8V27" stroke="rgba(255,255,255,.3)" stroke-width="1" fill="none"/>'
  ];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function makeLeaves() {
    const wrap = document.getElementById('leaves');
    if (!wrap || reduce) return;
    wrap.textContent = '';
    const w = innerWidth;
    const count = w < 480 ? 12 : w < 900 ? 16 : 24;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('span');
      const size = rand(w < 480 ? 12 : 14, w < 480 ? 24 : 30);
      const dur = rand(11, 22);
      leaf.className = 'leaf';
      leaf.style.cssText =
        `--x:${rand(-2, 100).toFixed(1)}%;--s:${size.toFixed(1)}px;--o:${rand(.55, .9).toFixed(2)};` +
        `--d:${dur.toFixed(1)}s;--dl:${(-rand(0, dur)).toFixed(1)}s;--sd:${rand(2.4, 4.6).toFixed(1)}s;` +
        `--sw:${rand(14, 46).toFixed(0)}px;--r:${rand(25, 80).toFixed(0)}deg;--drift:${rand(-60, 90).toFixed(0)}px;` +
        `color:${pick(palette)}`;
      leaf.innerHTML = `<svg viewBox="0 0 24 32" aria-hidden="true">${pick(shapes)}</svg>`;
      frag.appendChild(leaf);
    }
    wrap.appendChild(frag);
  }
  makeLeaves();

  // rebuild only when the width bracket changes (avoids flicker on mobile scroll/URL-bar resize)
  const bracket = () => (innerWidth < 480 ? 0 : innerWidth < 900 ? 1 : 2);
  let last = bracket(), t;
  addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { const b = bracket(); if (b !== last) { last = b; makeLeaves(); } }, 250);
  });

  /* ---------- gentle parallax on the floral corners (mouse devices only) ---------- */
  const tl = document.querySelector('.f-tl'), br = document.querySelector('.f-br');
  if (!reduce && tl && br && matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      tl.style.translate = `${x * -12}px ${y * -12}px`;
      br.style.translate = `${x * 12}px ${y * 12}px`;
    }, { passive: true });
  }

  /* ---------- soft ripple on press ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', e => {
      if (reduce) return;
      const r = btn.getBoundingClientRect(), s = document.createElement('span');
      s.style.cssText = `position:absolute;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:10px;height:10px;margin:-5px;border-radius:50%;background:rgba(255,255,255,.55);transform:scale(0);opacity:1;transition:transform .6s,opacity .6s;pointer-events:none`;
      btn.appendChild(s);
      requestAnimationFrame(() => { s.style.transform = 'scale(34)'; s.style.opacity = '0'; });
      setTimeout(() => s.remove(), 650);
    });
  });
})();
