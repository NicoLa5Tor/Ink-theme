import { createRoot } from 'react-dom/client';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/app.css';
import { mountSiteChrome } from './mountChrome';
import {
  landOnAnchorSettled,
  normalizePath,
  sameDocumentLocation,
  scrollToHash,
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

// --- Keep-alive de vistas ---------------------------------------------------
// En vez de destruir el <main> al navegar (re-fetch + re-montar React + recrear
// los pins de GSAP, lo que hacía nacer la página "corta" y crecer), cada vista se
// mantiene VIVA: al salir se desconecta del DOM pero se conservan su nodo, sus
// roots de React y sus ScrollTriggers (solo se DESHABILITAN). Al volver, se
// re-inserta tal cual, se rehabilitan sus triggers y un refresh síncrono la deja
// ALTA de una: no hay re-fetch, ni re-montaje, ni re-ejecución de la intro, y el
// scroll a #contacto cae perfecto sin bucle de asentamiento.

const BG_MAX = 6; // vistas de fondo (además de la actual) que se mantienen vivas.

// Vista conectada al DOM ahora mismo: { key, node, roots, doc }.
let current = null;
// Vistas vivas pero desconectadas, por clave de ruta.
const bgViews = new Map();
// Roots de React de la vista en construcción (mountPage los va llenando).
let pageRoots = [];

function viewKey(u) {
  const url = u instanceof URL ? u : new URL(u, window.location.href);
  return normalizePath(url.pathname) + (url.search || '');
}

// ScrollTriggers cuyo `trigger` vive dentro de un nodo. `node.contains` sigue
// siendo válido aunque el subárbol esté desconectado del documento.
function triggersWithin(node) {
  return ScrollTrigger.getAll().filter((st) => st.trigger && node.contains(st.trigger));
}

// Snapshot del <head> actual para poder restaurarlo al volver a una vista viva
// (updateHead lee .title y .head.querySelector; body.className también).
function captureDocSnapshot() {
  return {
    title: document.title,
    head: document.head.cloneNode(true),
    body: { className: document.body.className },
  };
}

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
    // Doble rAF: root.render() es asíncrono; los pins se crean en el
    // useLayoutEffect que corre cuando React pinta. Con un solo rAF el refresh
    // podía adelantarse a ese commit y medir la página sin pin-spacers.
    requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
  });
  return done;
}

// Destruye una vista de verdad (al evacuarla del keep-alive por el tope BG_MAX):
// mata sus ScrollTriggers y desmonta sus roots de React.
// try/catch en unmount: GSAP/MaskedHeading mueven nodos del DOM (pin-spacers,
// SVG), así que React puede lanzar removeChild al desmontar; es benigno porque
// el nodo entero se descarta.
function destroyView(view) {
  triggersWithin(view.node).forEach((st) => st.kill(true));
  view.roots.forEach((root) => {
    try {
      root.unmount();
    } catch {
      /* nodo movido por GSAP/SVG; se descarta con la vista */
    }
  });
}

// ---------------------------------------------------------------------------
// Router AJAX
// ---------------------------------------------------------------------------

// Caché de HTML por URL (solo esta sesión; se limpia al recargar de verdad).
// Volver a una página ya visitada —o clicar un link ya "prefetcheado" al pasar
// el mouse— reutiliza el HTML y evita pegarle otra vez al servidor: el
// intercambio del <main> es inmediato. Tope simple para no crecer sin límite.
const PAGE_CACHE_MAX = 12;
const pageCache = new Map();
// fetch en vuelo por URL: evita disparar dos peticiones si el prefetch (hover) y
// el clic ocurren casi a la vez; ambos esperan la misma promesa.
const pageInflight = new Map();

function cachePageHtml(key, html) {
  pageCache.set(key, html);
  // Descarta la entrada más antigua si se pasa del tope (Map preserva orden).
  if (pageCache.size > PAGE_CACHE_MAX) {
    pageCache.delete(pageCache.keys().next().value);
  }
}

