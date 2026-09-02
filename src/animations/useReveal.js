import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Anima fade-up al entrar en viewport. Si ref.current tiene varios hijos
 * directos y se pasa `stagger`, anima cada hijo escalonadamente.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 * @param {{ delay?: number, duration?: number, y?: number, stagger?: number, start?: string }} options
 */
export function useReveal(ref, options = {}) {
  const { delay = 0, duration = 0.8, y = 40, stagger = 0, start = 'top 85%' } = options;

  // useLayoutEffect (no useEffect): el gsap.set inicial que oculta el contenido
  // (opacity:0) debe aplicarse ANTES de que el navegador pinte. Con useEffect
  // corría después del paint, así que el texto se veía un frame visible y luego
  // "saltaba" a oculto para revelarse -> flash al cargar.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const targets = stagger > 0 ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });

      const tween = gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger: stagger > 0 ? stagger : 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
        },
      });

      return () => tween.scrollTrigger?.kill();
    }, el);

    return () => ctx.revert();
  }, [ref, delay, duration, y, stagger, start]);
}

export default useReveal;
