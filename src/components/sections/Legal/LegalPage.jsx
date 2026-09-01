import { useRef } from 'react';
import { usePlansIntro } from '../../../animations/usePlansIntro';

export default function LegalPage({
  pageEyebrow,
  pageTitle,
  pageSubtitle,
  updated,
  nav = [],
  sections = [],
}) {
  const rootRef = useRef(null);
  usePlansIntro(rootRef);

  return (
    <div ref={rootRef} className="ink-plans-page ink-legal-page">
      <header className="ink-plans-page__hero container-ink">
        {pageEyebrow ? <p className="ink-eyebrow">{pageEyebrow}</p> : null}
        <h1 className="ink-plans-page__title">{pageTitle}</h1>
        {pageSubtitle ? <p className="ink-plans-page__subtitle">{pageSubtitle}</p> : null}
      </header>

      <div className="ink-plans-page__body">
        {nav.length > 0 ? (
          <nav className="ink-legal-nav container-ink" aria-label="Documentos legales">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`ink-plans-page__why-item ink-legal-nav__item${item.active ? ' is-active' : ''}`}
                aria-current={item.active ? 'page' : undefined}
              >
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </a>
            ))}
          </nav>
        ) : null}

        <article className="ink-legal-content container-ink">
          {updated ? (
            <p className="ink-legal-content__updated">Última actualización: {updated}</p>
          ) : null}
          {sections.map((section) => (
            <section key={section.title} className="ink-legal-section">
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
