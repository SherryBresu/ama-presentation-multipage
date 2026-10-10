(() => {
  const modal = document.getElementById('hobby-modal');
  if (!modal) return;

  const card = modal.querySelector('.hm-card');
  const frame = modal.querySelector('.hm-frame');
  const img = document.getElementById('hm-img');
  const video = document.getElementById('hm-video');
  const title = document.getElementById('hm-title');
  const cap = document.getElementById('hm-cap');
  const count = document.getElementById('hm-count');
  const isVideo = s => /\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(s);
  let photos = [], i = 0, opener = null;

  img.onload = () => frame.classList.remove('missing');
  img.onerror = () => frame.classList.add('missing');
  video.onloadeddata = () => frame.classList.remove('missing');
  video.onerror = () => frame.classList.add('missing');

  function render() {
    video.pause();
    frame.classList.remove('missing');

    if (!photos.length) {
      img.removeAttribute('src');
      video.removeAttribute('src');
      frame.classList.remove('is-video');
      frame.classList.add('missing');
      count.textContent = '';
      return;
    }

    const src = photos[i];
    count.textContent = `${i + 1}/${photos.length}`;

    if (isVideo(src)) {
      frame.classList.add('is-video');
      video.src = src;
      video.load();
      video.play().catch(() => {});
    } else {
      frame.classList.remove('is-video');
      img.src = src;
    }
  }

  function step(n) {
    if (photos.length < 2) return;
    i = (n + photos.length) % photos.length;
    frame.classList.add('swapping');
    setTimeout(() => { render(); frame.classList.remove('swapping'); }, 150);
  }

  function open(btn) {
    opener = btn;
    photos = (btn.dataset.photos || '').split(',').map(s => s.trim()).filter(Boolean);
    i = 0;
    title.textContent = btn.dataset.title || '';
    cap.textContent = btn.dataset.caption || '';
    img.alt = (btn.dataset.title || 'Hobby') + ' photo';
    card.classList.toggle('single', photos.length < 2);
    render();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.hm-close').focus();
  }

  function close() {
    video.pause();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (opener) opener.focus();
  }

  document.querySelectorAll('.pills button').forEach(b => b.addEventListener('click', () => open(b)));
  modal.querySelector('.hm-close').addEventListener('click', close);
  modal.querySelector('.hm-prev').addEventListener('click', () => step(i - 1));
  modal.querySelector('.hm-next').addEventListener('click', () => step(i + 1));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(i - 1);
    if (e.key === 'ArrowRight') step(i + 1);
  });

  let x0 = 0;
  frame.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  frame.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) step(i + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();