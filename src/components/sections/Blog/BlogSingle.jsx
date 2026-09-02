import { useRef } from 'react';
import { usePlansIntro } from '../../../animations/usePlansIntro';
import ShareButtons from '../Share/ShareButtons';
import BlogCard from './BlogCard';

export default function BlogSingle({
  pageEyebrow,
  pageTitle,
  pageSubtitle,
  date,
  image,
  content,
  shareUrl,
  shareTitle,
  related = [],
  blogHref,
}) {
  const rootRef = useRef(null);
  usePlansIntro(rootRef);

  return (
    <div ref={rootRef} className="ink-plans-page ink-blog-page">
      <header className="ink-plans-page__hero container-ink">
        {pageEyebrow ? <p className="ink-eyebrow">{pageEyebrow}</p> : null}
        <h1 className="ink-plans-page__title">{pageTitle}</h1>
        {pageSubtitle ? <p className="ink-plans-page__subtitle">{pageSubtitle}</p> : null}
        {date ? <p className="ink-blog-single__date">{date}</p> : null}
      </header>

      <div className="ink-plans-page__body">
        <article className="ink-blog-article container-ink">
          {image ? (
            <img className="ink-blog-article__hero" src={image} alt={pageTitle} width="1200" height="675" />
          ) : null}
          <div
            className="ink-blog-article__content"
            dangerouslySetInnerHTML={{ __html: content ?? '' }}
          />
          <div className="ink-blog-article__share">
            <p>Comparte este artículo</p>
            <ShareButtons url={shareUrl} title={shareTitle} />
          </div>
        </article>

        {related.length > 0 ? (
          <section className="ink-blog-related container-ink">
            <h2 className="ink-blog-related__title">Más del blog</h2>
            <div className="ink-blog-grid">
              {related.map((post) => (
                <BlogCard key={post.id} {...post} headingLevel="h3" />
              ))}
            </div>
          </section>
        ) : null}

        {blogHref ? (
          <p className="ink-blog-back container-ink">
            <a href={blogHref}>← Volver al blog</a>
          </p>
        ) : null}
      </div>
    </div>
  );
}
