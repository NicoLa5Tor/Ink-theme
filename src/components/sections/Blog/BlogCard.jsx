// `headingLevel` permite reutilizar la card como h2 (índice del blog, donde son
// el contenido principal) o h3 (relacionados "Más del blog", subordinados a esa
// sección) sin duplicar el componente.
export default function BlogCard({ href, title, excerpt, date, image, category, headingLevel: Heading = 'h2' }) {
  return (
    <a href={href} className="ink-blog-card ink-plans-page__why-item">
      {image ? (
        <img className="ink-blog-card__image" src={image} alt={title} width="640" height="360" loading="lazy" />
      ) : (
        <div className="ink-blog-card__image ink-blog-card__image--empty" aria-hidden="true" />
      )}
      <div className="ink-blog-card__body">
        <p className="ink-blog-card__meta">
          {category ? <span>{category}</span> : null}
          {category && date ? <span aria-hidden="true"> · </span> : null}
          {date ? <time>{date}</time> : null}
        </p>
        <Heading>{title}</Heading>
        {excerpt ? <p>{excerpt}</p> : null}
      </div>
    </a>
  );
}
