/**
 * Fondo que cambia de color con una transición larga (estilo color-wash).
 */
export default function TunnelBackdrop({ color = '#0a0a0a' }) {
  return <div data-tunnel-backdrop className="ink-tunnel-backdrop" style={{ backgroundColor: color }} />;
}
