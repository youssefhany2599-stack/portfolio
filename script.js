/* =========================================================
   YOUSSEF HANY — Portfolio JavaScript
   All advanced automations & interactions
   ========================================================= */

'use strict';

/* ─── UTILITY ────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

/* ─── 1. PRELOADER ───────────────────────────────────────── */
(function initPreloader() {
  const preloader = $('#preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      initScrollReveal();
      initCounters();
      initSkillBars();
    }, 2200);
  });
  document.body.style.overflow = 'hidden';
})();

/* ─── 2. CUSTOM CURSOR ───────────────────────────────────── */
(function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  $$('a, button, .project-card, .service-card, .kpi-card, .tc-icon').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ─── 3. SCROLL PROGRESS ─────────────────────────────────── */
(function initScrollProgress() {
  const bar = $('#scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = clamp(pct, 0, 100) + '%';
  }, { passive: true });
})();

/* ─── 4. NAVBAR ──────────────────────────────────────────── */
(function initNavbar() {
  const nav  = $('#navbar');
  const ham  = $('#hamburger');
  const links = $('#nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    $('#back-to-top').classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  ham?.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });

  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      ham?.classList.remove('open');
      links?.classList.remove('open');
    });
  });
})();

/* ─── 5. ACTIVE NAV HIGHLIGHTING ────────────────────────── */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = navLinks.find(l => l.getAttribute('href') === '#' + entry.target.id);
        active?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ─── 6. PARTICLES CANVAS ────────────────────────────────── */
(function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  const CONFIG = {
    count: 70,
    color: '0,212,255',
    maxDist: 130,
    speed: 0.35,
    radius: 1.5,
    mouseInfluence: 120,
  };

  let mouse = { x: null, y: null };

  function resize() {
    w = canvas.width  = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
    initParticleSet();
  }

  function initParticleSet() {
    particles = Array.from({ length: CONFIG.count }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r:  Math.random() * CONFIG.radius + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // Mouse repel
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CONFIG.mouseInfluence) {
          const force = (CONFIG.mouseInfluence - dist) / CONFIG.mouseInfluence;
          p.x += dx * force * 0.02;
          p.y += dy * force * 0.02;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color},${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < CONFIG.maxDist) {
          const alpha = (1 - d / CONFIG.maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CONFIG.color},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  resize();
  draw();
})();

/* ─── 7. TYPING TEXT ANIMATION ───────────────────────────── */
(function initTyping() {
  const el = $('#typing-text');
  if (!el) return;
  const lines = [
    'Technical Operations Specialist',
    'Business Intelligence Analyst',
    'E-commerce Operations Manager',
    'Workflow Optimization Expert',
    'Data-Driven Problem Solver',
  ];
  let lineIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const line = lines[lineIdx];
    if (!deleting) {
      el.textContent = line.substring(0, ++charIdx);
      if (charIdx === line.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = line.substring(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
      }
    }
    setTimeout(type, deleting ? 40 : 75);
  }
  setTimeout(type, 2600);
})();

/* ─── 8. SCROLL REVEAL ───────────────────────────────────── */
function initScrollReveal() {
  const targets = $$('.reveal-up, .reveal-left, .reveal-right');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(t => obs.observe(t));
}

/* ─── 9. ANIMATED COUNTERS ───────────────────────────────── */
function initCounters() {
  const counters = $$('.counter');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, 30);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

/* ─── 10. SKILL BARS ─────────────────────────────────────── */
function initSkillBars() {
  const bars = $$('.skill-fill');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const width = bar.dataset.width;
      setTimeout(() => { bar.style.width = width + '%'; }, 200);
      obs.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
}

/* ─── 11. PROJECT FILTERING ──────────────────────────────── */
(function initFilters() {
  const btns   = $$('.filter-btn');
  const cards  = $$('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '1';
          card.style.transform = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });
})();

