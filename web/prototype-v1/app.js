document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const panel = document.querySelector('[data-world-panel]');
const toggle = document.querySelector('[data-world-toggle]');
const closeButton = document.querySelector('[data-world-close]');
const revealNodes = [...document.querySelectorAll('[data-reveal]')];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setPanel(open) {
  if (!panel || !toggle) return;

  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('panel-open', open);

  if (open) {
    const firstLink = panel.querySelector('a');
    window.requestAnimationFrame(() => firstLink?.focus());
  } else {
    toggle.focus();
  }
}

toggle?.addEventListener('click', () => {
  setPanel(toggle.getAttribute('aria-expanded') !== 'true');
});

closeButton?.addEventListener('click', () => setPanel(false));

panel?.addEventListener('click', (event) => {
  if (event.target === panel) setPanel(false);
});

panel?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setPanel(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    setPanel(false);
  }
});

function syncHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealNodes.forEach((node) => node.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08,
    },
  );

  revealNodes.forEach((node) => observer.observe(node));
}
