import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../../../animations/useReveal';
import { useContactSend } from '../../../animations/useContactSend';

function ContactForm({ formAction, nonce }) {
  const formRef = useRef(null);
  useContactSend(formRef);

  return (
    <form ref={formRef} action={formAction || '/wp-admin/admin-post.php'} method="post" className="ink-contact-glass">
      <div className="ink-contact-glass__fields">
        <input type="hidden" name="action" value="ink_contact_form" />
        <input type="hidden" name="ink_contact_nonce" value={nonce ?? ''} />

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
  );
}

export default function Contact({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  mailLabel,
  formTitle,
  formAction,
  nonce,
  whatsappHref,
  phone,
  telHref,
  people = [],
}) {
  const bannerRef = useRef(null);
  const closeRef = useRef(null);
  const [open, setOpen] = useState(false);
  useReveal(bannerRef, { y: 28, duration: 0.75 });

  const portraits = people;
  const avatars = people.slice(0, 2);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <section className="ink-section ink-contact" id="contacto">
      <div className="container-ink">
        <div ref={bannerRef} className="ink-contact-banner">
          <div className="ink-contact-banner__copy">
            {eyebrow ? <p className="ink-contact-banner__eyebrow">{eyebrow}</p> : null}
            <h2 className="ink-gradient-heading ink-contact-banner__title">{title}</h2>
            {subtitle ? <p className="ink-contact-banner__lead">{subtitle}</p> : null}

            <div className="ink-contact-banner__actions">
              <a
                className="ink-contact-banner__cta"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {avatars.length > 0 ? (
                  <span className="ink-contact-banner__avatars" aria-hidden="true">
                    {avatars.map((person) => (
                      <img key={person.name} src={person.image} alt="" />
                    ))}
                  </span>
                ) : null}
                <span>{ctaLabel}</span>
              </a>

              <button type="button" className="ink-contact-banner__mail" onClick={() => setOpen(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
                {mailLabel ?? 'Enviar correo'}
              </button>

              {phone && telHref ? (
                <a className="ink-contact-banner__phone" href={telHref}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M6.5 3.8h2.4l1.1 3.1-1.7 1.3a12.4 12.4 0 0 0 6.5 6.5l1.3-1.7 3.1 1.1v2.4c0 .7-.5 1.3-1.2 1.4A16.6 16.6 0 0 1 5.1 5c.1-.7.7-1.2 1.4-1.2Z" />
                  </svg>
                  {phone}
                </a>
              ) : null}
            </div>
          </div>

          {portraits.length > 0 ? (
            <div className="ink-contact-banner__people" aria-hidden="true">
              {portraits.map((person, index) => (
                <img
                  key={person.name}
                  src={person.image}
                  alt=""
                  className={`ink-contact-banner__person ink-contact-banner__person--${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {open ? (
        <div className="ink-contact-modal" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="ink-contact-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ink-contact-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="ink-contact-modal__close"
              onClick={() => setOpen(false)}
              aria-label="Cerrar formulario"
            >
              <span />
              <span />
            </button>
            <h3 id="ink-contact-modal-title" className="ink-contact-modal__title">
              {formTitle ?? 'Cuéntanos sobre tu proyecto'}
            </h3>
            <ContactForm formAction={formAction} nonce={nonce} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
