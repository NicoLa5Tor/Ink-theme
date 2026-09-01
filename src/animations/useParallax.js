import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax vertical suave sobre elementos decorativos (no usar en contenido LCP).
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 * @param {number} speed - Rango recomendado 0.1 (sutil) a 0.5 (marcado)
 */
export function useParallax(ref, speed = 0.2) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const clampedSpeed = Math.min(Math.max(speed, 0.1), 0.5);

    const ctx = gsap.context(() => {
      const tween = gsap.to(el, {
        yPercent: clampedSpeed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      return () => tween.scrollTrigger?.kill();
    }, el);

    return () => ctx.revert();
  }, [ref, speed]);
}

export default useParallax;
