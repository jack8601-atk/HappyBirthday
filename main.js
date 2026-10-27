// SECTIONS & NAVIGATION
const allSections = document.querySelectorAll('.page-section');
let currentSection = 0;
let autoScrollTimer = null;
const AUTO_SCROLL_DELAY = 6500;

// BUILD NAV DOTS
const dotsContainer = document.getElementById('navDots');
allSections.forEach((sec, i) => {
  const dot = document.createElement('button');
  dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', sec.dataset.section || `Section ${i + 1}`);
  dot.innerHTML = `<span class="nav-label">${sec.dataset.section}</span>`;
  dot.onclick = () => goToSection(i);
  dotsContainer.appendChild(dot);
});

function goToSection(index) {
  if (index < 0 || index >= allSections.length) return;
  currentSection = index;
  allSections[index].classList.add('visible');
  allSections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateActiveDot();
  updateProgress();
  resetAutoScroll();
}

function updateActiveDot() {
  document.querySelectorAll('.nav-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSection);
  });
}

function updateProgress() {
  const pct = ((currentSection) / (allSections.length - 1)) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
}

// SCROLL OBSERVER - detect which section is in view
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const idx = [...allSections].indexOf(e.target);
      if (idx !== -1) {
        currentSection = idx;
        updateActiveDot();
        updateProgress();
      }
    }
  });
}, { threshold: 0.1 });
allSections.forEach(s => sectionObserver.observe(s));

// AUTO SCROLL
function startAutoScroll() {
  // Disable auto-scroll on small mobile screens to let users read at their own pace
  if (window.innerWidth <= 768) return;
  autoScrollTimer = setInterval(() => {
    if (currentSection < allSections.length - 1) {
      goToSection(currentSection + 1);
    } else {
      clearInterval(autoScrollTimer);
    }
  }, AUTO_SCROLL_DELAY);
}

function resetAutoScroll() {
  clearInterval(autoScrollTimer);
  startAutoScroll();
}

// LOADER — cap at 2.5s max, don't wait forever for slow assets
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader || loader.classList.contains('hide')) return;
  loader.classList.add('hide');
  allSections.forEach(s => s.classList.add('visible'));
  triggerHeartConfetti(70);
  startAutoScroll();
}
const hardCapTimer = setTimeout(hideLoader, 2500);
document.addEventListener('DOMContentLoaded', () => {
  allSections.forEach(s => s.classList.add('visible'));
  setTimeout(() => {
    clearTimeout(hardCapTimer);
    hideLoader();
  }, 900);
});

// Stop auto-scroll on manual interaction
document.addEventListener('wheel', () => clearInterval(autoScrollTimer), { passive: true });
document.addEventListener('touchstart', () => clearInterval(autoScrollTimer), { passive: true });

// FLOATING HEARTS BACKGROUND
(function createFloatingHearts() {
  const container = document.getElementById('particles');
  if (!container) return;
  const heartIcons = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌸'];
  const count = 35;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'heart-particle';
    el.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    const size = Math.random() * 1.2 + 0.8;
    const duration = Math.random() * 8 + 7;
    const delay = Math.random() * 8;
    el.style.cssText = `
      left: ${Math.random() * 98}%;
      font-size: ${size}rem;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(el);
  }
})();

// CLICK / TAP HEART BURST
document.addEventListener('click', (e) => {
  // don't trigger burst inside buttons so click feedback remains clean
  if (e.target.closest('button') || e.target.closest('.nav-dot')) return;
  const heart = document.createElement('div');
  heart.className = 'click-heart';
  const symbols = ['💖', '❤️', '💕', '✨', '🌸', '💐', '🥰'];
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.left = e.clientX + 'px';
  heart.style.top = e.clientY + 'px';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1200);
});

// LIGHTBOX
function openLightbox(el) {
  const img = el.querySelector('img');
  if (img) {
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox').classList.add('active');
  }
}

// MUSIC
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
if (bgMusic) bgMusic.volume = 0.35;
let musicPlaying = false;
if (musicBtn && bgMusic) {
  musicBtn.addEventListener('click', () => {
    if (musicPlaying) {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
    } else {
      bgMusic.play().then(() => {
        musicBtn.classList.add('playing');
      }).catch(() => {});
    }
    musicPlaying = !musicPlaying;
  });
}

// HEART & GLITTER CONFETTI
function triggerHeartConfetti(count = 80) {
  const colors = ['#ff4081', '#ff65a3', '#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#ffffff'];
  const symbols = ['❤️', '💖', '💕', '✨'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const isEmoji = Math.random() > 0.45;
    if (isEmoji) {
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
      el.style.background = 'transparent';
    } else {
      const size = Math.random() * 10 + 6;
      const isCircle = Math.random() > 0.5;
      el.style.width = size + 'px';
      el.style.height = (isCircle ? size : size * 2.2) + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = isCircle ? '50%' : '3px';
    }
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-20px';
    el.style.animationDuration = (Math.random() * 2.5 + 2.5) + 's';
    el.style.animationDelay = (Math.random() * 0.8) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

// BLOW CANDLES
function blowCandles() {
  const box = document.getElementById('cakeBox');
  if (!box) return;
  box.classList.add('blown');
  triggerHeartConfetti(120);
  setTimeout(() => {
    const cakeEl = box.querySelector('.cake-emoji');
    if (cakeEl) {
      cakeEl.style.filter = 'drop-shadow(0 0 50px rgba(255,64,129,0.9))';
    }
  }, 400);
}

// KEYBOARD NAV
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToSection(currentSection + 1);
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToSection(currentSection - 1);
});

// INIT LUCIDE ICONS
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
} else {
  window.addEventListener('load', () => lucide && lucide.createIcons());
}