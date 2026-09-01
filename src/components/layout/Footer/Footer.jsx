import { useRef } from 'react';
import { useReveal } from '../../../animations/useReveal';

const WHATSAPP_NUMBER = '573164637827';
const WHATSAPP_MESSAGE = 'Hola, quiero más información sobre sus servicios';

function buildWhatsappUrl(campaign) {
  const params = new URLSearchParams({
    phone: WHATSAPP_NUMBER,
    text: WHATSAPP_MESSAGE,
    utm_source: 'web',
    utm_medium: 'cta',
    utm_campaign: campaign,
  });
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

/**
 * Botón flotante de WhatsApp. El resto del footer (links legales, nav, copyright)
 * es texto estático en footer.php — este componente solo agrega el botón flotante
 * con animación de entrada.
 */
export default function Footer() {
  const ref = useRef(null);
  useReveal(ref, { y: 20, duration: 0.6, delay: 0.3 });

  return (
    <a
      ref={ref}
      href={buildWhatsappUrl('boton-flotante')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-whatsapp)] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.2.6 4.3 1.7 6.1L4 29l8.1-1.6c1.7.9 3.7 1.4 5.9 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.7c-2 0-3.9-.5-5.5-1.5l-.4-.2-4.8 1 1-4.6-.3-.4C4.9 17.4 4.3 15.7 4.3 15c0-6.5 5.2-11.7 11.7-11.7S27.7 8.5 27.7 15 22.5 24.7 16 24.7zm6.4-8.8c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z" />
      </svg>
    </a>
  );
}
