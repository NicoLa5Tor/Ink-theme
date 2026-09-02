import { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import './MaskedHeading.css';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/**
 * Titular recortado con foto (estilo react-bits MaskedHeading).
 * Versión ligera: sin reveal de scroll (la cortina del hero ya lo anima).
 */
export default function MaskedHeading({
  text = '',
  src = '',
  fillScale = 1.25,
  drift = 18,
  brightness = 1,
  saturation = 1,
  align = 'center',
  weight = 800,
  tracking = -0.03,
  lineHeight = 0.95,
  textScale = 0.2,
  fontSize = '',
  inline = false,
  className = '',
}) {
  const rootRef = useRef(null);
  const measureRef = useRef(null);
  const mediaRef = useRef(null);
  const wordRefs = useRef([]);
  const baseRefs = useRef([]);
  const glyphRefs = useRef([]);
  const offsetRef = useRef({ x: 0, y: 0 });

  const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text]);

  const place = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    const W = root.clientWidth;
    const H = root.clientHeight;
    const off = offsetRef.current;
    const maxX = Math.max(0, ((fillScale - 1) / 2) * W);
    const maxY = Math.max(0, ((fillScale - 1) / 2) * H);
    media.style.transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${fillScale})`;
    media.style.filter = `brightness(${brightness}) saturate(${saturation})`;
  }, [fillScale, brightness, saturation]);

  const sync = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;

    if (fontSize) {
      root.style.fontSize = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
    } else if (!root.classList.contains('ink-logo-intro__heading')) {
      root.style.fontSize = `${clamp(root.clientWidth * textScale, 18, 96).toFixed(1)}px`;
    }

    const cs = window.getComputedStyle(measure);
    wordRefs.current.forEach((box, i) => {
      const base = baseRefs.current[i];
      const glyph = glyphRefs.current[i];
      if (!box || !base || !glyph) return;
      glyph.setAttribute('x', `${box.offsetLeft}`);
      glyph.setAttribute('y', `${base.offsetTop}`);
      glyph.style.fontFamily = cs.fontFamily;
      glyph.style.fontSize = cs.fontSize;
      glyph.style.fontWeight = cs.fontWeight;
      glyph.style.letterSpacing = cs.letterSpacing;
    });
    place();
  }, [place, textScale, fontSize]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    // Layout una sola vez (y en resize / cuando cargan las fuentes). Antes había
    // un requestAnimationFrame infinito que hacía "drift" la imagen en cada frame
    // (con getComputedStyle + clip-path + filter): saturaba el hilo principal y
    // trababa la animación de entrada. El flotado era un detalle mínimo; se quita
    // a cambio de una entrada fluida. place() dentro de sync() fija el encuadre.
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    document.fonts?.ready?.then(sync).catch(() => {});

    return () => {
      ro.disconnect();
    };
  }, [sync]);

  return (
    <div
      ref={rootRef}
      className={`masked-heading${inline ? ' masked-heading--inline' : ''} ${className}`.trim()}
      style={{
        textAlign: align,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight,
      }}
    >
      <div ref={measureRef} className="masked-heading__measure" aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={`m-${word}-${i}`}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="masked-heading__word"
          >
            {word}
            <i
              ref={(el) => {
                baseRefs.current[i] = el;
              }}
              className="masked-heading__baseline"
            />
          </span>
        ))}
      </div>

      <svg className="masked-heading__defs" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {words.map((word, i) => (
              <text
                key={`g-${word}-${i}`}
                ref={(el) => {
                  glyphRefs.current[i] = el;
                }}
                fill="black"
              >
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span className="masked-heading__reveal">
        <span className="masked-heading__clip" style={{ clipPath: `url(#${clipId})` }}>
          <span ref={mediaRef} className="masked-heading__media">
            {src ? (
              <img className="masked-heading__source" src={src} alt="" draggable="false" />
            ) : null}
          </span>
        </span>
      </span>
    </div>
  );
}
