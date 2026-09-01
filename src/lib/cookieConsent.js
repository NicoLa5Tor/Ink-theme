const STORAGE_KEY = 'ink_cookie_consent';

/**
 * @returns {{ choice: 'all' | 'necessary', ts: number } | null}
 */
export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.choice !== 'all' && parsed?.choice !== 'necessary') return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * @param {'all' | 'necessary'} choice
 */
export function saveConsent(choice) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ choice, ts: Date.now() }),
  );
}

/**
 * Actualiza Consent Mode v2 (GTM / gtag).
 *
 * @param {boolean} acceptedAll
 */
export function applyConsent(acceptedAll) {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  if (acceptedAll) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  } else {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
}

/**
 * @param {'all' | 'necessary'} choice
 */
export function persistAndApplyConsent(choice) {
  saveConsent(choice);
  applyConsent(choice === 'all');
}
