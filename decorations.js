// Decorative paw prints on both sides, revealed as the page scrolls.
(() => {
  const layer = document.querySelector('.paw-trail');
  if (!layer) return;
  const sections = [...document.querySelectorAll('main > section')];
  const prints = [];
  const stepsPerSide = 5;
  sections.forEach((section, index) => {
    for (let side = 0; side < 2; side++) {
      for (let step = 0; step < stepsPerSide; step++) {
        const paw = document.createElement('span');
        paw.className = 'paw-print';
        paw.setAttribute('aria-hidden', 'true');
        layer.appendChild(paw);
        prints.push({paw, section, side, step, index});
      }
    }
  });
  function placePrints() {
    const small = document.documentElement.clientWidth < 700;
    layer.style.height = document.documentElement.scrollHeight + 'px';
    prints.forEach(({paw, section, side, step, index}) => {
      const height = section.offsetHeight;
      const top = section.offsetTop + Math.min(height - 26, (step + .5) * height / stepsPerSide);
      const offset = (step % 2) * (small ? 3 : 2.2);
      paw.style.left = side === 0 ? (small ? 1 + offset : 1.5 + offset) + '%' : 'auto';
      paw.style.right = side === 1 ? (small ? 1 + offset : 1.5 + offset) + '%' : 'auto';
      paw.style.top = Math.max(0, top) + 'px';
      paw.style.setProperty('--rotation', (side === 0 ? -22 : 22) + (step % 2 ? 14 : -8) + 'deg');
    });
  }
  placePrints();
  window.addEventListener('load', placePrints, {once:true});
  window.addEventListener('resize', placePrints, {passive:true});
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {rootMargin:'0px 0px -5% 0px'});
    prints.forEach(({paw}) => observer.observe(paw));
  } else {
    prints.forEach(({paw}) => paw.classList.add('is-visible'));
  }
})();
