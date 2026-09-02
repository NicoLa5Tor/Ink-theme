import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GooeyNav from '../../ui/GooeyNav';
import { HERO_PIN_VH } from '../../../animations/introTiming';

gsap.registerPlugin(ScrollTrigger);

/**
 * Luminancia del primer fondo opaco encontrado en (x, y) subiendo por el árbol.
 * Ignora el propio menú. Devuelve un valor 0–255 (bajo = oscuro).
 */
function luminanceAt(x, y, ignore) {
  let el = document.elementFromPoint(x, y);
  while (el && el !== document.documentElement) {
    if (ignore && (el === ignore || ignore.contains(el))) {
      el = el.parentElement;
      continue;
    }
    const parts = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    if (parts && (parts[3] === undefined || Number(parts[3]) > 0.2)) {
      return 0.299 * +parts[0] + 0.587 * +parts[1] + 0.114 * +parts[2];
    }
    el = el.parentElement;
  }
  return 10; // por defecto oscuro (fondo charcoal del body)
}

/**
 * ¿El fondo detrás del menú es claro? Promedia tres puntos verticales para
 * decidir bien aunque haya un borde de sección en el centro (el home mezcla
 * secciones claras y oscuras).
 */
function isLightBehind(ignore) {
  const x = Math.round(window.innerWidth / 2);
  const lums = [0.18, 0.5, 0.82]
    .map((f) => Math.round(window.innerHeight * f))
    .map((y) => luminanceAt(x, y, ignore));
  return lums.reduce((a, b) => a + b, 0) / lums.length > 140;
}

/**
 * Header flotante con transformación ligada al scroll (estilo reactbits.dev):
 * arriba de la página la barra ocupa (casi) todo el ancho con el contenido
 * disperso — logo a un extremo, el nav al otro y sus items separados entre
 * sí; al bajar se compacta: el ancho se encoge, el gap del nav se cierra y
 * se "forma" el fondo oscuro + borde + sombra (ScrollTrigger scrub en los
 * ~180px posteriores al pin del hero: mientras el pin está activo la barra
 * sigue ancha).
 *
 * IMPORTANTE: el fondo de la barra es un color oscuro sólido (sin
 * backdrop-filter). Es requisito del efecto goo del GooeyNav: su fondo negro
 * interno se vuelve invisible con mix-blend-mode:lighten SOLO si detrás hay
 * un fondo oscuro y NINGÚN ancestro con backdrop-filter (que aislaría el
 * blending y dejaría el recuadro negro visible). Por eso NO se usa blur de
 * vidrio aquí.
 *
 * El scroll-transform solo se activa con un Hero oscuro detrás (#hero-root,
 * home); en el resto de páginas la barra arranca ya compacta.
 */
