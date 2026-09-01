import { useRef } from 'react';

/**
 * Luces diagonales estilo Proactiv / Aceternity (solo CSS, sin dependencias).
 */
export default function BackgroundBeams({ className = '' }) {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute top-0 left-0 h-[1380px] w-[560px] -translate-y-[350px] -rotate-45"
        style={{
          background:
            'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0,0%,85%,.08) 0, hsla(0,0%,55%,.02) 50%, hsla(0,0%,45%,0) 80%)',
        }}
      />
      <div
        className="absolute top-0 left-0 h-[1380px] w-[240px] origin-top-left -rotate-45 translate-x-[5%] -translate-y-1/2"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, hsla(0,0%,85%,.06) 0, hsla(0,0%,45%,.02) 80%, transparent 100%)',
        }}
      />
      <div
        className="absolute top-0 left-0 h-[1380px] w-[240px] origin-top-left -rotate-45 -translate-x-[180%] -translate-y-[70%]"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, hsla(0,0%,85%,.04) 0, hsla(0,0%,45%,.02) 80%, transparent 100%)',
        }}
      />
    </div>
  );
}
