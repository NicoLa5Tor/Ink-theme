const VARIANT_CLASSES = {
  nuevo: 'border border-[var(--color-blue)]/50 text-[var(--color-blue)] bg-[var(--color-blue)]/10',
  destacado: 'border border-[var(--color-blue)] text-[var(--color-blue)] bg-[var(--color-blue)]/10',
};

export default function Badge({ variant = 'nuevo', children, className = '' }) {
  const classes = [
    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.nuevo,
    className,
  ].join(' ');

  return <span className={classes}>{children}</span>;
}
