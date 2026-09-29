// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// "What We Build" rows — click to expand (touch-friendly, hover handled in CSS)
document.querySelectorAll('.build-row').forEach(row => {
  row.addEventListener('click', () => {
    const wasActive = row.classList.contains('active');
    document.querySelectorAll('.build-row.active').forEach(r => r.classList.remove('active'));
    if (!wasActive) row.classList.add('active');
  });
});

// FAQ accordion
document.querySelectorAll('.acc-item').forEach(item => {
  const trigger = item.querySelector('.acc-trigger');
  trigger.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Project console — reveal lines sequentially once in view, then loop status text
const consoleSection = document.querySelector('.console');
if (consoleSection) {
  const lines = consoleSection.querySelectorAll('.console-line');
  let started = false;

  const consoleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('shown'), i * 260);
        });
        consoleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  consoleObserver.observe(consoleSection);
}

// Hero logo — cursor-reactive tilt/parallax
const heroVisual = document.getElementById('hero-visual');
const heroLogo = document.getElementById('hero-logo');
const BASE_ROTATE = -6;

if (heroVisual && heroLogo) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotate = BASE_ROTATE + x * 16;
    const tiltX = y * -14;
    heroLogo.style.transform =
      `perspective(600px) rotate(${rotate}deg) rotateX(${tiltX}deg) translate(${x * 18}px, ${y * 18}px)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    heroLogo.style.transform = `rotate(${BASE_ROTATE}deg)`;
  });

  heroLogo.style.transform = `rotate(${BASE_ROTATE}deg)`;
}

// Referral form — build a pre-filled WhatsApp message so submissions land in our inbox
const referralForm = document.getElementById('referral-form');
const BUSINESS_WHATSAPP = '919180459086';
if (referralForm) {
  referralForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(referralForm);
    const yourName = data.get('yourName').trim();
    const yourPhone = data.get('yourPhone').trim();
    const friendName = data.get('friendName').trim();
    const friendPhone = data.get('friendPhone').trim();
    const pkg = data.get('package');
    const message = data.get('message').trim();

    const text =
      `*New Referral — Bro Build*\n` +
      `Referrer: ${yourName} (${yourPhone})\n` +
      `Friend: ${friendName} (${friendPhone})\n` +
      `Interested package: ${pkg}\n` +
      `Message: ${message || '—'}`;

    const waLink = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(waLink, '_blank');

    const note = document.getElementById('referral-note');
    if (note) note.textContent = 'WhatsApp should now be open — hit send to complete the referral.';
  });
}
