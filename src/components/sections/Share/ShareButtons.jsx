/**
 * Botones de compartir del single de blog. Hidrata sobre #share-buttons-root,
 * cuyo data-url / data-title imprime single.php.
 */
export default function ShareButtons({ url, title }) {
  const shareUrl = url ?? window.location.href;
  const shareTitle = title ?? document.title;

  const links = [
    { label: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-semibold text-[var(--color-blue)] hover:bg-[var(--color-blue-light)]"
        >
          Compartir en {link.label}
        </a>
      ))}
    </div>
  );
}
