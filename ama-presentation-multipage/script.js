(function () {
  const pages = [
    'index.html', 'journey.html', 'work.html', 'hobbies.html',
    'favorites.html', 'about.html', 'goals.html', 'ama.html'
  ];

  const current = Number(document.body.dataset.slide || 1);
  const theme = document.getElementById('theme');
  const toast = document.getElementById('toast');
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');

  function goTo(index) {
    if (index < 1 || index > pages.length) return;
    window.location.href = pages[index - 1];
  }

  function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('ama-theme', dark ? 'dark' : 'light');
    if (theme) theme.textContent = dark ? '☀' : '☾';
  }

  setTheme(localStorage.getItem('ama-theme') === 'dark');

  theme?.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark'));
  });

  next?.addEventListener('click', () => goTo(current + 1));
  prev?.addEventListener('click', () => goTo(current - 1));

  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault(); goTo(current + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault(); goTo(current - 1);
    }
    if (e.key === 'Home') { e.preventDefault(); goTo(1); }
    if (e.key === 'End') { e.preventDefault(); goTo(pages.length); }
    if (e.key.toLowerCase() === 'f') {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
  });

  let startX = 0;
  let startY = 0;
  document.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - startX;
    const dy = e.changedTouches[0].screenY - startY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    goTo(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  document.querySelectorAll('[data-answer]').forEach(card => {
    card.addEventListener('click', () => {
      const answer = card.dataset.answer;
      const strong = card.querySelector('strong');
      if (strong) strong.textContent = answer;
      card.classList.add('revealed');
    });
  });

  document.querySelectorAll('.pills button, .questions button').forEach(button => {
    button.addEventListener('click', () => showToast(button.textContent.trim()));
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 1700);
  }
})();

const profile=document.querySelector('.profile');
if(profile&&window.matchMedia('(hover:none)').matches){
  profile.addEventListener('click',()=>profile.classList.toggle('show'));
}

(() => {
  if (!window.matchMedia('(hover:hover)').matches) return;
  const cards = document.querySelectorAll('.timeline article');
  if (!cards.length) return;

  const spot = document.createElement('div');
  spot.className = 'spotlight';
  spot.innerHTML = '<div class="spotlight-card"></div>';
  document.body.appendChild(spot);
  const box = spot.firstElementChild;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      box.innerHTML = card.innerHTML;
      spot.classList.add('show');
    });
    card.addEventListener('mouseleave', () => spot.classList.remove('show'));
  });
})();
