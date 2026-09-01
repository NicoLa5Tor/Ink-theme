import { useEffect, useState } from 'react';
import {
  applyConsent,
  getStoredConsent,
  persistAndApplyConsent,
} from '../../../lib/cookieConsent';

export default function CookieConsent({ cookiesUrl }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      applyConsent(stored.choice === 'all');
      setVisible(false);
    } else {
      setVisible(true);
    }

    const reopen = () => setVisible(true);
    window.inkOpenCookieSettings = reopen;
    window.addEventListener('ink:cookie-settings', reopen);

    return () => {
      delete window.inkOpenCookieSettings;
      window.removeEventListener('ink:cookie-settings', reopen);
    };
  }, []);

  const acceptAll = () => {
    persistAndApplyConsent('all');
    setVisible(false);
  };

  const acceptNecessary = () => {
    persistAndApplyConsent('necessary');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="ink-cookie-consent"
      role="dialog"
      aria-labelledby="ink-cookie-consent-title"
      aria-describedby="ink-cookie-consent-desc"
      aria-live="polite"
    >
      <div className="ink-cookie-consent__panel">
        <p id="ink-cookie-consent-title" className="ink-cookie-consent__title">
          Usamos cookies
        </p>
        <p id="ink-cookie-consent-desc" className="ink-cookie-consent__text">
          Utilizamos cookies técnicas y, con tu permiso, analíticas y de marketing para medir
          visitas y mejorar campañas. Puedes aceptar todas o usar solo las necesarias.
        </p>
        <div className="ink-cookie-consent__actions">
          <button type="button" className="ink-cookie-consent__btn ink-cookie-consent__btn--ghost" onClick={acceptNecessary}>
            Solo necesarias
          </button>
          <button type="button" className="ink-cookie-consent__btn ink-cookie-consent__btn--primary" onClick={acceptAll}>
            Aceptar todas
          </button>
          {cookiesUrl ? (
            <a className="ink-cookie-consent__link" href={cookiesUrl}>
              Política de cookies
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
