import { useRef } from 'react';
import { useReveal } from '../../../animations/useReveal';
import SectionTitle from '../../ui/SectionTitle';
import Button from '../../ui/Button';

export default function PlansTeaser({ title, subtitle, plansUrl, plans = [] }) {
  const gridRef = useRef(null);
  useReveal(gridRef, { y: 24, duration: 0.7, stagger: 0.1 });

  return (
    <section id="planes" className="ink-section ink-plans">
      <div className="container-ink">
        <SectionTitle title={title} subtitle={subtitle} align="center" className="mx-auto items-center text-center" />
        <div ref={gridRef} className="ink-plans-teaser">
          {plans.map((plan) => (
            <article
              key={plan.slug}
              className={`ink-plans-teaser__card${plan.featured ? ' is-featured' : ''}`}
            >
              <p className="ink-plans-teaser__name">{plan.name}</p>
              <p className="ink-plans-teaser__price">
                {plan.price}
                {plan.period ? <span>/{plan.period}</span> : null}
              </p>
              {plan.idealFor ? (
                <p className="ink-plans-teaser__ideal">{plan.idealFor}</p>
              ) : (
                <ul className="ink-plans-teaser__list">
                  {(plan.teaser ?? plan.features?.slice(0, 2) ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <a className="ink-plans-teaser__more" href={plan.moreHref ?? `${plansUrl}#${plan.slug}`}>
                Ver más
              </a>
            </article>
          ))}
        </div>
        {plansUrl ? (
          <div className="ink-plans-teaser__cta">
            <Button
              href={plansUrl}
              size="lg"
              className="ink-plans-teaser__cta-btn"
            >
              Ver comparativa completa de planes
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
