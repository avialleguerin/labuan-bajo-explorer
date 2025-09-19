// Configuration
const CITY_NAME = 'Labuan Bajo'; // Change to your city, e.g., 'Labuan Bajo', 'Nusa Penida', etc.
const WHATSAPP_NUMBER = '62895352383302'; // Use international format without '+' e.g., 628xxxxxxx

// Helper to build WhatsApp link with a prefilled message
function buildWhatsAppLink(source = 'website') {
  const message = `Hello! I'm interested in your boat tours around ${CITY_NAME}.\n\nCould you please share availability for:\n- Two Days Trip\n- Three Days Trip\n- Four Days Trip\n\nThank you! (via ${source})`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

// Smooth scroll to section accounting for sticky header height
function smoothScrollTo(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  const header = document.querySelector('.site-header');
  const headerH = header ? header.offsetHeight : 0;
  const top = target.getBoundingClientRect().top + window.pageYOffset - (headerH + 8);
  window.scrollTo({ top, behavior: 'smooth' });
}

// Intersection Observer for reveal-on-scroll
function setupReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    })
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
}

// Update header on scroll (optional shadow)
function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 6) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
}

// Initialize WhatsApp links and city text replacements
function setupWhatsApp() {
  const links = [
    { id: 'heroWhatsApp', src: 'Hero button' },
    { id: 'contactWhatsApp', src: 'Contact section' },
    { id: 'floatWhatsApp', src: 'Floating button' },
  ];
  links.forEach(({ id, src }) => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('href', buildWhatsAppLink(src));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
  });
}

// Replace [City] placeholders in text
function replaceCityPlaceholders() {
  const placeholder = /\[City\]/g;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (placeholder.test(node.nodeValue)) {
      node.nodeValue = node.nodeValue.replace(placeholder, CITY_NAME);
    }
  });
}

// Setup nav smooth scrolling
function setupNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  nav.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(hash);
      }
    });
  });
}

// Footer year
function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

// Init on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  replaceCityPlaceholders();
  setupNav();
  setupReveals();
  setupHeaderScroll();
  setupWhatsApp();
  setYear();
  setupMapLoader();
});

// Map loader: hide overlay when iframe finishes loading, with a fallback timeout
function setupMapLoader() {
  const iframe = document.getElementById('mapFrame');
  const loader = document.getElementById('mapLoader');
  if (!iframe || !loader) return;
  const hide = () => loader.classList.add('hidden');
  // Hide when iframe load event fires
  iframe.addEventListener('load', hide);
  // Fallback: hide after 8s to avoid permanent overlay
  setTimeout(hide, 8000);
}
