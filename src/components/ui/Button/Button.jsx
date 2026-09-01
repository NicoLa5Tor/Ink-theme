const VARIANT_CLASSES = {
  primary:
    'bg-[var(--color-blue)] text-[var(--color-text-on-accent)] border border-[var(--color-blue)] hover:bg-[var(--color-blue)]/90 hover:-translate-y-0.5 active:scale-[0.98] shadow-[0px_-1px_0px_0px_#FFFFFF60_inset,0px_1px_0px_0px_#FFFFFF60_inset] focus-visible:outline-[var(--color-blue)]',
  secondary:
    'bg-transparent text-white  border border-transparent hover:border-neutral-700 hover:bg-neutral-800/60 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-white',
  whatsapp: 'bg-[var(--color-whatsapp)] text-white hover:brightness-95 focus-visible:outline-[var(--color-whatsapp)]',
};

const SIZE_CLASSES = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  icon = null,
  loading = false,
  children,
  className = '',
  ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-md font-medium',
    'transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:opacity-60 disabled:pointer-events-none',
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
    className,
  ].join(' ');

  const content = (
    <>
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        icon && <span className="shrink-0" aria-hidden="true">{icon}</span>
      )}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} disabled={loading} {...rest}>
      {content}
    </button>
  );
}
