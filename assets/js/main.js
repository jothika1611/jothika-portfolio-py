/* =========================================================
   Jothika P — Portfolio interactions
   ========================================================= */

(function () {
  'use strict';

  const root = document.documentElement;
  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('primaryNav');
  const menuToggle = document.getElementById('menuToggle');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeColor = document.getElementById('themeColor');
  const backToTop = document.getElementById('backToTop');
  const toast = document.getElementById('toast');
  const copyEmailBtn = document.getElementById('copyEmail');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */

  const themeMeta = {
    dark: '#070c17',
    light: '#f5f8fc'
  };

  function syncThemeUI(theme) {
    if (themeColor) {
      themeColor.setAttribute('content', themeMeta[theme] || themeMeta.dark);
    }
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    syncThemeUI(theme);
    if (persist) {
      try {
        localStorage.setItem('theme', theme);
      } catch (e) { /* storage may be unavailable */ }
    }
  }

  syncThemeUI(root.getAttribute('data-theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(next, true);
    });
  }

  /* ---------- Mobile navigation ---------- */

  function isMenuOpen() {
    return nav && nav.classList.contains('open');
  }

  function openMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (isMenuOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (nav) {
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isMenuOpen()) {
      closeMenu();
      if (menuToggle) menuToggle.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (isMenuOpen() && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 880) closeMenu();
  });

  /* ---------- Header + back-to-top ---------- */

  let scrollTicking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle('scrolled', y > 10);
    }

    if (backToTop) {
      backToTop.classList.toggle('show', y > 640);
    }

    updateActiveLink();
    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(onScroll);
      scrollTicking = true;
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ---------- Active navigation link ---------- */

  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav a[href^="#"]')
  );

  const sectionLinks = navLinks
    .map(function (link) {
      const id = link.getAttribute('href');
      const section = id && id.length > 1 ? document.querySelector(id) : null;
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  function updateActiveLink() {
    if (!sectionLinks.length) return;

    const offset = (header ? header.offsetHeight : 0) + 110;
    const marker = (window.scrollY || window.pageYOffset) + offset;
    let activeItem = null;

    sectionLinks.forEach(function (item) {
      if (item.section.offsetTop <= marker) {
        activeItem = item;
      }
    });

    const doc = document.documentElement;
    const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
    if (atBottom) {
      activeItem = sectionLinks[sectionLinks.length - 1];
    }

    sectionLinks.forEach(function (item) {
      const isActive = item === activeItem;
      item.link.classList.toggle('active', isActive);
      if (isActive) {
        item.link.setAttribute('aria-current', 'location');
      } else {
        item.link.removeAttribute('aria-current');
      }
    });
  }

  /* ---------- Scroll reveal ---------- */

  const revealItems = Array.prototype.slice.call(
    document.querySelectorAll('[data-reveal]')
  );

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  } else {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  /* ---------- Toast ---------- */

  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  }

  /* ---------- Copy email ---------- */

  function legacyCopy(text) {
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    helper.style.pointerEvents = 'none';
    document.body.appendChild(helper);
    helper.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (e) {
      copied = false;
    }

    document.body.removeChild(helper);
    return copied;
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      const email = copyEmailBtn.getAttribute('data-email') || 'jothikapandiyan2002@gmail.com';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () {
          showToast('Email copied to clipboard');
        }).catch(function () {
          showToast(legacyCopy(email) ? 'Email copied to clipboard' : email);
        });
      } else {
        showToast(legacyCopy(email) ? 'Email copied to clipboard' : email);
      }
    });
  }

  /* ---------- Footer year ---------- */

  const year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* ---------- Initial state ---------- */

  onScroll();
})();
