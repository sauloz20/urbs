/* URBS V19.8 — autoplay contínuo; não interfere nos demais carrosséis. */
(() => {
  'use strict';
  const viewport = document.getElementById('evolution-viewport');
  const track = viewport?.querySelector('.evolution-track');
  if (!viewport || !track) return;
  const originals = [...track.querySelectorAll('.evolution-card')];
  if (!originals.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  originals.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    clone.tabIndex = -1;
    track.appendChild(clone);
  });
  let period = 0, offset = 0, last = 0, pause = 0, drag = false, moved = false;
  let initialX = 0, initialOffset = 0, visible = true, frame = 0;
  const wrap = (value) => period ? ((value % period) + period) % period : 0;
  const measure = () => {
    period = track.children[originals.length].offsetLeft - originals[0].offsetLeft;
    offset = wrap(offset);
    viewport.scrollLeft = offset;
  };
  const tick = (now) => {
    frame = requestAnimationFrame(tick);
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0;
    last = now;
    if (reduced || !visible || document.hidden || drag || now < pause ||
        viewport.matches(':hover') || viewport.matches(':focus-within')) return;
    offset = wrap(offset + dt * 34);
    viewport.scrollLeft = offset;
  };
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = true; moved = false; initialX = event.clientX; initialOffset = offset;
  });
  viewport.addEventListener('pointermove', (event) => {
    if (!drag || !period) return;
    const dx = event.clientX - initialX;
    if (Math.abs(dx) > 6) moved = true;
    if (moved) { offset = wrap(initialOffset - dx); viewport.scrollLeft = offset; }
  });
  const end = () => { if (drag) { drag = false; pause = performance.now() + 1100; last = 0; } };
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  viewport.addEventListener('click', (event) => {
    if (moved) { event.preventDefault(); event.stopPropagation(); moved = false; }
  }, true);
  viewport.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    offset = wrap(offset + (event.key === 'ArrowRight' ? 1 : -1) * (originals[0].offsetWidth + 20));
    viewport.scrollLeft = offset;
    pause = performance.now() + 1800;
  });
  const intersection = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; last = 0; }) : null;
  const resizer = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
  intersection?.observe(viewport);
  resizer?.observe(track);
  window.addEventListener('resize', measure, { passive: true });
  measure(); frame = requestAnimationFrame(tick);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame); intersection?.disconnect(); resizer?.disconnect();
  }, { once: true });
})();