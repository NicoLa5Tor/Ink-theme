import { createRoot } from 'react-dom/client';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/app.css';
import { mountSiteChrome } from './mountChrome';
import {
  sameDocumentLocation,
  scrollAfterNavigation,
  scrollToHash,
  waitForPageReady,
} from '../navigation/inkRouter';

// En móvil, mostrar/ocultar la barra de direcciones cambia innerHeight y dispara
// un refresco de ScrollTrigger a mitad de scroll; como los pins usan
// end: '+=innerHeight*VH' con invalidateOnRefresh, ese recálculo mueve el final
// del pin bajo el dedo y la sección "salta". ignoreMobileResize hace que solo se
// refresque en cambios de ancho (rotación), no por la barra de direcciones.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Mapa root DOM -> módulo de sección. Cada `load` es un import() dinámico con
 * ruta literal, así que Rollup lo separa en su propio chunk y el navegador solo
 * lo descarga cuando la página actual contiene ese root. Antes las 12 secciones
 * se importaban estáticamente y viajaban en el bundle de TODAS las páginas
 * (Blog/Legal/PlansPage cargaban en el home sin usarse).
 */
const SECTION_MODULES = {
  'hero-root': { load: () => import('../components/sections/Hero'), key: 'hero' },
  'services-root': { load: () => import('../components/sections/Services'), key: 'services' },
  'results-root': { load: () => import('../components/sections/Results'), key: 'results' },
  'portfolio-root': { load: () => import('../components/sections/Portfolio'), key: 'portfolio' },
  'plans-root': { load: () => import('../components/sections/Plans/PlansTeaser'), key: 'plans' },
  'plans-page-root': { load: () => import('../components/sections/Plans/PlansPage'), key: 'plansPage' },
  'legal-page-root': { load: () => import('../components/sections/Legal/LegalPage'), key: 'legalPage' },
  'blog-index-root': { load: () => import('../components/sections/Blog/BlogIndex'), key: 'blogIndex' },
  'blog-single-root': { load: () => import('../components/sections/Blog/BlogSingle'), key: 'blogSingle' },
  'contact-root': { load: () => import('../components/sections/Contact'), key: 'contact' },
};

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

  // Solo se importan (y descargan) las secciones cuyo root existe en el <main>.
  const pending = [];

  for (const [id, { load, key }] of Object.entries(SECTION_MODULES)) {
    const el = document.getElementById(id);
    if (!el) continue;
    const props = data[key] ?? {};
    pending.push(
      load().then((mod) => {
        const Component = mod.default;
        const root = createRoot(el);
        root.render(<Component {...props} />);
        pageRoots.push(root);
      }),
    );
  }

  // Botones de compartir (single de blog) — props desde el dataset, no del JSON.
  const shareEl = document.getElementById('share-buttons-root');
  if (shareEl) {
    pending.push(
      import('../components/sections/Share/ShareButtons').then((mod) => {
        const ShareButtons = mod.default;
        const root = createRoot(shareEl);
        root.render(<ShareButtons url={shareEl.dataset.url} title={shareEl.dataset.title} />);
        pageRoots.push(root);
      }),
    );
  }

  // Las secciones montan de forma asíncrona (import dinámico): al terminar
  // todas, se recalculan las posiciones de ScrollTrigger con el DOM ya hidratado.
  const done = pending.length ? Promise.all(pending) : Promise.resolve();
  done.then(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
  return done;
}

