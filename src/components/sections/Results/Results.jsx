import { useRef } from 'react';
import { useCounter } from '../../../animations/useCounter';
import { useReveal } from '../../../animations/useReveal';
import SectionTitle from '../../ui/SectionTitle';

export default function Results({ title, subtitle, metrics = [] }) {
  const gridRef = useRef(null);
  useReveal(gridRef, { y: 20, duration: 0.6, stagger: 0.08 });

  return (
    <section className="ink-section">
      <div className="container-ink">
        <SectionTitle title={title} subtitle={subtitle} align="center" className="mx-auto items-center text-center" />
        <div ref={gridRef} className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((metric) => (
            <ResultMetric key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultMetric({ metric }) {
  const ref = useRef(null);
  useCounter(ref, metric.value, { suffix: metric.suffix ?? '+' });

  return (
    <div className="ink-surface-card p-6 text-center">
      <p ref={ref} className="text-3xl font-semibold text-[var(--color-blue)] md:text-4xl">
        {metric.value}
        {metric.suffix ?? '+'}
      </p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{metric.label}</p>
    </div>
  );
}
