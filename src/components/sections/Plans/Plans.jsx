import { useRef } from 'react';
import { useReveal } from '../../../animations/useReveal';
import SectionTitle from '../../ui/SectionTitle';

export default function Plans({ title, subtitle, plans = [] }) {
  const gridRef = useRef(null);
  useReveal(gridRef, { y: 24, duration: 0.7, stagger: 0.1 });

  return (
    <section id="planes" className="ink-section ink-plans">
      <div className="container-ink">
        <SectionTitle title={title} subtitle={subtitle} align="center" className="mx-auto items-center text-center" />
        <div ref={gridRef} className="ink-price-cards">
          {plans.map((plan) => (
            <article key={plan.name} className={`ink-price-card${plan.featured ? ' is-featured' : ''}`}>
              <ul>
                <li className="ink-price-card__pack">{plan.name}</li>
                <li className="ink-price-card__price ink-price-card__bar">
                  {plan.price}
                  {plan.period ? <span>/{plan.period}</span> : null}
                </li>
                {plan.features.map((feature) => (
                  <li key={feature} className="ink-price-card__bar">
                    {feature}
                  </li>
                ))}
                <li>
                  <a className="ink-price-card__btn" href={plan.href}>
                    {plan.featured ? 'Elegir este plan' : 'Elegir plan'}
                  </a>
                </li>
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
