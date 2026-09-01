import { useRef, useEffect, useState } from 'react';
import './GooeyNav.css';

/**
 * Nav con animación de partículas "gooey" (react-bits GooeyNav).
 * Los <a> conservan su href real, así que la navegación (anclas del home,
 * /blog/) sigue funcionando y el contenido es indexable; el onClick solo
 * dispara la animación del pill activo.
 */
const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const spyLockRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // partícula ya removida
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index) => {
    const liEl = e.currentTarget;
    // Al hacer clic, silencia el scrollspy un momento para que el pill no
    // parpadee entre secciones durante el scroll suave hacia el ancla.
    spyLockRef.current = Date.now() + 1000;
    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach((p) => filterRef.current.removeChild(p));
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        handleClick({ currentTarget: liEl }, index);
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return undefined;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  // Scrollspy: el ítem activo se decide solo según la sección visible (en el
  // home) o la página actual (/planes/, /blog/ y sus subpáginas). Se recalcula
  // al scrollear, redimensionar y tras cada navegación AJAX ('ink:navigated').
  useEffect(() => {
    const norm = (p) => (p.endsWith('/') ? p : `${p}/`);

    const resolveActive = () => {
      const loc = window.location;
      const path = norm(loc.pathname);

      // 1) Página propia (no home) que coincide con la URL actual (incluye
      //    subpáginas: /blog/mi-post/ resalta "Blog").
      let pageMatch = -1;
      items.forEach((it, i) => {
        const u = new URL(it.href, loc.href);
        const ip = norm(u.pathname);
        if (!u.hash && ip !== '/' && path.startsWith(ip)) pageMatch = i;
      });
      if (pageMatch !== -1) return pageMatch;

      // 2) Home: la última sección cuyo borde superior ya cruzó el umbral.
      const targets = [];
      items.forEach((it, i) => {
        const u = new URL(it.href, loc.href);
        let id = u.hash ? u.hash.slice(1) : u.pathname.replace(/\/+$/, '').split('/').pop();
        if (!id) return;
        const el = document.getElementById(id);
        if (el) targets.push({ i, top: el.getBoundingClientRect().top });
      });

      const threshold = window.innerHeight * 0.4;
      let active = 0; // Inicio (hero) por defecto, arriba de todo.
      targets
        .sort((a, b) => a.top - b.top)
        .forEach(({ i, top }) => {
          if (top <= threshold) active = i;
        });

      // Al fondo del documento, fuerza la última sección (p. ej. Contacto).
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && targets.length) {
        active = targets.reduce((m, t) => (t.i > m ? t.i : m), active);
      }
      return active;
    };

    const apply = (force = false) => {
      if (!force && Date.now() < spyLockRef.current) return;
      const next = resolveActive();
      setActiveIndex((prev) => (prev === next ? prev : next));
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    const onNavigated = () => {
      spyLockRef.current = 0;
      apply(true);
    };

    apply(true);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('ink:navigated', onNavigated);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('ink:navigated', onNavigated);
    };
  }, [items]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={item.href} className={activeIndex === index ? 'active' : ''}>
              <a href={item.href} onClick={(e) => handleClick(e, index)} onKeyDown={(e) => handleKeyDown(e, index)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
