/* ======================================
   NEET PREP PRO — JAVASCRIPT
   ====================================== */

// ── Navbar scroll effect (Dynamic Lookup) ──────────────────
function checkNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
}

window.addEventListener('scroll', checkNavbarScroll);
document.addEventListener('DOMContentLoaded', checkNavbarScroll);

// ── Hamburger menu delegation ────────────────────────
document.addEventListener('click', (e) => {
  const hamburger = e.target.closest('#hamburger');
  if (hamburger) {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
      navLinks.classList.toggle('open');
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    }
  }

  const navLink = e.target.closest('.nav-links a');
  if (navLink) {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (navLinks) navLinks.classList.remove('open', 'active');
    if (hamburger) hamburger.classList.remove('active');
  }
});

// ── FAQ Accordion ─────────────────────────
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));

  // Toggle current
  if (!isOpen) item.classList.add('open');
}

// ── Form Submit ───────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const modal = document.getElementById('successModal');
  modal.classList.add('active');
  e.target.reset();
}

function closeModal() {
  document.getElementById('successModal').classList.remove('active');
}

// Close modal on overlay click
document.getElementById('successModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ── Intersection Observer – Animate on scroll ──
const animatables = document.querySelectorAll(
  '.why-card, .rs-card, .testimonial-card, .pf-item, .vc-card, .about-stat-card, .af-item'
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger delay
        entry.target.style.transitionDelay = `${(i % 6) * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

// Add base CSS for animation
const style = document.createElement('style');
style.textContent = `
  .why-card, .rs-card, .testimonial-card,
  .pf-item, .vc-card, .about-stat-card,
  .af-item {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .why-card.visible, .rs-card.visible,
  .testimonial-card.visible, .pf-item.visible, .vc-card.visible, .about-stat-card.visible,
  .af-item.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

if (window.innerWidth > 768) {
  animatables.forEach(el => observer.observe(el));
} else {
  animatables.forEach(el => el.classList.add('visible'));
}

// ── Sticky CTA / Floating Action Widget Toggle ─────
const stickyCta = document.getElementById('stickyCta');
const heroSection = document.getElementById('home');

if (stickyCta && heroSection) {
  const ctaObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        stickyCta.style.display = 'flex';
      } else {
        stickyCta.style.display = 'none';
      }
    },
    { threshold: 0.2 }
  );
  ctaObserver.observe(heroSection);
}

// ── Smooth anchor scrolling with offset ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Counter animation for result numbers ──
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1600;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(ease * target);
    el.textContent = current.toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterMap = [
  { selector: '.rs-card:nth-child(1) .rs-num', target: 500, suffix: '+' },
  { selector: '.rs-card:nth-child(2) .rs-num', target: 95, suffix: '%' },
  { selector: '.rs-card:nth-child(3) .rs-num', target: 10000, suffix: '+' },
  { selector: '.rs-card:nth-child(4) .rs-num', target: 50000, suffix: '+' },
];

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = counterMap.find(c => entry.target.matches(c.selector));
        if (item) animateCounter(entry.target, item.target, item.suffix);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counterMap.forEach(({ selector }) => {
  const el = document.querySelector(selector);
  if (el) counterObserver.observe(el);
});

// ── Hero stat counters ────────────────────
const heroCounters = [
  { el: document.querySelector('.stat:nth-child(1) .stat-num'), target: 50000, suffix: '+' },
  { el: document.querySelector('.stat:nth-child(3) .stat-num'), target: 95, suffix: '%' },
  { el: document.querySelector('.stat:nth-child(5) .stat-num'), target: 200, suffix: '+' },
];

setTimeout(() => {
  heroCounters.forEach(({ el, target, suffix }) => {
    if (el) animateCounter(el, target, suffix);
  });
}, 400);

// ── Active nav link on scroll ─────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
});

