import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_PIN_VH } from './introTiming';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cortina del tamaño de una carta: tiras en cascada (x + onda) y el texto
 * viaja/desaparece con ellas. Después, doblado + copy.
 *
 * @param {import('react').RefObject<HTMLElement>} sectionRef
 */
export function useHeroReveal(sectionRef) {
  // useLayoutEffect (no useEffect): el gsap.set inicial que "cierra" la cortina
  // debe aplicarse ANTES de que el navegador pinte. Con useEffect corría después
  // del paint, así que al re-montar el hero (navegación SPA de vuelta a Inicio)
  // se veía un frame del HTML sin animar antes de que GSAP tomara el control.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const clientes = section.querySelector('[data-card="clientes"]');
      const ventas = section.querySelector('[data-card="ventas"]');
      const curtain = section.querySelector('[data-curtain]');
      const fill = section.querySelector('[data-curtain-fill]');
      const bars = gsap.utils.toArray(section.querySelectorAll('[data-bar]'));
      const labelsWrap = section.querySelector('[data-curtain-labels]');
      const labelClientes = section.querySelector('[data-curtain-label="clientes"]');
      const labelVentas = section.querySelector('[data-curtain-label="ventas"]');
      const copy = section.querySelector('[data-copy]');
      const kicker = section.querySelector('[data-kicker]');
      if (!clientes || !ventas || !curtain || !fill || !bars.length || !labelsWrap || !labelClientes || !labelVentas || !copy || !kicker) {
        return;
      }

      const cardW = () => clientes.offsetWidth || 1;
      const gap = () => cardW() * (window.innerWidth < 768 ? 0.08 : 0.12);
      const half = () => (cardW() + gap()) / 2;
      const dist = () => cardW() + gap();

      gsap.set([clientes, ventas, curtain], { transformOrigin: '50% 50%' });
      gsap.set(clientes, { x: () => -half() });
      gsap.set(ventas, { x: () => half() });
      gsap.set(curtain, { x: () => -half(), autoAlpha: 1 });
      gsap.set(fill, { autoAlpha: 1 });
      gsap.set(bars, { x: 0, rotation: 0, force3D: true, transformOrigin: '0% 50%' });
      gsap.set(labelsWrap, { x: 0, autoAlpha: 1 });
      gsap.set(labelVentas, { autoAlpha: 1 });
      gsap.set(labelClientes, { autoAlpha: 0 });

      const fold = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const short = h < 820;

        if (w >= 1280) {
          return { s: 0.44, up: h * (short ? 0.14 : 0.18), dx: 0.2, stag: 0.04 };
        }
        if (w >= 1024) {
          return { s: 0.48, up: h * (short ? 0.15 : 0.2), dx: 0.2, stag: 0.045 };
        }
        if (w >= 768) {
          return { s: 0.58, up: h * (short ? 0.16 : 0.2), dx: 0.16, stag: 0.04 };
        }
        return { s: 0.72, up: h * (short ? 0.14 : 0.16), dx: 0.1, stag: 0.03 };
      };

      const clientesFold = {
        x: () => -cardW() * fold().dx,
        y: () => -fold().up - cardW() * fold().stag,
        scale: () => fold().s,
        rotation: -6,
      };
      const ventasFold = {
        x: () => cardW() * fold().dx,
        y: () => -fold().up + cardW() * fold().stag,
        scale: () => fold().s,
        rotation: 6,
      };

      if (prefersReduced) {
        gsap.set(curtain, { autoAlpha: 0 });
        gsap.set(clientes, clientesFold);
        gsap.set(ventas, ventasFold);
        gsap.set([copy, kicker], { autoAlpha: 1 });
        return;
      }

      gsap.set([copy, kicker], { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * HERO_PIN_VH}`,
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Prioridad de refresco descendente por orden en el DOM (Hero=3,
          // Services=2, Portfolio=1). Sin esto, al recalcularse los pins de
          // forma asíncrona (montaje por import dinámico + carga de imágenes),
          // el 'top top' de una sección de abajo se mide sin contar el
          // pin-spacer de la de arriba → posiciones corridas → el scroll salta
          // a mitad de sección. Es el fix recomendado por GSAP para varios pins.
          refreshPriority: 3,
        },
      });

      // Placa opaca al inicio (sin rendijas). Se retira a la par del wipe.
      tl.to(fill, { autoAlpha: 0, duration: 1, ease: 'none' }, 0);

      tl.to(
        bars,
        {
          x: () => dist(),
          duration: 1,
          ease: 'power1.inOut',
          stagger: { amount: 1 },
          force3D: true,
        },
        0,
      );
      tl.to(bars, { rotation: 8, duration: 1, ease: 'power1.out', stagger: { amount: 1 } }, 0);
      tl.to(bars, { rotation: 0, duration: 1, ease: 'power1.in', stagger: { amount: 1 } }, 1);

      // Texto encima: viaja y se va con la cortina (no se queda sobre las fotos).
      tl.to(labelsWrap, { x: () => dist(), duration: 1, ease: 'power1.inOut' }, 0);
      tl.to(labelVentas, { autoAlpha: 0, duration: 0.2 }, 0.4);
      tl.to(labelClientes, { autoAlpha: 1, duration: 0.2 }, 0.4);

      tl.to(curtain, { autoAlpha: 0, duration: 0.3 }, 2.05);
      tl.to(clientes, { ...clientesFold, duration: 0.7, ease: 'power3.inOut' }, 2.05);
      tl.to(ventas, { ...ventasFold, duration: 0.7, ease: 'power3.inOut' }, 2.05);

      tl.to(kicker, { autoAlpha: 1, duration: 0.3 }, 2.5);
      tl.from(kicker, { y: 16, duration: 0.4, ease: 'power3.out' }, 2.5);
      tl.to(copy, { autoAlpha: 1, duration: 0.3 }, 2.55);
      tl.from(
        copy.children,
        { autoAlpha: 0, y: 26, stagger: 0.08, duration: 0.45, ease: 'power3.out' },
        2.55,
      );

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
}

export default useHeroReveal;
