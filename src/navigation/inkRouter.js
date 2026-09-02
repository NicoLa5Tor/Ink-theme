import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/** Offset del header fijo al hacer scroll a anclas. */
export const NAV_SCROLL_OFFSET = 96;

/**
 * Normaliza pathname para comparar rutas (/planes vs /planes/).
 *
 * @param {string} pathname
 */
export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

/**
 * @param {string|URL} a
 * @param {string|URL} b
 */
export function sameDocumentLocation(a, b) {
  const ua = new URL(a, window.location.href);
  const ub = new URL(b, window.location.href);
  return normalizePath(ua.pathname) === normalizePath(ub.pathname) && ua.search === ub.search;
}

/**
 * Espera a que la página esté REALMENTE asentada antes de scrollear:
 *   1. `mounted`: promesa de mountPage() (terminaron los import() de secciones).
 *   2. doble rAF: root.render() de React es asíncrono; los pins se crean en el
 *      useLayoutEffect que corre cuando React pinta. Tras dos frames el commit
 *      ya ocurrió y los pin-spacers están en el DOM.
 *   3. document.fonts.ready: las fuentes de marca cambian alturas de texto.
 *   4. ScrollTrigger.refresh(): recalcula con la geometría final.
 * Reemplaza el setTimeout(120) adivinado por esperas deterministas, para que el
 * scroll a un ancla no se dispare antes de que existan los pins.
 *
 * @param {Promise<unknown>} [mounted]  promesa de montaje de las secciones
 */
export function waitForPageReady(mounted) {
  const twoFrames = () =>
    new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

  return Promise.resolve(mounted)
    .catch(() => {})
    .then(twoFrames)
    .then(() => (document.fonts?.ready ? document.fonts.ready.catch(() => {}) : null))
    .then(() => {
      ScrollTrigger.refresh();
    });
}

/**
 * Aterriza en un ancla y CORRIGE la posición mientras el layout se asienta.
 *
 * Al montar la página (navegación SPA o carga directa), los pins de
 * ScrollTrigger (Hero/Servicios/Portafolio) se crean de forma asíncrona y cada
 * uno añade su "pin-spacer" (miles de px de scroll). Si se salta al ancla antes
 * de que TODOS existan, se cae en la posición del layout "corto" y luego la
 * página crece y el ancla queda mucho más abajo -> el scroll se ve "a medias".
 *
 * En vez de adivinar el momento, este helper hace un bucle por frames: en cada
 * frame fuerza un refresh, recalcula la posición del ancla y salta ahí (salto
 * instantáneo = invisible mientras el <main> está oculto). Termina cuando la
 * posición se estabiliza (misma, ±2px, varios frames seguidos) o por timeout.
 * Así se revela recién cuando ya está en su sitio final.
 *
 * @param {string} hash
 * @param {{ offset?: number, timeout?: number, stableFrames?: number }} [options]
 * @returns {Promise<void>}
 */
export function landOnAnchorSettled(hash, { offset = NAV_SCROLL_OFFSET, timeout = 1500, stableTicks = 3, interval = 32 } = {}) {
  const id = hash?.startsWith('#') ? hash.slice(1) : hash;
  return new Promise((resolve) => {
    if (!id) {
      window.scrollTo(0, 0);
      resolve();
      return;
    }
    // Un solo refresh al entrar (la página ya está montada al llamarse esto).
    ScrollTrigger.refresh();
    const start = performance.now();
    let lastTop = null;
    let stable = 0;

    // setTimeout (no requestAnimationFrame): rAF se CONGELA en pestañas en
    // segundo plano; si el usuario cambia de pestaña a mitad de navegación el
    // aterrizaje nunca ocurriría. setTimeout sigue corriendo (throttled) y
    // garantiza que caiga en la sección.
    const step = () => {
      const el = document.getElementById(id);
      const elapsed = performance.now() - start;

      if (!el) {
        if (elapsed < timeout) setTimeout(step, interval);
        else resolve();
        return;
      }

      const top = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - offset));
      window.scrollTo(0, top);

      if (lastTop !== null && Math.abs(top - lastTop) <= 2) stable += 1;
      else stable = 0;
      lastTop = top;

      if (stable >= stableTicks || elapsed >= timeout) resolve();
      else setTimeout(step, interval);
    };

    setTimeout(step, interval);
  });
}

/**
 * Scroll preciso a ancla (compatible con pins de GSAP).
 *
 * @param {string} [hash]
 * @param {{ duration?: number, instant?: boolean }} [options]
 */
export function scrollToHash(hash, { duration = 0.75, instant = false } = {}) {
  const id = hash?.startsWith('#') ? hash.slice(1) : hash;

  ScrollTrigger.refresh();

  if (!id) {
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: instant ? 0 : duration,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
    return;
  }

  const target = document.getElementById(id);
  if (!target) {
    window.scrollTo(0, 0);
    return;
  }

  gsap.to(window, {
    // autoKill: false -> el destino (p. ej. #contacto) está DESPUÉS de las
    // secciones con pin; al pasar por un pin, anticipatePin empuja levemente el
    // scroll y, con autoKill:true, GSAP creía que el usuario tomó el control y
    // mataba la animación a medias (por eso a veces "no llegaba" a contacto).
    scrollTo: { y: target, offsetY: NAV_SCROLL_OFFSET, autoKill: false },
    duration: instant ? 0 : duration,
    ease: 'power2.inOut',
    overwrite: 'auto',
    onComplete: () => ScrollTrigger.refresh(),
  });
}

/**
 * @param {string} url
 * @param {{ push?: boolean, instant?: boolean }} [options]
 */
export async function scrollAfterNavigation(url, { push = true, instant = false } = {}) {
  const { hash } = new URL(url, window.location.href);

  if (push && hash) {
    window.history.pushState({ ink: true }, '', url);
  }

  await waitForPageReady();
  scrollToHash(hash, { instant });
}
