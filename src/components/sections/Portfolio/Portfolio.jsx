import { useRef } from 'react';
import { useHorizontalGallery } from '../../../animations/useHorizontalGallery';
import Button from '../../ui/Button';

/**
 * Portafolio como galería de scroll horizontal: la sección se fija y las
 * imágenes de los proyectos se deslizan en horizontal con el scroll vertical.
 * El primer panel es el encabezado (título/subtítulo/CTA).
 */
export default function Portfolio({ title, subtitle, items = [], ctaLabel, ctaHref }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  useHorizontalGallery(sectionRef, trackRef);

  return (
    <section id="portafolio" ref={sectionRef} className="ink-gallery">
      <div ref={trackRef} className="ink-gallery__track">
        <div className="ink-gallery__intro">
          <p className="ink-eyebrow">Portafolio</p>
          <h2 className="ink-gradient-heading mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-base text-[var(--color-gray-text)] md:text-lg">{subtitle}</p>
          {ctaLabel && (
            <div className="mt-8">
              <Button variant="primary" size="md" href={ctaHref}>
                {ctaLabel}
              </Button>
            </div>
          )}
          <p className="ink-gallery__hint mt-8">Desliza / scroll →</p>
        </div>

        {items.map((item) => {
          const external = typeof item.href === 'string' && item.href.startsWith('http');
          return (
            <a
              key={item.title}
              href={item.href}
              className="ink-gallery__item"
              rel={external ? 'noopener noreferrer' : undefined}
              target={external ? '_blank' : undefined}
            >
              <img
                src={item.image}
                alt={`${item.title}: ${item.description || item.client || 'sitio web desarrollado por Ink Digital'}`}
                width="1600"
                height="750"
                loading="lazy"
                draggable="false"
              />
              <div className="ink-gallery__caption">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-blue)]">{item.client}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                {item.description ? <p className="ink-gallery__desc">{item.description}</p> : null}
              </div>
            </a>
          );
        })}
      </div>

      <ol className="ink-visually-hidden">
        {items.map((item) => (
          <li key={`seo-${item.title}`}>
            <strong>{item.title}</strong>
            {item.client ? ` — ${item.client}. ` : ' '}
            {item.description}
          </li>
        ))}
      </ol>
    </section>
  );
}
