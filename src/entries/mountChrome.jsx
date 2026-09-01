import { createRoot } from 'react-dom/client';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/**
 * Monta las islas de interactividad compartidas por todas las plantillas
 * (header flotante con efecto GlassSurface + botón de WhatsApp flotante).
 * Se usa createRoot (no hydrateRoot) a propósito: GlassSurface envuelve el
 * contenido en nodos (SVG + divs) que no existen en el fallback CSS de
 * header.php, así que un intento de hidratación fallaría igual. header.php
 * ya deja el nav completo y navegable como fallback si JS no carga.
 */
export function mountSiteChrome() {
  const headerRoot = document.getElementById('site-header-root');
  if (headerRoot) {
    const { homeUrl, siteName, logoBlackUrl, logoWhiteUrl, maskImageUrl } = headerRoot.dataset;
    const menuItems = [
      { href: homeUrl, label: 'Inicio' },
      { href: `${homeUrl}#servicios`, label: 'Servicios' },
      { href: `${homeUrl}#portafolio`, label: 'Portafolio' },
      { href: `${homeUrl}planes/`, label: 'Planes' },
      { href: `${homeUrl}blog/`, label: 'Blog' },
      { href: `${homeUrl}#contacto`, label: 'Contacto' },
    ];
    createRoot(headerRoot).render(
      <Header
        siteName={siteName}
        homeUrl={homeUrl}
        logoBlackUrl={logoBlackUrl}
        logoWhiteUrl={logoWhiteUrl}
        maskImageUrl={maskImageUrl}
        menuItems={menuItems}
      />
    );
  }

  const footerFloatRoot = document.getElementById('site-footer-float-root');
  if (footerFloatRoot) createRoot(footerFloatRoot).render(<Footer />);
}
