import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Galería de scroll horizontal: fija la sección y desplaza el track en
 * horizontal a medida que el usuario hace scroll vertical (GSAP ScrollTrigger
 * nativo, sin Locomotive). Al terminar, se suelta y la página sigue normal.
 *
 * @param {import('react').RefObject<HTMLElement>} sectionRef  sección que se fija
 * @param {import('react').RefObject<HTMLElement>} trackRef    fila que se traslada
 */
export function useHorizontalGallery(sectionRef, trackRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    // Sin motion: no fijamos; dejamos el track como tira desplazable con swipe.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      section.classList.add('is-scrollable');
      return () => section.classList.remove('is-scrollable');
    }

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    // Las imágenes cambian el ancho del track al cargar → recalcular posiciones.
    const imgs = Array.from(track.querySelectorAll('img'));
    let pending = imgs.length;
    const done = () => {
      pending -= 1;
      if (pending <= 0) ScrollTrigger.refresh();
    };
    imgs.forEach((img) => {
      if (img.complete) {
        pending -= 1;
      } else {
        img.addEventListener('load', done);
        img.addEventListener('error', done);
      }
    });
    if (pending <= 0) ScrollTrigger.refresh();

    return () => {
      imgs.forEach((img) => {
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
      });
      ctx.revert();
    };
  }, [sectionRef, trackRef]);
}

export default useHorizontalGallery;