// Add active nav link style
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-links a.active:not(.btn) { color: var(--primary) !important; }`;
document.head.appendChild(navStyle);

// ── ADVANCED MULTI-LAYER 3D PARALLAX & TILT ENGINE ─────────────────────────────
const allSections = document.querySelectorAll('section');
const heroStudentImg = document.querySelector('.hero-student-img');
const aboutIllustrationImg = document.querySelector('.about-illustration-img');
const appMockupImg = document.querySelector('.app-mockup img');
const floatingCards = document.querySelectorAll('.hv-card');
const parallaxBlobs = document.querySelectorAll('.blob-1, .blob-2, .blob-3, .blob-4, .svg-blob-1, .svg-blob-2');
const aboutWaves = document.querySelectorAll('.about-wave');
const tiltableCards = document.querySelectorAll('.course-card, .about-stat-card, .why-card, .res-card, .blog-card, .testimonial-card');

// 1. Intersection Observer for Section Parallax Reveal
const sectionParallaxObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-parallax-view');
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

allSections.forEach(sec => {
  sec.classList.add('sec-parallax-reveal');
  sectionParallaxObserver.observe(sec);
});

// 2. Real-Time Multi-Layer Scroll Parallax Depth Engine
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const viewportHeight = window.innerHeight;

  allSections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;

    // Execute parallax depth calculation if section is in viewport bounds
    if (scrolled + viewportHeight > top && scrolled < top + height) {
      const relScroll = scrolled - top; // Scroll distance inside section

      // Hero Section Parallax Layers
      if (sec.id === 'home') {
        if (heroStudentImg) {
          heroStudentImg.style.transform = `translateY(${relScroll * 0.10}px)`;
        }
        parallaxBlobs.forEach((blob, i) => {
          const speed = (i % 2 === 0) ? -0.14 : 0.10;
          const rotSpeed = (i % 2 === 0) ? 0.04 : -0.04;
          blob.style.transform = `translateY(${relScroll * speed}px) rotate(${relScroll * rotSpeed}deg)`;
        });
      }

      // About Section Parallax Layers (Medical 3D Illustration & Blue Waves)
      if (sec.id === 'about') {
        if (aboutIllustrationImg) {
          aboutIllustrationImg.style.transform = `translateY(${relScroll * 0.08}px) rotate(${relScroll * -0.015}deg)`;
        }
        const topWave = sec.querySelector('.top-wave');
        const bottomWave = sec.querySelector('.bottom-wave');
        const dotsPattern = sec.querySelector('.about-dots-pattern');
        if (topWave) topWave.style.transform = `rotate(180deg) translateY(${relScroll * -0.09}px)`;
        if (bottomWave) bottomWave.style.transform = `translateY(${relScroll * 0.07}px)`;
        if (dotsPattern) dotsPattern.style.transform = `translateY(${relScroll * 0.12}px)`;

        // Stat cards parallax stagger
        const statCards = sec.querySelectorAll('.about-stat-card');
        statCards.forEach((card, idx) => {
          const cardSpeed = (idx % 2 === 0) ? -0.04 : 0.04;
          card.style.transform = `translateY(${relScroll * cardSpeed}px)`;
        });
      }

      // App Section Parallax Layer
      if (sec.classList.contains('app') && appMockupImg) {
        appMockupImg.style.transform = `translateY(${relScroll * 0.07}px) rotate(${relScroll * 0.01}deg)`;
      }

      // Card Grids Subtle Parallax Shift
      const secCards = sec.querySelectorAll('.course-card, .why-card, .res-card, .blog-card');
      secCards.forEach((card, idx) => {
        const speed = (idx % 2 === 0) ? -0.03 : 0.03;
        card.style.transform = `translateY(${relScroll * speed}px)`;
      });
    }
  });

  // Hero Floating Badges Differential Parallax
  floatingCards.forEach((card, index) => {
    const speed = (index % 2 === 0) ? 0.10 : -0.08;
    card.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// 3. Interactive 3D Card Tilt Parallax Effect on Mouse Move
tiltableCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7; // max 7 deg tilt X
    const rotateY = ((x - centerX) / centerX) * 7;  // max 7 deg tilt Y

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

// 4. Mouse Ambient Background Parallax
window.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

  parallaxBlobs.forEach((blob, idx) => {
    const factor = (idx + 1) * 0.4;
    blob.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
  });
});

console.log('🚀 NEETPrep Pro — Full 3D Tilt & Multi-Layer Parallax Engine Activated!');
