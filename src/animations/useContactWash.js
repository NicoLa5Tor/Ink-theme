import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LIGHT = { bg: '#ffffff', night: false };
const DARK = { bg: '#000000', night: true };

/**
 * Transición de color al estilo GSAP: un tween de 1s al entrar / al volver,
 * no un scrub fotograma a fotograma.
 *
 * @param {import('react').RefObject<HTMLElement>} sectionRef
 */
export function useContactWash(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const footer = document.getElementById('site-footer');
    const targets = [section, footer].filter(Boolean);

    const applyNight = (night) => {
      section.classList.toggle('is-night', night);
      footer?.classList.toggle('is-night', night);
    };

    const setColors = (next) => {
      const tl = gsap.timeline({ ease: 'power2.in', overwrite: 'auto' });
      tl.to(targets, {
        duration: 1,
        backgroundColor: next.bg,
        onUpdate() {
          const p = this.progress();
          applyNight(next.night ? p > 0.42 : p < 0.42);
        },
        onComplete() {
          applyNight(next.night);
        },
      });
    };

    gsap.set(targets, { backgroundColor: LIGHT.bg });
    applyNight(false);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { backgroundColor: DARK.bg });
      applyNight(true);
      return undefined;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: '+=100',
        onEnter: () => setColors(DARK),
        onLeaveBack: () => setColors(LIGHT),
      });
    }, section);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      gsap.set(targets, { clearProps: 'backgroundColor' });
      applyNight(false);
    };
  }, [sectionRef]);
}

export default useContactWash;
