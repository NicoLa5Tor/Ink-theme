import { useRef } from 'react';
import { usePlansIntro } from '../../../animations/usePlansIntro';
import BlogCard from './BlogCard';

export default function BlogIndex({
  pageEyebrow,
  pageTitle,
  pageSubtitle,
  posts = [],
  categories = [],
  pagination = [],
  emptyText,
}) {
  const rootRef = useRef(null);
  usePlansIntro(rootRef);

  return (
    <div ref={rootRef} className="ink-plans-page ink-blog-page">
      <header className="ink-plans-page__hero container-ink">
        {pageEyebrow ? <p className="ink-eyebrow">{pageEyebrow}</p> : null}
        <h1 className="ink-plans-page__title">{pageTitle}</h1>
        {pageSubtitle ? <p className="ink-plans-page__subtitle">{pageSubtitle}</p> : null}
      </header>

      <div className="ink-plans-page__body">
        {categories.length > 0 ? (
          <nav className="ink-legal-nav container-ink" aria-label="Categorías">
            {categories.map((item) => (
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

        <div className="ink-blog-grid container-ink">
          {posts.length > 0 ? (
            posts.map((post) => <BlogCard key={post.id} {...post} />)
          ) : (
            <p className="ink-blog-empty">{emptyText}</p>
          )}
        </div>

        {pagination.length > 1 ? (
          <nav className="ink-blog-pagination container-ink" aria-label="Paginación">
            {pagination.map((page) => (
              <a
                key={page.n}
                href={page.href}
                className={page.current ? 'is-current' : undefined}
                aria-current={page.current ? 'page' : undefined}
              >
                {page.n}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
