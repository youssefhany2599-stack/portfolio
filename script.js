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

/* ─── 27. 3D INTERACTIVE EXPERIENCE ─────────────────────── */
(function init3DExperience() {
  // 1. Generate ambient stars outside the card
  const starsContainer = $('#ambient-stars');
  if (starsContainer) {
    starsContainer.innerHTML = '';
    const count = 28;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'ambient-star-dot';
      const side = Math.floor(Math.random() * 4);
      let top, left;
      if (side === 0) { top = Math.random() * 15 - 20; left = Math.random() * 100; }
      else if (side === 1) { top = Math.random() * 100; left = Math.random() * 15 + 95; }
      else if (side === 2) { top = Math.random() * 15 + 95; left = Math.random() * 100; }
      else { top = Math.random() * 100; left = Math.random() * 15 - 15; }

      star.style.top = top + '%';
      star.style.left = left + '%';
      star.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      star.style.animationDuration = (3 + Math.random() * 3).toFixed(2) + 's';
      starsContainer.appendChild(star);
    }
  }

  // 2. Initialize Advanced Three.js Sci-Fi Robot Model
  const container = $('#interactive-3d-container');
  const canvas = $('#robot-3d-canvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 380;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Main Root Group
  const robotRoot = new THREE.Group();
  scene.add(robotRoot);

  // Sub-groups for head and body to create natural multi-joint movement
  const bodyGroup = new THREE.Group();
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.76;
  robotRoot.add(bodyGroup);
  robotRoot.add(headGroup);

  // --- Premium Materials ---
  const darkArmorMat = new THREE.MeshStandardMaterial({
    color: 0x070b14,
    roughness: 0.18,
    metalness: 0.92,
  });

  const gunmetalMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.85,
  });

  const cyanEmissiveMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x22d3ee,
    emissiveIntensity: 2.2,
    roughness: 0.1,
  });

  const blueEmissiveMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x3b82f6,
    emissiveIntensity: 1.8,
    roughness: 0.1,
  });

  const haloRing1Mat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x22d3ee,
    emissiveIntensity: 2.0,
    roughness: 0.1,
    side: THREE.DoubleSide,
  });

  const haloRing2Mat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x3b82f6,
    emissiveIntensity: 1.8,
    roughness: 0.1,
    side: THREE.DoubleSide,
  });

  // --- 1. HEAD ASSEMBLY ---
  // Main Helmet Shell
  const helmetGeo = new THREE.SphereGeometry(0.4, 32, 32);
  helmetGeo.scale(1, 0.84, 0.95);
  const helmet = new THREE.Mesh(helmetGeo, darkArmorMat);
  headGroup.add(helmet);

  // Curved Visor
  const visorBaseGeo = new THREE.BoxGeometry(0.56, 0.11, 0.34);
  const visorMesh = new THREE.Mesh(visorBaseGeo, cyanEmissiveMat);
  visorMesh.position.set(0, 0.02, 0.24);
  headGroup.add(visorMesh);

  // Dual Glowing Optical Eye Sensors
  const eyeGeo = new THREE.SphereGeometry(0.045, 16, 16);
  const leftEye = new THREE.Mesh(eyeGeo, cyanEmissiveMat);
  leftEye.position.set(-0.14, 0.02, 0.38);
  const rightEye = new THREE.Mesh(eyeGeo, cyanEmissiveMat);
  rightEye.position.set(0.14, 0.02, 0.38);
  headGroup.add(leftEye);
  headGroup.add(rightEye);

  // Side Ear Sensors (Cylinders + Glowing Cyan Rings)
  const earGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.1, 24);
  const leftEar = new THREE.Mesh(earGeo, gunmetalMat);
  leftEar.rotation.z = Math.PI / 2;
  leftEar.position.set(-0.41, 0, 0);

  const rightEar = new THREE.Mesh(earGeo, gunmetalMat);
  rightEar.rotation.z = Math.PI / 2;
  rightEar.position.set(0.41, 0, 0);

  const earCapGeo = new THREE.TorusGeometry(0.09, 0.015, 16, 32);
  const leftEarCap = new THREE.Mesh(earCapGeo, cyanEmissiveMat);
  leftEarCap.rotation.y = Math.PI / 2;
  leftEarCap.position.set(-0.46, 0, 0);

  const rightEarCap = new THREE.Mesh(earCapGeo, cyanEmissiveMat);
  rightEarCap.rotation.y = Math.PI / 2;
  rightEarCap.position.set(0.46, 0, 0);

  headGroup.add(leftEar);
  headGroup.add(rightEar);
  headGroup.add(leftEarCap);
  headGroup.add(rightEarCap);

  // Head Fin / Crown Accent
  const finGeo = new THREE.ConeGeometry(0.06, 0.25, 4);
  finGeo.rotateY(Math.PI / 4);
  const fin = new THREE.Mesh(finGeo, blueEmissiveMat);
  fin.position.set(0, 0.42, 0);
  headGroup.add(fin);

  // --- 2. NECK & TORSO ASSEMBLY ---
  // Neck Collar Rings
  const neckGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.18, 16);
  const neck = new THREE.Mesh(neckGeo, gunmetalMat);
  neck.position.y = 0.58;
  bodyGroup.add(neck);

  // Main Torso Armor
  const torsoGeo = new THREE.CylinderGeometry(0.46, 0.32, 0.9, 32);
  const torso = new THREE.Mesh(torsoGeo, darkArmorMat);
  bodyGroup.add(torso);

  // Chest Armor Plates (Left & Right Overlay)
  const plateGeo = new THREE.BoxGeometry(0.22, 0.5, 0.1);
  const leftPlate = new THREE.Mesh(plateGeo, gunmetalMat);
  leftPlate.position.set(-0.2, 0.1, 0.23);
  leftPlate.rotation.y = -0.15;

  const rightPlate = new THREE.Mesh(plateGeo, gunmetalMat);
  rightPlate.position.set(0.2, 0.1, 0.23);
  rightPlate.rotation.y = 0.15;

  bodyGroup.add(leftPlate);
  bodyGroup.add(rightPlate);

  // Chest Reactor Housing Collar
  const reactorCollarGeo = new THREE.TorusGeometry(0.22, 0.03, 16, 32);
  const reactorCollar = new THREE.Mesh(reactorCollarGeo, gunmetalMat);
  reactorCollar.position.set(0, 0.08, 0.26);
  bodyGroup.add(reactorCollar);

  // Glowing Reactor Sphere Core
  const reactorCoreGeo = new THREE.SphereGeometry(0.18, 32, 32);
  const reactorCore = new THREE.Mesh(reactorCoreGeo, cyanEmissiveMat);
  reactorCore.position.set(0, 0.08, 0.28);
  bodyGroup.add(reactorCore);

  // Floating Rotating Crystal inside Core
  const crystalGeo = new THREE.IcosahedronGeometry(0.1, 0);
  const crystalCore = new THREE.Mesh(crystalGeo, blueEmissiveMat);
  crystalCore.position.set(0, 0.08, 0.28);
  bodyGroup.add(crystalCore);

  // Intense Point Light emitting from Core
  const reactorLight = new THREE.PointLight(0x22d3ee, 2.6, 7);
  reactorLight.position.set(0, 0.08, 0.35);
  bodyGroup.add(reactorLight);

  // --- 3. DUAL ORBITING HALO RINGS ---
  const ring1Geo = new THREE.TorusGeometry(0.56, 0.018, 16, 100);
  const haloRing1 = new THREE.Mesh(ring1Geo, haloRing1Mat);
  haloRing1.position.set(0, 0.08, 0.08);
  haloRing1.rotation.x = Math.PI / 2.6;
  bodyGroup.add(haloRing1);

  const ring2Geo = new THREE.TorusGeometry(0.66, 0.014, 16, 100);
  const haloRing2 = new THREE.Mesh(ring2Geo, haloRing2Mat);
  haloRing2.position.set(0, 0.08, 0.08);
  haloRing2.rotation.x = -Math.PI / 3;
  haloRing2.rotation.y = Math.PI / 4;
  bodyGroup.add(haloRing2);

  // --- 4. SHOULDERS & FLOATING SATELLITE DRONES ---
  const shoulderGeo = new THREE.SphereGeometry(0.18, 24, 24);
  shoulderGeo.scale(1.2, 0.9, 1);
  const leftShoulder = new THREE.Mesh(shoulderGeo, darkArmorMat);
  leftShoulder.position.set(-0.54, 0.32, 0);
  const rightShoulder = new THREE.Mesh(shoulderGeo, darkArmorMat);
  rightShoulder.position.set(0.54, 0.32, 0);
  bodyGroup.add(leftShoulder);
  bodyGroup.add(rightShoulder);

  // Floating Guardian Drones (Left & Right)
  const droneGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const leftDrone = new THREE.Mesh(droneGeo, darkArmorMat);
  const rightDrone = new THREE.Mesh(droneGeo, darkArmorMat);

  const droneEyeGeo = new THREE.SphereGeometry(0.05, 12, 12);
  const leftDroneEye = new THREE.Mesh(droneEyeGeo, cyanEmissiveMat);
  leftDroneEye.position.z = 0.09;
  leftDrone.add(leftDroneEye);

  const rightDroneEye = new THREE.Mesh(droneEyeGeo, cyanEmissiveMat);
  rightDroneEye.position.z = 0.09;
  rightDrone.add(rightDroneEye);

  const droneRingGeo = new THREE.TorusGeometry(0.16, 0.012, 12, 32);
  const leftDroneRing = new THREE.Mesh(droneRingGeo, blueEmissiveMat);
  leftDroneRing.rotation.x = Math.PI / 2;
  leftDrone.add(leftDroneRing);

  const rightDroneRing = new THREE.Mesh(droneRingGeo, blueEmissiveMat);
  rightDroneRing.rotation.x = Math.PI / 2;
  rightDrone.add(rightDroneRing);

  leftDrone.position.set(-1.05, -0.1, 0.2);
  rightDrone.position.set(1.05, -0.1, 0.2);

  robotRoot.add(leftDrone);
  robotRoot.add(rightDrone);

  // --- 5. 3D COSMIC PARTICLE STARFIELD ---
  const particleCount = 180;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0x22d3ee);
  const color2 = new THREE.Color(0x3b82f6);

  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    particlePos[idx]     = (Math.random() - 0.5) * 6.0;
    particlePos[idx + 1] = (Math.random() - 0.5) * 6.0;
    particlePos[idx + 2] = (Math.random() - 0.5) * 4.5;

    const mixColor = Math.random() > 0.4 ? color1 : color2;
    particleColors[idx]     = mixColor.r;
    particleColors[idx + 1] = mixColor.g;
    particleColors[idx + 2] = mixColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.038,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const starfield = new THREE.Points(particleGeo, particleMat);
  scene.add(starfield);

  // --- 6. SCENE LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0x0a101f, 1.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x3b82f6, 1.8);
  mainLight.position.set(4, 5, 4);
  scene.add(mainLight);

  const cyanRimLight = new THREE.DirectionalLight(0x22d3ee, 1.4);
  cyanRimLight.position.set(-4, -2, -2);
  scene.add(cyanRimLight);

  const fillLight = new THREE.PointLight(0x3b82f6, 1.0, 8);
  fillLight.position.set(0, -3, 3);
  scene.add(fillLight);

  // --- 7. MOUSE & TOUCH INTERACTIVITY ---
  let mouseX = 0, mouseY = 0;
  let isHovered = false;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  });

  container.addEventListener('mouseenter', () => { isHovered = true; });
  container.addEventListener('mouseleave', () => {
    isHovered = false;
    mouseX = 0;
    mouseY = 0;
  });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.touches[0].clientY - rect.top) / rect.height) * 2 - 1);
      isHovered = true;
    }
  }, { passive: true });
  container.addEventListener('touchend', () => { isHovered = false; mouseX = 0; mouseY = 0; });

  // --- 8. ANIMATION LOOP ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Robot vertical floating motion
    robotRoot.position.y = Math.sin(elapsedTime * 1.6) * 0.14;

    // Head smooth tracking (natural multi-joint neck rotation)
    const targetHeadY = mouseX * 0.75;
    const targetHeadX = -mouseY * 0.45;
    headGroup.rotation.y += (targetHeadY + Math.sin(elapsedTime * 0.8) * 0.08 - headGroup.rotation.y) * 0.08;
    headGroup.rotation.x += (targetHeadX - headGroup.rotation.x) * 0.08;

    // Body smooth rotation (lagging slightly behind head for organic mechanical feel)
    const targetBodyY = mouseX * 0.45;
    const targetBodyX = -mouseY * 0.25;
    bodyGroup.rotation.y += (targetBodyY + Math.sin(elapsedTime * 0.4) * 0.05 - bodyGroup.rotation.y) * 0.05;
    bodyGroup.rotation.x += (targetBodyX - bodyGroup.rotation.x) * 0.05;

    // Internal Core Crystal spinning
    crystalCore.rotation.x = elapsedTime * 2.2;
    crystalCore.rotation.y = elapsedTime * 1.8;

    // Halo Rings orbital rotation
    haloRing1.rotation.z = elapsedTime * 1.1;
    haloRing1.rotation.y = Math.sin(elapsedTime * 0.6) * 0.4;

    haloRing2.rotation.z = -elapsedTime * 0.95;
    haloRing2.rotation.x = -Math.PI / 3 + Math.cos(elapsedTime * 0.5) * 0.3;

    // Guardian Drones anti-phase floating & ring spin
    leftDrone.position.y = -0.1 + Math.sin(elapsedTime * 2.2) * 0.1;
    rightDrone.position.y = -0.1 + Math.cos(elapsedTime * 2.2) * 0.1;

    leftDrone.position.x = -1.05 + mouseX * 0.2;
    rightDrone.position.x = 1.05 + mouseX * 0.2;

    leftDroneRing.rotation.z = elapsedTime * 2.5;
    rightDroneRing.rotation.z = -elapsedTime * 2.5;

    // Starfield cosmic rotation
    starfield.rotation.y = elapsedTime * 0.035;
    starfield.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08;

    // Light & Glow surge on mouse hover
    const targetLightIntensity = isHovered ? 4.8 : 2.6;
    const targetEmissiveVal    = isHovered ? 3.6 : 2.2;

    reactorLight.intensity += (targetLightIntensity - reactorLight.intensity) * 0.07;
    cyanEmissiveMat.emissiveIntensity += (targetEmissiveVal - cyanEmissiveMat.emissiveIntensity) * 0.07;
    blueEmissiveMat.emissiveIntensity += (targetEmissiveVal * 0.85 - blueEmissiveMat.emissiveIntensity) * 0.07;
    haloRing1Mat.emissiveIntensity += (targetEmissiveVal - haloRing1Mat.emissiveIntensity) * 0.07;

    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
  function onResize() {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w && h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  }

  window.addEventListener('resize', onResize, { passive: true });
})();

