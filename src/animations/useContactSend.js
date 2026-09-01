import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * Animación de “sobre” al enviar. Luego hace submit real a admin-post.php.
 *
 * @param {import('react').RefObject<HTMLFormElement>} formRef
 */
export function useContactSend(formRef) {
  useEffect(() => {
    const form = formRef.current;
    if (!form) return undefined;

    const fields = form.querySelector('.ink-contact-glass__fields');
    const mail = form.querySelector('.ink-contact-mail');
    const sent = form.querySelector('.ink-contact-sent');
    if (!fields || !mail || !sent) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let playing = false;

    const playAndSubmit = () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => {
          form.dataset.inkSent = '1';
          form.submit();
        },
      });

      tl.to(form, { scale: 0.55, duration: 0.4 }, 'pack')
        .to(fields, { opacity: 0, duration: 0.15 }, 'pack')
        .to(mail, { opacity: 1, duration: 0.45 }, 'pack+=0.25')
        .to(form, { rotation: 360, duration: 0.7, ease: 'power1.inOut' })
        .to(form, { rotation: 320, scale: 0.48, duration: 0.35, ease: 'power3.inOut' })
        .to(mail, { borderRadius: '50%', duration: 0.2 }, 'stamp')
        .to(form, { borderRadius: '50%', rotation: 720, scale: 0.16, duration: 0.4 }, 'stamp')
        .to(form, { y: 90, duration: 0.35, ease: 'power3.out' })
        .to(form, { y: -50, duration: 0.4, ease: 'power3.inOut' })
        .to(form, { y: 0, rotation: 1080, scale: 0.92, borderRadius: '12px', duration: 0.55, ease: 'power3.inOut' })
        .to(mail, { opacity: 0, duration: 0.2 }, 'done')
        .to(sent, { opacity: 1, duration: 0.4 }, 'done+=0.1');
    };

    const onSubmit = (event) => {
      if (form.dataset.inkSent === '1') return;
      event.preventDefault();
      if (playing) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      playing = true;
      form.classList.add('is-sending');
      playAndSubmit();
    };

    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, [formRef]);
}

export default useContactSend;
