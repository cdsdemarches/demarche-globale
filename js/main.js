(function () {
  'use strict';

  // Current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll progress bar
  const progressBar = document.querySelector('.scroll-progress');
  const navbar = document.querySelector('.navbar-dg');
  const backBtn = document.querySelector('.back-to-top');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = percent + '%';

    if (navbar) {
      if (scrollTop > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    if (backBtn) {
      if (scrollTop > 400) backBtn.classList.add('visible');
      else backBtn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top click
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reveal on scroll
  const REVEAL_SELECTORS = [
    '.hero-tag',
    '.hero h1',
    '.hero .lead',
    '.hero .d-flex.gap-3',
    '.hero-side',
    '.page-header .breadcrumb-dg',
    '.page-header h1',
    '.page-header .lead',
    '.section-tag',
    '.section-title',
    '.section-subtitle',
    '.service-card',
    '.service-detail',
    '.trust-item',
    '.payment-card',
    '.step-card',
    '.accordion-item',
    '.contact-card',
    '.contact-info',
    '.cta-band',
    '.stat-item',
    '.info-box'
  ];

  const nodes = document.querySelectorAll(REVEAL_SELECTORS.join(','));
  nodes.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger based on sibling position within its row/section
          const parent = entry.target.closest('.row') || entry.target.parentElement;
          if (parent) {
            const siblings = Array.prototype.filter.call(
              parent.children,
              function (c) { return c.contains(entry.target) || c === entry.target; }
            );
            const idx = siblings.indexOf(entry.target.closest('[class*="col-"]') || entry.target);
            if (idx > 0) {
              entry.target.style.transitionDelay = (Math.min(idx, 8) * 0.06) + 's';
            }
          }
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    nodes.forEach(function (el) { observer.observe(el); });
  } else {
    nodes.forEach(function (el) { el.classList.add('in'); });
  }

  // Animated stat counters
  const stats = document.querySelectorAll('.stat-item .num[data-count]');
  if ('IntersectionObserver' in window && stats.length) {
    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const startTime = performance.now();

        function step(now) {
          const p = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const value = Math.floor(eased * target);
          el.textContent = value + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
        statObserver.unobserve(el);
      });
    }, { threshold: 0.4 });

    stats.forEach(function (el) { statObserver.observe(el); });
  }

  // Smooth scroll for internal anchors (offset navbar)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