/**
 * Devuelve el HTML de una URL, desde caché si está; si no, hace el fetch (una
 * sola petición aunque se llame varias veces en paralelo) y lo guarda.
 *
 * @param {string} fetchUrl
 * @returns {Promise<string>}
 */
function fetchPageHtml(fetchUrl) {
  if (pageCache.has(fetchUrl)) return Promise.resolve(pageCache.get(fetchUrl));
  if (pageInflight.has(fetchUrl)) return pageInflight.get(fetchUrl);

  const req = fetch(fetchUrl, {
    headers: { 'X-Requested-With': 'ink-ajax' },
    credentials: 'same-origin',
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then((html) => {
      cachePageHtml(fetchUrl, html);
      pageInflight.delete(fetchUrl);
      return html;
    })
    .catch((err) => {
      pageInflight.delete(fetchUrl);
      throw err;
    });

  pageInflight.set(fetchUrl, req);
  return req;
}

/**
 * Prefetch silencioso: precarga el HTML a la caché al detectar intención (hover/
 * foco). Nunca navega ni lanza; si falla, se ignora y el clic hará el fetch real.
 *
 * @param {string} href
 */
function prefetchPage(href) {
  let fetchUrl;
  try {
    const u = new URL(href, window.location.href);
    fetchUrl = `${u.origin}${u.pathname}${u.search}`;
  } catch {
    return;
  }
  if (pageCache.has(fetchUrl) || pageInflight.has(fetchUrl)) return;
  fetchPageHtml(fetchUrl).catch(() => {});
}

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
  const key = viewKey(targetUrl);

  // Ya estamos en esa ruta (mismo documento): solo reposicionar.
  if (current && key === current.key) {
    if (push) window.history.pushState({ ink: true }, '', url);
    if (targetUrl.hash) scrollToHash(targetUrl.hash);
    else window.scrollTo(0, 0);
    return;
  }

  // Nodo destino: reutilizar la vista viva si existe, o construir una nueva desde
  // el HTML SSR de WordPress.
  const reuse = bgViews.get(key);
  let targetNode;
  let targetDoc;
  const isFresh = !reuse;

  if (reuse) {
    targetNode = reuse.node;
    targetDoc = reuse.doc;
    bgViews.delete(key);
  } else {
    let html;
    try {
      html = await fetchPageHtml(fetchUrl);
    } catch {
      window.location.href = url;
      return;
    }
    targetDoc = new DOMParser().parseFromString(html, 'text/html');
    const newMain = targetDoc.getElementById(MAIN_ID);
    if (!newMain) {
      window.location.href = url;
      return;
    }
    targetNode = document.importNode(newMain, true);
  }

  targetNode.style.visibility = 'hidden';

  // Intercambio: replaceWith desconecta la vista actual y conecta la destino en
  // el mismo lugar. La actual NO se destruye: se guarda viva (sus triggers se
  // deshabilitan) para poder volver a ella instantánea y alta.
  const outgoing = current;
  document.getElementById(MAIN_ID).replaceWith(targetNode);
  if (outgoing) {
    triggersWithin(outgoing.node).forEach((st) => st.disable());
    bgViews.set(outgoing.key, outgoing);
    while (bgViews.size > BG_MAX) {
      const oldestKey = bgViews.keys().next().value;
      const victim = bgViews.get(oldestKey);
      bgViews.delete(oldestKey);
      destroyView(victim);
    }
  }

  updateHead(targetDoc);
  document.body.className = targetDoc.body.className;
  if (push) window.history.pushState({ ink: true }, '', url);
  window.dispatchEvent(new CustomEvent('ink:navigated'));
  pushPageview(targetUrl.pathname);

  let revealed = false;
  const revealMain = () => {
    if (revealed) return;
    revealed = true;
    targetNode.style.visibility = '';
  };

  if (!isFresh) {
    // VISTA REUTILIZADA: React ya está montado y los pins ya existen. Rehabilitar
    // sus triggers y refrescar (síncrono → la página nace ALTA de una), luego
    // posicionar y revelar. Sin re-fetch, sin re-montaje, sin re-intro.
    current = { key, node: targetNode, roots: reuse.roots, doc: reuse.doc };
    pageRoots = reuse.roots;
    triggersWithin(targetNode).forEach((st) => st.enable());
    ScrollTrigger.refresh();
    if (targetUrl.hash) scrollToHash(targetUrl.hash, { instant: true });
    else window.scrollTo(0, 0);
    // Al deshabilitar los triggers en keep-alive, cada scrub (túnel de servicios,
    // cortina del hero) queda "congelado" en el progreso donde se dejó (p. ej. el
    // FINAL). ScrollTrigger.update() fuerza a que todos recomputen su progreso
    // según el scroll REAL donde acabamos de caer, así al llegar a #servicios el
    // túnel se ve en su INICIO (no como si ya se hubiera scrolleado todo).
    ScrollTrigger.update();
    requestAnimationFrame(() => {
      ScrollTrigger.update();
      revealMain();
    });
    setTimeout(() => {
      ScrollTrigger.update();
      revealMain();
    }, 200);
    return;
  }

  // VISTA NUEVA: montar React. La actual nace arriba (sin ancla) o se asienta en
  // el ancla con el <main> oculto hasta que los pins existen (landOnAnchorSettled).
  pageRoots = [];
  current = { key, node: targetNode, roots: pageRoots, doc: targetDoc };
  if (!targetUrl.hash) window.scrollTo(0, 0);
  const mounted = mountPage();

  if (targetUrl.hash) {
    const fontsReady = document.fonts?.ready ? document.fonts.ready.catch(() => {}) : Promise.resolve();
    Promise.resolve(mounted)
      .catch(() => {})
      .then(() => fontsReady)
      .then(() => landOnAnchorSettled(targetUrl.hash))
      .then(revealMain, revealMain);
    setTimeout(revealMain, 2200); // respaldo duro: nunca dejar el <main> oculto
  } else {
    mounted.then(
      () => requestAnimationFrame(() => requestAnimationFrame(revealMain)),
      revealMain,
    );
    setTimeout(revealMain, 250);
  }
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

  // Prefetch al detectar intención: al pasar el mouse / enfocar / tocar un link
  // interno, se precarga su HTML a la caché para que el clic sea inmediato. Es
  // silencioso e idempotente (prefetchPage ignora URLs ya cacheadas/en vuelo y
  // nunca lanza). No se prefetchea el ancla de la misma página (no hay fetch).
  const maybePrefetch = (e) => {
    const anchor = e.target.closest?.('a[href]');
    if (!isInternalNavigable(anchor)) return;
    const url = new URL(anchor.href, window.location.href);
    if (sameDocumentLocation(url, window.location.href)) return;
    prefetchPage(anchor.href);
  };
  document.addEventListener('mouseover', maybePrefetch, { passive: true });
  document.addEventListener('focusin', maybePrefetch, { passive: true });
  document.addEventListener('touchstart', maybePrefetch, { passive: true });
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
const bootMounted = mountPage();
bootMounted.then(revealPage);
// Vista inicial (la que renderizó WordPress): queda como `current` viva. Su
// snapshot de <head> permite restaurarla al volver por keep-alive. `pageRoots`
// es el mismo array que mountPage está llenando, así que la referencia se
// mantiene en sync.
current = {
  key: viewKey(window.location.href),
  node: document.getElementById(MAIN_ID),
  roots: pageRoots,
  doc: captureDocSnapshot(),
};
initRouter();

// Respaldo: si algo se demora demasiado, revela igual (nunca dejar la página
// atrapada bajo el preloader).
setTimeout(revealPage, 3000);

if (window.location.hash) {
  // Carga directa con ancla (p. ej. abrir /#contacto desde Google): mismo bucle
  // de asentamiento que la navegación SPA, para caer en la sección ya con los
  // pins creados y no "a medias".
  const fontsReady = document.fonts?.ready ? document.fonts.ready.catch(() => {}) : Promise.resolve();
  Promise.resolve(bootMounted)
    .catch(() => {})
    .then(() => fontsReady)
    .then(() => landOnAnchorSettled(window.location.hash));
}

requestAnimationFrame(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