export default function Header({ siteName, homeUrl, logoWhiteUrl, maskImageUrl = '', menuItems = [] }) {
  const [open, setOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/',
  );
  const barRef = useRef(null);
  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  const menuTlRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    const wrap = wrapRef.current;
    if (!bar || !wrap) return undefined;

    const compact = {
      paddingLeft: 22,
      paddingRight: 22,
      backgroundColor: 'rgba(10,10,10,0.85)',
      borderColor: 'rgba(255,255,255,0.16)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    };

    // Ancho compacto: se mide con el gap del nav cerrado y el padding pequeño.
    const measureCompact = () => {
      bar.style.width = 'auto';
      bar.style.setProperty('--gnav-gap', '0.5rem');
      gsap.set(bar, { paddingLeft: 22, paddingRight: 22 });
      return bar.getBoundingClientRect().width;
    };

    let ctx = null;
    let logoCtx = null;
    let introStarted = false;

    const hideIntro = () => {
      const fly = wrap.querySelector('[data-logo-fly]');
      const veil = wrap.querySelector('[data-logo-veil]');
      const headerLogo = bar.querySelector('[data-header-logo]');
      const menuBtn = bar.querySelector('[data-header-menu]');
      if (fly) gsap.set(fly, { autoAlpha: 0 });
      if (veil) gsap.set(veil, { autoAlpha: 0 });
      if (headerLogo) gsap.set(headerLogo, { autoAlpha: 1 });
      if (menuBtn) gsap.set(menuBtn, { autoAlpha: 1 });
    };

    // (Re)configura el comportamiento del header según la página actual. Se
    // llama al montar y en cada navegación AJAX ('ink:navigated'), porque el
    // header persiste entre páginas pero su animación depende de si la nueva
    // página tiene un Hero oscuro detrás (#hero-root, solo el home).
    const setup = () => {
      if (ctx) ctx.revert();
      if (logoCtx) logoCtx.revert();
      gsap.set(bar, { clearProps: 'width,paddingLeft,paddingRight,backgroundColor,borderColor,boxShadow' });
      bar.style.removeProperty('--gnav-gap');

      const hugW = measureCompact();
      const innerW = bar.parentElement.clientWidth - 32;
      const isCompactViewport = window.innerWidth < 1024;
      // En móvil/tablet el pill no se encoge al ancho del logo: queda largo.
      const compactW = isCompactViewport
        ? Math.max(hugW, innerW * (window.innerWidth < 768 ? 0.94 : 0.88))
        : hugW;
      const compactPad = isCompactViewport ? 28 : 22;

      if (!document.getElementById('hero-root')) {
        gsap.set(bar, { ...compact, width: compactW, paddingLeft: compactPad, paddingRight: compactPad });
        gsap.set('.gooey-nav-container .effect', { opacity: 1 });
        hideIntro();
        ctx = null;
        logoCtx = null;
        return;
      }

      const widePad = isCompactViewport ? 28 : 40;
      gsap.set(bar, {
        width: innerW,
        paddingLeft: widePad,
        paddingRight: widePad,
        '--gnav-gap': '2.6rem',
      });

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.documentElement,
            start: () => window.innerHeight * HERO_PIN_VH,
            end: () => window.innerHeight * HERO_PIN_VH + 180,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          bar,
          {
            width: innerW,
            paddingLeft: widePad,
            paddingRight: widePad,
            '--gnav-gap': '2.6rem',
            backgroundColor: 'rgba(10,10,10,0)',
            borderColor: 'rgba(255,255,255,0)',
            boxShadow: '0 8px 32px rgba(0,0,0,0)',
          },
          {
            width: compactW,
            paddingLeft: compactPad,
            paddingRight: compactPad,
            '--gnav-gap': '0.5rem',
            backgroundColor: 'rgba(10,10,10,0.85)',
            borderColor: 'rgba(255,255,255,0.16)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            ease: 'none',
          },
          0
        );

        // La capa del goo (que lleva el recuadro negro) se desvanece con el
        // fondo: invisible arriba (sin contenedor), visible al formarse el pill.
        tl.fromTo('.gooey-nav-container .effect', { opacity: 0 }, { opacity: 1, ease: 'none' }, 0);
      }, bar);

      const fly = wrap.querySelector('[data-logo-fly]');
      const veil = wrap.querySelector('[data-logo-veil]');
      const ink = wrap.querySelector('[data-intro-ink]');
      const headerLogo = bar.querySelector('[data-header-logo]');
      const menuBtn = bar.querySelector('[data-header-menu]');
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!fly || !veil || !ink || !headerLogo || prefersReduced || introStarted) {
        hideIntro();
        introStarted = true;
        logoCtx = null;
        return;
      }

      introStarted = true;

      logoCtx = gsap.context(() => {
        const startPose = () => {
          const pad = window.innerWidth < 768 ? 0.08 : 0.06;
          const maxW = window.innerWidth * (1 - pad * 2);
          const maxH = window.innerHeight * (window.innerWidth < 768 ? 0.2 : 0.28);
          const w = Math.max(fly.offsetWidth, 1);
          const h = Math.max(fly.offsetHeight, 1);
          const scale = Math.min(maxW / w, maxH / h);
          return {
            x: (window.innerWidth - w * scale) / 2,
            y: (window.innerHeight - h * scale) / 2,
            scale,
          };
        };
        const endPose = () => {
          const slot = headerLogo.getBoundingClientRect();
          return {
            x: slot.left,
            y: slot.top,
            scale: slot.height / ink.offsetHeight,
          };
        };

        gsap.set(headerLogo, { autoAlpha: 0 });
        gsap.set(veil, { autoAlpha: 1 });
        gsap.set(fly, { autoAlpha: 0, transformOrigin: '0% 0%' });
        if (menuBtn) gsap.set(menuBtn, { autoAlpha: 0 });

        const logoTl = gsap.timeline({
          paused: true,
          onComplete: () => {
            hideIntro();
          },
        });

        logoTl.to(fly, { autoAlpha: 1, duration: 0.55, ease: 'power3.out' }, 0);
        logoTl.to(
          fly,
          {
            x: () => endPose().x,
            y: () => endPose().y,
            scale: () => endPose().scale,
            duration: 1.15,
            ease: 'power3.inOut',
          },
          0.35,
        );
        logoTl.to(veil, { autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, 0.85);
        logoTl.to(headerLogo, { autoAlpha: 1, duration: 0.12 }, 1.35);
        logoTl.to(fly, { autoAlpha: 0, duration: 0.12 }, 1.38);
        if (menuBtn) {
          logoTl.to(menuBtn, { autoAlpha: 1, duration: 0.2 }, 1.25);
        }

        const kick = () => {
          gsap.set(fly, startPose());
          logoTl.play();
        };
        const start = () => requestAnimationFrame(() => requestAnimationFrame(kick));
        if (document.fonts?.ready) {
          document.fonts.ready.then(start).catch(start);
        } else {
          start();
        }
      }, wrap);
    };

    setup();
    window.addEventListener('ink:navigated', setup);
    window.addEventListener('resize', setup);

    return () => {
      window.removeEventListener('ink:navigated', setup);
      window.removeEventListener('resize', setup);
      if (ctx) ctx.revert();
      if (logoCtx) logoCtx.revert();
    };
  }, []);

  // Menú móvil fullscreen: una barra fina aparece centrada y se expande en
  // alto hasta llenar la pantalla; luego los links caen en cascada. Timeline
  // GSAP construido una vez, en pausa.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return undefined;

    const links = menu.querySelectorAll('.ink-mnav__link');
    const chrome = menu.querySelectorAll('.ink-mnav__brand, .ink-mnav__close');

    const ctx = gsap.context(() => {
      gsap.set(menu, { autoAlpha: 0, height: 4, clipPath: 'inset(0 0 0 100%)' });
      gsap.set(links, { autoAlpha: 0, y: 30 });
      gsap.set(chrome, { autoAlpha: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.set(menu, { autoAlpha: 1 })
        // 1) la barrita fina barre desde la derecha
        .to(menu, { clipPath: 'inset(0 0 0 0%)', duration: 0.4, ease: 'expo.inOut' })
        // 2) se amplía en alto desde el centro hasta pantalla completa
        .to(menu, { height: () => window.innerHeight, duration: 0.7, ease: 'expo.inOut' }, '-=0.05')
        // 3) los links caen escalonados
        .to(links, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .to(chrome, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, '-=0.5');
      menuTlRef.current = tl;
    }, menu);

    return () => {
      menuTlRef.current = null;
      ctx.revert();
    };
  }, [menuItems]);

  // Reproduce/revierte el menú y bloquea el scroll del body mientras está
  // abierto; Escape lo cierra.
  useEffect(() => {
    const tl = menuTlRef.current;
    const menu = menuRef.current;

    if (open && menu) {
      // El tema se decide al abrir según el fondo detrás (claro→menú oscuro,
      // oscuro→menú claro). Imperativo para que no parpadee con el render.
      menu.classList.toggle('is-ondark', !isLightBehind(menu));
    }
    if (tl) {
      // Nunca revertir desde el inicio (el montaje entra con open=false y
      // reverse() desde progress 0 tiene semántica rara en GSAP).
      if (open) tl.play();
      else if (tl.progress() > 0) tl.reverse();
    }
    document.body.style.overflow = open ? 'hidden' : '';

    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // La página actual se refresca tras cada navegación AJAX (para resaltar el
  // link vigente en el menú móvil).
  useEffect(() => {
    const onNav = () => {
      setCurrentPath(window.location.pathname);
      setOpen(false);
    };
    window.addEventListener('ink:navigated', onNav);
    return () => window.removeEventListener('ink:navigated', onNav);
  }, []);

  const isCurrentPage = (href) => {
    try {
      const u = new URL(href, window.location.href);
      if (u.hash) return false;
      const norm = (p) => (p.endsWith('/') ? p : `${p}/`);
      const ip = norm(u.pathname);
      return ip !== '/' && norm(currentPath).startsWith(ip);
    } catch {
      return false;
    }
  };

  return (
    <div
      ref={wrapRef}
      className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
      style={{ viewTransitionName: 'ink-header' }}
    >
      <div
        ref={barRef}
        className="relative flex items-center justify-between gap-4 overflow-hidden rounded-full border border-transparent px-6 py-2.5 backdrop-blur-md"
      >
        <a href={homeUrl} aria-label={siteName} className="flex shrink-0 items-center">
          <img
            data-header-logo
            src={logoWhiteUrl}
            alt={siteName}
            width="40"
            height="40"
            className="h-12 w-12 lg:h-10 lg:w-10"
          />
        </a>

        {/* Desktop: GooeyNav (efecto exacto de reactbits) */}
        <div className="hidden lg:block">
          <GooeyNav
            items={menuItems}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>

        {/* Móvil: botón hamburguesa */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-nav-mobile"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          data-header-menu
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Móvil: menú fullscreen animado */}
      <nav
        ref={menuRef}
        id="site-nav-mobile"
        className="ink-mnav lg:hidden"
        aria-hidden={!open}
      >
        <div className="ink-mnav__bar">
          <a href={homeUrl} className="ink-mnav__brand" onClick={() => setOpen(false)}>
            <img src={logoWhiteUrl} alt={siteName} width="38" height="38" />
            <span>{siteName}</span>
          </a>
          <button
            type="button"
            className="ink-mnav__close"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          >
            <span />
            <span />
          </button>
        </div>

        <ul className="ink-mnav__list">
          {menuItems.map((item) => (
            <li
              key={item.href}
              className={`ink-mnav__item${isCurrentPage(item.href) ? ' is-current' : ''}`}
            >
              <a href={item.href} className="ink-mnav__link" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="ink-logo-intro" aria-hidden="true">
        <div data-logo-veil className="ink-logo-intro__veil" />
        <div data-logo-fly className="ink-logo-intro__mark">
          <img data-intro-ink src={logoWhiteUrl} alt="" className="ink-logo-intro__ink" />
        </div>
      </div>
    </div>
  );
}
