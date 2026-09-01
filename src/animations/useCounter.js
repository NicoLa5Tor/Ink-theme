import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cuenta de 0 a `target` cuando el elemento entra en viewport.
 * Renderiza el número formateado (con separador de miles y sufijo "+").
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 * @param {number} target
 * @param {{ duration?: number, suffix?: string, start?: string }} options
 */
export function useCounter(ref, target, options = {}) {
  const { duration = 2, suffix = '+', start = 'top 85%' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const counter = { value: 0 };

    const ctx = gsap.context(() => {
      const tween = gsap.to(counter, {
        value: target,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.value).toLocaleString('es-CO')}${suffix}`;
        },
      });

      return () => tween.scrollTrigger?.kill();
    }, el);

    return () => ctx.revert();
  }, [ref, target, duration, suffix, start]);
}

export default useCounter;
