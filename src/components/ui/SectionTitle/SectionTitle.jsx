export default function SectionTitle({ title, subtitle = null, align = 'left', className = '' }) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-4 ${alignment} ${className}`}>
      <h2 className="ink-gradient-heading max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base text-[var(--color-gray-text)] md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
