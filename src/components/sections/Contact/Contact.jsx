import { useRef } from 'react';
import { useReveal } from '../../../animations/useReveal';
import { useContactWash } from '../../../animations/useContactWash';
import { useContactSend } from '../../../animations/useContactSend';
import Button from '../../ui/Button';

export default function Contact({ title, subtitle, whatsappHref }) {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const ref = useRef(null);
  useContactWash(sectionRef);
  useContactSend(formRef);
  useReveal(ref, { y: 24, duration: 0.7 });

  return (
    <section ref={sectionRef} className="ink-section ink-contact" id="contacto">
      <div className="container-ink grid gap-12 lg:grid-cols-2" ref={ref}>
        <div>
          <h2 className="ink-gradient-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="ink-contact__lead mt-4 max-w-lg text-base md:text-lg">{subtitle}</p>
          <Button variant="whatsapp" size="lg" href={whatsappHref} className="mt-8">
            Escríbenos por WhatsApp
          </Button>
        </div>

        <form ref={formRef} action="/wp-admin/admin-post.php" method="post" className="ink-contact-glass">
          <div className="ink-contact-glass__fields">
            <input type="hidden" name="action" value="ink_contact_form" />
            <input type="hidden" name="ink_contact_nonce" suppressHydrationWarning />
            <input type="hidden" name="_wp_http_referer" suppressHydrationWarning />

            <label className="ink-contact-glass__label" htmlFor="ink-nombre">
              Nombre
            </label>
            <input required name="nombre" id="ink-nombre" type="text" className="ink-contact-field" placeholder="Tu nombre" />

            <label className="ink-contact-glass__label" htmlFor="ink-email">
              Correo
            </label>
            <input required name="email" id="ink-email" type="email" className="ink-contact-field" placeholder="Tu correo" />

            <label className="ink-contact-glass__label" htmlFor="ink-telefono">
              Teléfono
            </label>
            <input required name="telefono" id="ink-telefono" type="tel" className="ink-contact-field" placeholder="Tu teléfono" />

            <label className="ink-contact-glass__label" htmlFor="ink-mensaje">
              Mensaje
            </label>
            <textarea name="mensaje" id="ink-mensaje" rows="5" className="ink-contact-field ink-contact-field--area" placeholder="Cuéntanos sobre tu proyecto" />

            <button type="submit" className="ink-contact-submit">
              Enviar mensaje
            </button>
          </div>

          <div className="ink-contact-mail" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M4 7l8 6 8-6" />
            </svg>
          </div>
          <p className="ink-contact-sent">Mensaje enviado</p>
        </form>
      </div>
    </section>
  );
}
