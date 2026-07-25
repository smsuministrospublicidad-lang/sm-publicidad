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

  // ---------- Contact form ----------
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // TODO: connect to a real backend (e.g. assets/php/enviar.php) to send the lead.
      success.hidden = false;
      form.reset();
    });
  }

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
