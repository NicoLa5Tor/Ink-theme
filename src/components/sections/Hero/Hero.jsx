import { useRef } from 'react';
import { useHeroReveal } from '../../../animations/useHeroReveal';
import Button from '../../ui/Button';
import MaskedHeading from '../../ui/MaskedHeading/MaskedHeading';

const BARS = 28;

/**
 * Hero: dos cartas + cortina del mismo tamaño/color de fondo + copy final.
 */
export default function Hero({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  heroImage,
  heroImageB,
}) {
  const sectionRef = useRef(null);
  useHeroReveal(sectionRef);

  return (
    <section ref={sectionRef} className="ink-hero">
      <div className="ink-hero__frame">
        <div className="ink-hero__stage">
          <div data-card="clientes" className="ink-card">
            <div
              className="ink-card__img"
              style={{ backgroundImage: heroImage ? `url(${heroImage})` : undefined }}
            />
          </div>
          <div data-card="ventas" className="ink-card">
            <div
              className="ink-card__img"
              style={{ backgroundImage: heroImageB ? `url(${heroImageB})` : undefined }}
            />
          </div>

          <div data-curtain className="ink-curtain" aria-hidden="true">
            <div data-curtain-fill className="ink-curtain__fill" />
            {Array.from({ length: BARS }).map((_, i) => (
              <div key={i} data-bar className="ink-curtain__bar" />
            ))}
            <div data-curtain-labels className="ink-curtain__labels">
              <div data-curtain-label="ventas" className="ink-curtain__label">
                <MaskedHeading text="Más ventas" src={heroImageB} textScale={0.22} />
              </div>
              <div data-curtain-label="clientes" className="ink-curtain__label">
                <MaskedHeading text="Más clientes" src={heroImage} textScale={0.2} />
              </div>
            </div>
          </div>
        </div>

        <p data-kicker className="ink-hero__kicker">
          {eyebrow}
        </p>

        <div data-copy className="ink-hero__copy">
          <h1 className="ink-gradient-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl leading-[1.2]">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-gray-text)] md:text-lg">
            {subtitle}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:mt-6 md:gap-4">
            <Button variant="primary" size="lg" href={ctaPrimary.href}>
              {ctaPrimary.label}
            </Button>
            <Button variant="secondary" size="lg" href={ctaSecondary.href} className="border-white/35">
              {ctaSecondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
