export default function BlogCard({ href, title, excerpt, date, image, category }) {
  return (
    <a href={href} className="ink-blog-card ink-plans-page__why-item">
      {image ? (
        <img className="ink-blog-card__image" src={image} alt="" width="640" height="360" loading="lazy" />
      ) : (
        <div className="ink-blog-card__image ink-blog-card__image--empty" aria-hidden="true" />
      )}
      <div className="ink-blog-card__body">
        <p className="ink-blog-card__meta">
          {category ? <span>{category}</span> : null}
          {category && date ? <span aria-hidden="true"> · </span> : null}
          {date ? <time>{date}</time> : null}
        </p>
        <h2>{title}</h2>
        {excerpt ? <p>{excerpt}</p> : null}
      </div>
    </a>
  );
}
