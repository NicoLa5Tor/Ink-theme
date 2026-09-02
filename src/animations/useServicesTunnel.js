import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IMAGE_GAP = 240;
const TITLE_GAP = 430;

const COLOR_STEPS = [
  { at: 0, bg: '#000000', light: false, mask: 1 },
  { at: 0.42, bg: '#041a22', light: false, mask: 0.55 },
  { at: 0.82, bg: '#ffffff', light: true, mask: 0 },
];

function stepIndex(p) {
  let idx = 0;
  COLOR_STEPS.forEach((step, i) => {
    if (p >= step.at) idx = i;
  });
  return idx;
}

function unit(i, salt) {
  const n = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Una sola pasada por títulos e imágenes. El pin termina en el último.
 * Títulos: más distancia en Z (se leen más). Misma curva de fade que las fotos.
 *
 * @param {import('react').RefObject<HTMLElement>} sectionRef
 */
export function useServicesTunnel(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const viewport = section.querySelector('[data-tunnel-view]');
    const world = section.querySelector('[data-tunnel-world]');
    const backdrop = section.querySelector('[data-tunnel-backdrop]');
    if (!viewport || !world) return undefined;

    const nodes = gsap.utils.toArray(section.querySelectorAll('[data-tunnel-item]'));
    if (!nodes.length) return undefined;

    const makePack = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let z = 0;
      return nodes.map((el, i) => {
        const type = el.dataset.type || 'text';
        const spreadX = type === 'text' ? w * 0.06 : w * 0.42;
        const spreadY = type === 'text' ? h * 0.05 : h * 0.34;
        const item = {
          el,
          type,
          x: type === 'text' ? 0 : (unit(i, 1) - 0.5) * spreadX,
          y: type === 'text' ? 0 : (unit(i, 2) - 0.5) * spreadY,
          rotZ: type === 'image' ? (unit(i, 3) - 0.5) * 10 : 0,
          baseZ: -z,
        };
        z += type === 'text' ? TITLE_GAP : IMAGE_GAP;
        return item;
      });
    };

    let pack = makePack();
    let travel = Math.max(-pack[pack.length - 1].baseZ + 280, TITLE_GAP);
    let progress = 0;
    let lastColor = -1;
    const mask = section.querySelector('.ink-services-tunnel__mask');
    const colorTargets = [backdrop, section].filter(Boolean);

    const setColors = (step) => {
      const tl = gsap.timeline({ ease: 'power2.in', overwrite: 'auto' });
      tl.to(colorTargets, {
        duration: 1,
        backgroundColor: step.bg,
      });
      if (mask) {
        tl.to(mask, { duration: 1, opacity: step.mask, delay: -1 }, 0);
      }
      section.classList.toggle('is-light', step.light);
    };

    const paintBack = (p) => {
      const idx = stepIndex(p);
      if (idx === lastColor) return;
      lastColor = idx;
      setColors(COLOR_STEPS[idx]);
    };

    const render = () => {
      const currentDist = progress * travel;

      pack.forEach((item) => {
        const vizZ = item.baseZ + currentDist;

        let alpha = 1;
        const far = -2400;
        if (vizZ < far) alpha = 0;
        else if (vizZ < far + 800) alpha = (vizZ - far) / 800;
        if (vizZ > 0) alpha = 1 - vizZ / 380;
        if (vizZ > 400 || vizZ < far) alpha = 0;
        alpha = Math.max(0, Math.min(1, alpha));

        item.el.style.opacity = String(alpha);
        item.el.style.pointerEvents = item.type === 'image' && alpha > 0.35 ? 'auto' : 'none';
        item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px) rotateZ(${item.rotZ}deg)`;
      });
    };

    let tunnelST;
    const ctx = gsap.context(() => {
      tunnelST = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${travel}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Ver nota en useHeroReveal: prioridad descendente por orden en el DOM
        // (Hero=3, Services=2, Portfolio=1) para que los pins se recalculen de
        // arriba hacia abajo y el 'top top' cuente el pin-spacer de arriba.
        refreshPriority: 2,
        onUpdate: (self) => {
          progress = self.progress;
          paintBack(self.progress);
        },
        onLeave: () => paintBack(1),
        onLeaveBack: () => paintBack(0),
        onRefresh: () => {
          pack = makePack();
          travel = Math.max(-pack[pack.length - 1].baseZ + 280, TITLE_GAP);
        },
      });
    }, section);

    world.style.transform = 'none';
    viewport.style.perspective = '800px';
    gsap.set(colorTargets, { backgroundColor: COLOR_STEPS[0].bg });
    gsap.ticker.add(render);
    paintBack(0);
    render();
    requestAnimationFrame(() => ScrollTrigger.refresh());

    // Resync al navegar (keep-alive): esta sección se mantiene viva entre
    // navegaciones. Si se dejó scrolleada (túnel blanco/estado final) y se vuelve
    // a #servicios, el color quedaba pegado en blanco porque paintBack no se
    // re-dispara. En 'ink:navigated' (que el router emite ya con el scroll en la
    // sección) se fija INSTANTÁNEO el color/estado según el progreso real.
    const resync = () => {
      if (!tunnelST) return;
      const p = tunnelST.progress;
      progress = p;
      const idx = stepIndex(p);
      const step = COLOR_STEPS[idx];
      lastColor = idx;
      gsap.set(colorTargets, { backgroundColor: step.bg });
      if (mask) gsap.set(mask, { opacity: step.mask });
      section.classList.toggle('is-light', step.light);
      render();
    };
    window.addEventListener('ink:navigated', resync);

    return () => {
      window.removeEventListener('ink:navigated', resync);
      gsap.ticker.remove(render);
      ctx.revert();
    };
  }, [sectionRef]);
}

export default useServicesTunnel;
