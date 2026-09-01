import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * Entrada del mockup: visible desde el SSR, solo anima transform.
 *
 * @param {{ stage: import('react').RefObject<HTMLElement>, inner: import('react').RefObject<HTMLElement>, float: import('react').RefObject<HTMLElement> }} refs
 */
export function useHeroVisual({ stage, inner, float }) {
  useEffect(() => {
    const stageEl = stage.current;
    const innerEl = inner.current;
    const floatEl = float.current;
    if (!stageEl || !innerEl || !floatEl) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerEl,
        { rotateX: 22, y: 40, scale: 0.94 },
        { rotateX: 12, y: 0, scale: 1, duration: 1.1, delay: 0.2, ease: 'power3.out' },
      );

      gsap.fromTo(
        floatEl,
        { y: 28 },
        { y: 0, duration: 1.1, delay: 0.2, ease: 'power3.out' },
      );

      gsap.to(floatEl, {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.6,
      });
    }, stageEl);

    return () => ctx.revert();
  }, [stage, inner, float]);
}
