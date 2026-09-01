import { useRef } from 'react';
import { usePlansIntro } from '../../../animations/usePlansIntro';

export default function PlansPage({
  pageEyebrow,
  pageTitle,
  pageSubtitle,
  plans = [],
  whyUs = [],
  guarantee,
}) {
  const rootRef = useRef(null);
  usePlansIntro(rootRef);

  return (
    <div ref={rootRef} className="ink-plans-page">
      <header className="ink-plans-page__hero container-ink">
        {pageEyebrow ? <p className="ink-eyebrow">{pageEyebrow}</p> : null}
        <h1 className="ink-plans-page__title">{pageTitle}</h1>
        {pageSubtitle ? <p className="ink-plans-page__subtitle">{pageSubtitle}</p> : null}
      </header>

      <div className="ink-plans-page__body">
      {whyUs.length > 0 ? (
        <div className="ink-plans-page__why container-ink">
          {whyUs.map((item) => (
            <article key={item.title} className="ink-plans-page__why-item">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      ) : null}

      <div className="ink-price-cards ink-price-cards--full container-ink">
        {plans.map((plan) => (
          <article
            key={plan.slug}
            id={plan.slug}
            className={`ink-price-card ink-price-card--full scroll-mt-28${plan.featured ? ' is-featured' : ''}`}
          >
            <div className="ink-price-card__head">
              <p className="ink-price-card__pack">{plan.name}</p>
              <p className="ink-price-card__price">
                {plan.price}
                {plan.period ? <span>/{plan.period}</span> : null}
              </p>
              {plan.idealFor ? (
                <p className="ink-price-card__ideal">
                  <span>Ideal para:</span> {plan.idealFor}
                </p>
              ) : null}
            </div>

            <ul className="ink-price-card__features">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            {plan.results ? (
              <p className="ink-price-card__results">
                <span>Resultados esperados:</span> {plan.results}
              </p>
            ) : null}

            <a
              className="ink-price-card__btn"
              href={plan.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Empezar
            </a>
          </article>
        ))}
      </div>

      {guarantee ? (
        <aside className="ink-plans-page__guarantee container-ink">
          <p>{guarantee}</p>
        </aside>
      ) : null}
      </div>
    </div>
  );
}
