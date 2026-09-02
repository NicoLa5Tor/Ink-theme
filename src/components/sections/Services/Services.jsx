import { useMemo, useRef } from 'react';
import { useServicesTunnel } from '../../../animations/useServicesTunnel';
import TunnelBackdrop from '../../ui/TunnelBackdrop';

export default function Services({ eyebrow, title, services = [] }) {
  const sectionRef = useRef(null);
  useServicesTunnel(sectionRef);

  const beats = useMemo(
    () =>
      services.flatMap((service) => [
        { kind: 'text', title: service.title },
        { kind: 'image', title: service.title, href: service.href, image: service.image, frame: service.frame },
      ]),
    [services],
  );

  return (
    <section id="servicios" className="ink-services">
      <header className="ink-services__head">
        {eyebrow ? <p className="ink-services__kicker">{eyebrow}</p> : null}
        <h2 className="ink-gradient-heading ink-services__title">{title || 'Servicios'}</h2>
      </header>

      <div ref={sectionRef} className="ink-services-tunnel">
        <TunnelBackdrop />

        <div data-tunnel-view className="ink-services-tunnel__view">
          <div data-tunnel-world className="ink-services-tunnel__world">
            {beats.map((beat, i) =>
              beat.kind === 'text' ? (
                <div key={`t-${beat.title}-${i}`} data-tunnel-item data-type="text" className="ink-tunnel-item">
                  <div className="ink-tunnel-word">{beat.title}</div>
                </div>
              ) : (
                <div key={`i-${beat.title}-${i}`} data-tunnel-item data-type="image" className="ink-tunnel-item">
                  <a href={beat.href} className={`ink-tunnel-shot${beat.frame === 'portrait' ? ' ink-tunnel-shot--portrait' : ''}`} aria-label={beat.title}>
                    {beat.image ? <img src={beat.image} alt={beat.title} loading="lazy" decoding="async" /> : null}
                  </a>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="ink-services-tunnel__mask" aria-hidden="true" />
      </div>
    </section>
  );
}
