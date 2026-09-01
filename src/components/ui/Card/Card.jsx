const TONE_CLASSES = {
  white: 'ink-surface-card text-[var(--color-text-primary)]',
  'blue-light': 'ink-surface-card text-[var(--color-text-primary)]',
  accent: 'ink-surface-accent',
};

export default function Card({
  icon = null,
  title,
  description,
  cta = null,
  tone = 'white',
  className = '',
}) {
  return (
    <div className={`flex h-full flex-col gap-4 p-6 ${TONE_CLASSES[tone] ?? TONE_CLASSES.white} ${className}`}>
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-[var(--color-blue)]">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
      )}
      {description && (
        <div className="text-sm leading-relaxed text-[var(--color-gray-text)]">
          {description}
        </div>
      )}
      {cta && <div className="mt-auto pt-2">{cta}</div>}
    </div>
  );
}
