import { createRoot } from 'react-dom/client';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/app.css';
import { mountSiteChrome } from './mountChrome';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Results from '../components/sections/Results';
import Portfolio from '../components/sections/Portfolio';
import PlansTeaser from '../components/sections/Plans/PlansTeaser';
import PlansPage from '../components/sections/Plans/PlansPage';
import LegalPage from '../components/sections/Legal/LegalPage';
import BlogIndex from '../components/sections/Blog/BlogIndex';
import BlogSingle from '../components/sections/Blog/BlogSingle';
import Contact from '../components/sections/Contact';
import ShareButtons from '../components/sections/Share/ShareButtons';
import {
  sameDocumentLocation,
  scrollAfterNavigation,
  scrollToHash,
  waitForPageReady,
} from '../navigation/inkRouter';

/**
 * Bundle único cargado en TODAS las páginas. Responsabilidades:
 *  1. Montar el chrome (header + WhatsApp flotante) UNA sola vez — vive fuera
 *     de <main>, así persiste entre navegaciones AJAX y sus animaciones no
 *     se reinician.
 *  2. Hidratar las secciones interactivas presentes en el <main> actual.
 *  3. Navegación AJAX: intercepta clics en links internos, hace fetch de la
 *     página destino, intercambia SOLO el <main> (WordPress ya la renderizó
 *     en PHP, con su SEO intacto) y vuelve a montar las secciones — sin
 *     recargar la página.
 */

const MAIN_ID = 'contenido-principal';

// Roots de React montados en el <main> actual (se desmontan antes de cada swap).
let pageRoots = [];

function readPageData(scope) {
  const el = scope.querySelector('#ink-page-data');
  if (!el) return {};
  try {
    return JSON.parse(el.textContent);
  } catch {
    return {};
  }
}

function mountPage() {
  const main = document.getElementById(MAIN_ID);
  if (!main) return;
  const data = readPageData(main);

  const mount = (id, Component, props) => {
    const el = document.getElementById(id);
    if (!el) return;
    const root = createRoot(el);
    root.render(<Component {...props} />);
    pageRoots.push(root);
  };

  // Secciones del home
  mount('hero-root', Hero, data.hero ?? {});
  mount('services-root', Services, data.services ?? {});
  mount('results-root', Results, data.results ?? {});
  mount('portfolio-root', Portfolio, data.portfolio ?? {});
  mount('plans-root', PlansTeaser, data.plans ?? {});
  mount('plans-page-root', PlansPage, data.plansPage ?? {});
  mount('legal-page-root', LegalPage, data.legalPage ?? {});
  mount('blog-index-root', BlogIndex, data.blogIndex ?? {});
  mount('blog-single-root', BlogSingle, data.blogSingle ?? {});
  mount('contact-root', Contact, data.contact ?? {});

  // Botones de compartir (single de blog)
  const shareEl = document.getElementById('share-buttons-root');
  if (shareEl) {
    const root = createRoot(shareEl);
    root.render(<ShareButtons url={shareEl.dataset.url} title={shareEl.dataset.title} />);
    pageRoots.push(root);
  }
}

function unmountPage() {
  // Cada root de React se desmonta (sus cleanups matan los ScrollTriggers de
  // las animaciones), evitando fugas y triggers huérfanos.
  pageRoots.forEach((root) => root.unmount());
  pageRoots = [];
}

// ---------------------------------------------------------------------------
// Router AJAX
// ---------------------------------------------------------------------------

function isInternalNavigable(anchor) {
  if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
  const rel = anchor.getAttribute('rel') || '';
  if (rel.includes('external')) return false;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;

  // No interceptar assets ni el backend de WordPress.
  if (/\/wp-(admin|login|json|content|includes)/.test(url.pathname)) return false;

  return true;
}

function updateHead(newDoc) {
  document.title = newDoc.title;

  const selectors = [
    'meta[name="description"]',
    'meta[name="robots"]',
    'link[rel="canonical"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:url"]',
    'meta[property="og:type"]',
    'meta[property="og:image"]',
    'script[type="application/ld+json"]',
  ];

  selectors.forEach((sel) => {
    const current = document.head.querySelector(sel);
    const next = newDoc.head.querySelector(sel);
    if (current && next) {
      current.replaceWith(next.cloneNode(true));
    } else if (!current && next) {
      document.head.appendChild(next.cloneNode(true));
    } else if (current && !next) {
      current.remove();
    }
  });
}

function pushPageview(pathname) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'ink_pageview', page_path: pathname });
}

async function navigate(url, { push = true } = {}) {
  const targetUrl = new URL(url, window.location.href);
  const fetchUrl = `${targetUrl.origin}${targetUrl.pathname}${targetUrl.search}`;

  let html;
  try {
    const res = await fetch(fetchUrl, {
      headers: { 'X-Requested-With': 'ink-ajax' },
      credentials: 'same-origin',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch {
    window.location.href = url;
    return;
  }

  const newDoc = new DOMParser().parseFromString(html, 'text/html');
  const newMain = newDoc.getElementById(MAIN_ID);
  if (!newMain) {
    window.location.href = url;
    return;
  }

  const apply = () => {
    unmountPage();
    document.getElementById(MAIN_ID).replaceWith(document.importNode(newMain, true));
    updateHead(newDoc);
    document.body.className = newDoc.body.className;
    if (push) window.history.pushState({ ink: true }, '', url);
    mountPage();
    window.dispatchEvent(new CustomEvent('ink:navigated'));
    pushPageview(targetUrl.pathname);
  };

  if (document.startViewTransition) {
    await document.startViewTransition(apply).finished;
  } else {
    apply();
  }

  await scrollAfterNavigation(url, { push: false, instant: !targetUrl.hash });
}

function handleSamePageLink(url, { push = true } = {}) {
  if (push) {
    window.history.pushState({ ink: true }, '', url.href);
  }
  scrollToHash(url.hash);
}

function initRouter() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const anchor = e.target.closest('a[href]');
    if (!isInternalNavigable(anchor)) return;

    const url = new URL(anchor.href, window.location.href);

    if (sameDocumentLocation(url, window.location.href)) {
      e.preventDefault();
      handleSamePageLink(url);
      return;
    }

    e.preventDefault();
    navigate(url.href, { push: true });
  });

  window.addEventListener('popstate', () => {
    navigate(window.location.href, { push: false });
  });
}

// Arranque
mountSiteChrome();
mountPage();
initRouter();

if (window.location.hash) {
  waitForPageReady().then(() => {
    scrollToHash(window.location.hash, { instant: true });
  });
}

requestAnimationFrame(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
