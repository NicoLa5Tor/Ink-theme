import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Intro editorial para la página de planes, inspirada en la galería smooth-scroll
 * de referencia pero con nuestros colores/tipografía y sin plugins externos
 * (SplitText / Locomotive). Reproduce a mano:
 *   1. Reveal de líneas del título (cada línea sube desde su máscara).
 *   2. Fade escalonado del eyebrow + subtítulo.
 *   3. Entrada en cascada de los bloques "por qué" y de las tarjetas de plan.
 *   4. Parallax muy sutil del bloque hero al hacer scroll.
 *
 * @param {import('react').RefObject<HTMLElement>} rootRef  contenedor .ink-plans-page
 */
export function usePlansIntro(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const title = root.querySelector('.ink-plans-page__title');
    const eyebrow = root.querySelector('.ink-eyebrow');
    const subtitle = root.querySelector('.ink-plans-page__subtitle');
    const hero = root.querySelector('.ink-plans-page__hero');
    const whyItems = gsap.utils.toArray(
      root.querySelectorAll('.ink-plans-page__why-item, .ink-legal-nav__item'),
    );
    const cards = gsap.utils.toArray(
      root.querySelectorAll('.ink-price-card, .ink-legal-section, .ink-blog-card, .ink-blog-article'),
    );
    const guarantee = root.querySelector('.ink-plans-page__guarantee');

    // Divide el título en líneas reales (según cómo caiga el wrap) y envuelve
    // cada una en una máscara overflow:hidden, como haría SplitText.
    const splitTitleIntoLines = (el) => {
      if (!el || el.querySelector('.ink-line-wrap')) return [];

      const raw = el.textContent;
      el.textContent = '';
      const wordSpans = [];
      raw.split(/(\s+)/).forEach((chunk) => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          el.appendChild(document.createTextNode(chunk));
          return;
        }
        const w = document.createElement('span');
        w.style.display = 'inline-block';
        w.textContent = chunk;
        el.appendChild(w);
        wordSpans.push(w);
      });

      // Agrupa por posición vertical → cada grupo es una línea visual.
      const lines = [];
      let current = null;
      let lastTop = null;
      wordSpans.forEach((w) => {
        const top = w.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) > 2) {
          current = [];
          lines.push(current);
          lastTop = top;
        }
        current.push(w.textContent);
      });

      // Reconstruye con envoltorio de máscara + capa interior animable.
      el.textContent = '';
      const inners = [];
      lines.forEach((words) => {
        const wrap = document.createElement('span');
        wrap.className = 'ink-line-wrap';
        const inner = document.createElement('span');
        inner.className = 'ink-line-inner';
        inner.textContent = words.join(' ');
        wrap.appendChild(inner);
        el.appendChild(wrap);
        inners.push(inner);
      });
      return inners;
    };

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([eyebrow, subtitle, ...whyItems, ...cards, guarantee], {
          clearProps: 'opacity,transform',
        });
        return;
      }

      // Estado inicial oculto (evita FOUC mientras se mide/anima).
      gsap.set([eyebrow, subtitle], { autoAlpha: 0, y: 16 });
      gsap.set(whyItems, { autoAlpha: 0, y: 20 });
      gsap.set(cards, { autoAlpha: 0, y: 48 });
      if (title) gsap.set(title, { autoAlpha: 0 });

      const build = () => {
        const lines = splitTitleIntoLines(title);
        if (title) gsap.set(title, { autoAlpha: 1 });
        gsap.set(lines, { yPercent: 125 });

        // Telón: se dispara cuando el hero entra en vista (una sola vez). Así
        // se ve aunque el navegador restaure el scroll fuera del tope.
        const tl = gsap.timeline({
          delay: 0.1,
          scrollTrigger: {
            trigger: hero || title,
            start: 'top 78%',
            once: true,
          },
        });

        // El eyebrow aparece mientras cae la primera tira del telón.
        tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0);

        // Cada línea sube desde su máscara, escalonada y bien visible.
        tl.to(
          lines,
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.22,
            ease: 'power4.out',
          },
          0.12,
        );

        tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5');

        // Los bloques "por qué" entran en cascada tras el título.
        if (whyItems.length) {
          tl.to(
            whyItems,
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
            '-=0.4',
          );
        }
      };

      // Espera a las fuentes para medir bien las líneas; con fallback inmediato.
      if (document.fonts?.ready) {
        document.fonts.ready.then(build).catch(build);
      } else {
        build();
      }

      // Tarjetas: entrada escalonada al entrar en viewport (como los image-card).
      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power4.out',
            overwrite: true,
          }),
      });

      // El telón (hero sticky + body que sube tapándolo) es puro CSS, así que
      // aquí no hace falta ScrollTrigger para el efecto de scroll.

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}

export default usePlansIntro;