/* ─── 12. DARK / LIGHT MODE TOGGLE ──────────────────────── */
(function initTheme() {
  const btn  = $('#theme-toggle');
  const icon = btn?.querySelector('.theme-icon');
  const saved = localStorage.getItem('yh-theme') || 'dark';

  function applyTheme(t) {
    document.body.classList.toggle('light-mode', t === 'light');
    if (icon) icon.textContent = t === 'light' ? '◑' : '◐';
    localStorage.setItem('yh-theme', t);
  }

  applyTheme(saved);

  btn?.addEventListener('click', () => {
    const current = localStorage.getItem('yh-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
    showToast(current === 'dark' ? 'Light mode activated' : 'Dark mode activated');
  });
})();

/* ─── 13. SERVICE CARD TILT ──────────────────────────────── */
(function initTilt() {
  $$('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -6;
      const ry = ((e.clientX - cx) / (rect.width  / 2)) *  6;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── 14. CONTACT FORM ───────────────────────────────────── */
(function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = $('#f-name').value.trim();
    const email   = $('#f-email').value.trim();
    const subject = $('#f-subject').value.trim();
    const message = $('#f-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields.', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email.', 'error'); return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';

    setTimeout(() => {
      showToast('Message sent successfully! ✓', 'success');
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
    }, 1800);
  });
})();

/* ─── 15. COPY TO CLIPBOARD ──────────────────────────────── */
(function initCopyBtns() {
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard?.writeText(text).then(() => {
        showToast('Copied to clipboard!');
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showToast('Copied!');
      });
    });
  });
})();

/* ─── 16. BACK TO TOP ────────────────────────────────────── */
(function initBackToTop() {
  const btn = $('#back-to-top');
  btn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── 17. DYNAMIC YEAR ───────────────────────────────────── */
(function setYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ─── 19. TOAST NOTIFICATION SYSTEM ──────────────────────── */
function showToast(message, type = 'default') {
  const container = $('#toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-in 0.3s ease reverse';
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

/* ─── 20. MOUSE GLOW EFFECT ──────────────────────────────── */
(function initMouseGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 0;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.4s ease, top 0.4s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

/* ─── 21. MARQUEE PAUSE ON HOVER ────────────────────────── */
(function initMarquee() {
  const track = $('.marquee-inner');
  if (!track) return;
  const wrapper = $('.marquee-wrapper');
  wrapper?.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  wrapper?.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();

/* ─── 22. SMOOTH ANCHOR SCROLLING ────────────────────────── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ─── 23. KEYBOARD ACCESSIBILITY ─────────────────────────── */
(function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const ham  = $('#hamburger');
      const links = $('#nav-links');
      ham?.classList.remove('open');
      links?.classList.remove('open');
    }
  });
})();

/* ─── 24. PERFORMANCE: PASSIVE LISTENERS ─────────────────── */
// All scroll listeners already marked {passive: true} above

/* ─── 25. NOVELUSION GALLERY SLIDER ─────────────────────── */
(function initNovelusionGallery() {
  const track = $('#novelusion-track');
  const dots  = $$('#novelusion-dots .cert-gallery-dot');
  if (!track || !dots.length) return;

  const total = track.children.length;
  let current = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Expose for inline onclick
  window.novelusionGallery = function(dir) {
    goTo(current + dir);
    resetAuto();
  };

  // Dot click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  // Auto-play every 3s
  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 3000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Pause on hover
  const gallery = $('#novelusion-gallery');
  gallery?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  gallery?.addEventListener('mouseleave', () => startAuto());

  // Touch / swipe support
  let touchStartX = 0;
  gallery?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  gallery?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
  }, { passive: true });

  startAuto();
})();

/* ─── 26. INIT LOG ───────────────────────────────────────── */
console.log(
  '%c[YH] Portfolio Loaded ✓',
  'color:#00d4ff;font-family:monospace;font-size:14px;font-weight:bold;'
);
