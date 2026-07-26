(() => {
  'use strict';

  // ---------- Mobile menu ----------
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.hidden;
    mobileMenu.hidden = isOpen;
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  // ---------- Scroll reveal ----------
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => io.observe(el));

  // ---------- Marquee content ----------
  const marqueeItems = [
    'Desarrollo de Software', 'Inteligencia Artificial', 'Branding & Logos',
    'Impresión Litográfica', 'Marketing Digital', 'BTL', 'Souvenirs',
    'Fotografía', 'Automatización', 'Asesorías',
  ];
  const track = document.getElementById('marqueeTrack');
  if (track) {
    const buildGroup = () => {
      const group = document.createElement('div');
      group.className = 'marquee-group';
      marqueeItems.forEach((label) => {
        const item = document.createElement('span');
        item.className = 'marquee-item';
        item.textContent = label;
        const dot = document.createElement('span');
        dot.className = 'marquee-dot';
        group.append(item, dot);
      });
      return group;
    };
    // Duplicated so the CSS translateX(-50%) loop is seamless.
    track.append(buildGroup(), buildGroup());
  }

  // ---------- Portfolio tabs ----------
  const portfolioTabs = document.querySelector('.portfolio-tabs');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioEmpty = document.querySelector('.portfolio-empty');
  if (portfolioTabs) {
    portfolioTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.portfolio-tab');
      if (!tab) return;

      portfolioTabs.querySelectorAll('.portfolio-tab').forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const category = tab.dataset.tab;
      let visibleCount = 0;
      portfolioItems.forEach((item) => {
        const show = category === 'todos' || item.dataset.category === category;
        item.hidden = !show;
        if (show) visibleCount += 1;
      });
      if (portfolioEmpty) portfolioEmpty.hidden = visibleCount > 0;
    });
  }

  // ---------- Contact form ----------
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      success.hidden = true;
      if (formError) formError.hidden = true;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('request failed');
        success.hidden = false;
        form.reset();
      } catch (err) {
        if (formError) formError.hidden = false;
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enviar solicitud →'; }
      }
    });
  }

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
