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
 * Espera a que React monte secciones y ScrollTrigger recalcule pins.
 */
export function waitForPageReady() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        setTimeout(() => {
          ScrollTrigger.refresh();
          resolve();
        }, 120);
      });
    });
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
    scrollTo: { y: target, offsetY: NAV_SCROLL_OFFSET, autoKill: true },
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
