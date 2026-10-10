document.querySelectorAll('[data-carousel]').forEach(c => {
  const track = c.querySelector('.car-track');
  const slides = c.querySelectorAll('.car-slide');
  const wrap = c.closest('.car-wrap');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, timer;

  function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
  }
  function restart() {
    clearInterval(timer);
    if (!reduce && slides.length > 1) timer = setInterval(() => go(i + 1), 3000);
  }

  if (wrap) {
    wrap.querySelector('.prev')?.addEventListener('click', () => { go(i - 1); restart(); });
    wrap.querySelector('.next')?.addEventListener('click', () => { go(i + 1); restart(); });
  }

  c.addEventListener('mouseenter', () => clearInterval(timer));
  c.addEventListener('mouseleave', restart);

  let x0 = 0;
  c.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  c.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); restart(); }
  }, { passive: true });

  go(0);
  restart();
});