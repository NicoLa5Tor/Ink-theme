import Header from '../Header';
import Footer from '../Footer';

/**
 * Compone las islas de interactividad compartidas en todas las plantillas
 * (toggle del menú móvil + botón flotante de WhatsApp). Se monta una vez
 * por entry (home/blog/single) sobre los roots que header.php y footer.php
 * ya imprimen en cada página.
 */
export default function Layout({ children = null }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
