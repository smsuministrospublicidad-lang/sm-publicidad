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

  // ---------- Back-to-top button ----------
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 600);
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Hero title typewriter ----------
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    const segments = [
      { text: 'Diseño y publicidad, potenciados por ' },
      { text: 'IA', cls: 'accent' },
      { text: '.' },
    ];
    let doneHTML = '';
    let segIndex = 0;
    let charIndex = 0;

    function typeTick() {
      if (segIndex >= segments.length) return;
      const seg = segments[segIndex];
      charIndex++;
      const partial = seg.text.slice(0, charIndex);
      const partialHTML = seg.cls ? `<span class="${seg.cls}">${partial}</span>` : partial;
      heroTitle.innerHTML = doneHTML + partialHTML + '<span class="typing-cursor"></span>';
      if (charIndex >= seg.text.length) {
        doneHTML += seg.cls ? `<span class="${seg.cls}">${seg.text}</span>` : seg.text;
        segIndex += 1;
        charIndex = 0;
      }
      if (segIndex < segments.length) setTimeout(typeTick, 32);
    }
    typeTick();
  }

  // ---------- Live operations feed ----------
  const opsFeed = document.getElementById('opsFeed');
  const opsCounterEl = document.getElementById('opsCounter');
  if (opsFeed && opsCounterEl) {
    const requests = [
      { cat: 'Branding', icon: '◎', text: 'Nuevo logo para restaurante' },
      { cat: 'Impresión', icon: '▤', text: 'Cotización de tarjetas' },
      { cat: 'Marketing', icon: '◈', text: 'Campaña para redes sociales' },
      { cat: 'Fotografía', icon: '◐', text: 'Sesión de fotos de producto' },
      { cat: 'Web & IA', icon: '{ }', text: 'Chatbot para atención 24/7' },
      { cat: 'Souvenirs', icon: '★', text: 'Merch para lanzamiento' },
      { cat: 'Impresión', icon: '▤', text: 'Vallas para punto de venta' },
      { cat: 'Marketing', icon: '◈', text: 'Anuncios en Google Ads' },
    ];
    const MAX_CARDS = 3;
    let reqIndex = 0;
    let counter = 128;
    opsCounterEl.textContent = counter;

    function addCard() {
      const req = requests[reqIndex % requests.length];
      reqIndex += 1;

      const card = document.createElement('div');
      card.className = 'ops-card';
      card.innerHTML =
        '<div class="ops-card-icon">' + req.icon + '</div>' +
        '<div class="ops-card-body">' +
          '<div class="ops-card-cat">' + req.cat + '</div>' +
          '<div class="ops-card-text">' + req.text + '</div>' +
        '</div>' +
        '<div class="ops-card-status">Procesando…</div>';
      opsFeed.appendChild(card);

      requestAnimationFrame(() => card.classList.add('is-visible'));

      if (opsFeed.children.length > MAX_CARDS) {
        const oldest = opsFeed.children[0];
        oldest.classList.add('is-leaving');
        setTimeout(() => oldest.remove(), 450);
      }

      setTimeout(() => {
        const status = card.querySelector('.ops-card-status');
        if (status) {
          status.textContent = '✓ Resuelto por IA';
          status.classList.add('is-done');
        }
        counter += 1;
        opsCounterEl.textContent = counter;
      }, 1000);
    }

    addCard();
    setInterval(addCard, 2200);
  }

  // ---------- Hero slider ----------
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  if (heroSlides.length) {
    let current = 0;
    let timer = null;

    function goToSlide(index) {
      heroSlides[current].classList.remove('is-active');
      heroDots[current].classList.remove('is-active');
      heroDots[current].setAttribute('aria-selected', 'false');
      current = index;
      heroSlides[current].classList.add('is-active');
      heroDots[current].classList.add('is-active');
      heroDots[current].setAttribute('aria-selected', 'true');
    }

    function nextSlide() {
      goToSlide((current + 1) % heroSlides.length);
    }

    function startAutoplay() {
      timer = setInterval(nextSlide, 6000);
    }

    function resetAutoplay() {
      clearInterval(timer);
      startAutoplay();
    }

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (i === current) return;
        goToSlide(i);
        resetAutoplay();
      });
    });

    startAutoplay();
  }

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