function unmountPage() {
  // Cada root de React se desmonta (sus cleanups matan los ScrollTriggers de
  // las animaciones), evitando fugas y triggers huérfanos.
  // try/catch: ScrollTrigger envuelve elementos fijados en "pin-spacer" (mueve
  // nodos del DOM), así que React puede lanzar removeChild ("node is not a
  // child") al desmontar. Es benigno aquí: el <main> completo se reemplaza
  // enseguida, descartando cualquier nodo residual.
  // try/catch: al desmontar, React puede lanzar removeChild ("node is not a
  // child") porque GSAP/MaskedHeading manipulan el DOM imperativamente (pin-
  // spacers, SVG). Es un problema pre-existente y benigno aquí: el <main>
  // completo se reemplaza enseguida, descartando cualquier nodo residual. El
  // try/catch evita que rompa el flujo de navegación.
  pageRoots.forEach((root) => {
    try {
      root.unmount();
    } catch {
      /* nodo ya movido por GSAP/SVG; se descarta con el reemplazo del <main> */
    }
  });
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

  // Se intercambia el <main> OCULTO y se revela solo cuando las secciones ya
  // montaron y aplicaron su estado inicial (los gsap.set corren en
  // useLayoutEffect, antes de pintar). Así, al volver a una página (p. ej. Inicio
  // en la SPA), nunca se ve el HTML SSR sin animar ("como si ya hubiera hecho
  // scroll") antes de que GSAP tome el control. No se usa View Transition aquí:
  // su snapshot del DOM chocaba con el re-montaje de React (removeChild).
  const incoming = document.importNode(newMain, true);
  incoming.style.visibility = 'hidden';

  unmountPage();
  document.getElementById(MAIN_ID).replaceWith(incoming);
  updateHead(newDoc);
  document.body.className = newDoc.body.className;
  if (push) window.history.pushState({ ink: true }, '', url);
  window.dispatchEvent(new CustomEvent('ink:navigated'));
  pushPageview(targetUrl.pathname);

  // Reset del scroll a tope ANTES de revelar la vista nueva y de montar los
  // pins. Como el <main> se revela oculto->visible, y el scroll a 0 se hacía
  // después (async, en scrollAfterNavigation), la página nueva alcanzaba a
  // verse en la posición vieja (p. ej. abajo, si venías scrolleado en Inicio) y
  // luego "saltaba" arriba. Al hacerlo aquí, síncrono, la vista nueva ya nace
  // arriba y ScrollTrigger calcula los pins desde y=0. Si hay ancla (#hash), no
  // se toca: scrollAfterNavigation la posiciona tras montar.
  if (!targetUrl.hash) {
    window.scrollTo(0, 0);
  }

  let revealed = false;
  const revealMain = () => {
    if (revealed) return;
    revealed = true;
    incoming.style.visibility = '';
  };
  // Revelar cuando las secciones montaron (dos rAF: el gsap.set del hero corre
  // en useLayoutEffect, antes de pintar). El reveal se dispara pase lo que pase
  // —éxito o error de montaje— y hay un respaldo por timeout FUERA del then para
  // que el <main> nunca quede oculto (incluye pestaña en segundo plano).
  mountPage().then(
    () => requestAnimationFrame(() => requestAnimationFrame(revealMain)),
    revealMain,
  );
  setTimeout(revealMain, 250);

  await scrollAfterNavigation(url, { push: false, instant: !targetUrl.hash });
}

function handleSamePageLink(url, { push = true } = {}) {
  if (push) {
    window.history.pushState({ ink: true }, '', url.href);
  }
  scrollToHash(url.hash);
}

function initRouter() {
  // El router gestiona el scroll en cada navegación (reset a tope / anclas). Sin
  // esto, el navegador restaura la posición previa en atrás/adelante y pelea con
  // nuestro scrollTo -> otro salto.
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

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

/**
 * Oculta el preloader que cubre el flash de hidratación. Se llama cuando las
 * secciones ya montaron (mountPage resuelto): dos requestAnimationFrame aseguran
 * que el estado inicial del hero (los gsap.set) ya se pintó, así al hacer fade
 * el usuario ve el arranque de la animación, nunca el HTML sin animar detrás.
 */
let heroRevealed = false;
function revealPage() {
  if (heroRevealed) return;
  heroRevealed = true;
  const pre = document.getElementById('ink-preloader');
  if (!pre) return;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      pre.classList.add('is-hidden');
      const remove = () => pre.remove();
      pre.addEventListener('transitionend', remove, { once: true });
      setTimeout(remove, 700); // respaldo si transitionend no dispara
    }),
  );
}

// Arranque
mountSiteChrome();
mountPage().then(revealPage);
initRouter();

// Respaldo: si algo se demora demasiado, revela igual (nunca dejar la página
// atrapada bajo el preloader).
setTimeout(revealPage, 3000);

if (window.location.hash) {
  waitForPageReady().then(() => {
    scrollToHash(window.location.hash, { instant: true });
  });
}

requestAnimationFrame(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
