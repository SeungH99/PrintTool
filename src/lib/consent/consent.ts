/**
 * Consent + ad-load gate interface (STUB).
 *
 * A real Google-certified CMP (e.g. Funding Choices) is OUT of scope for MVP-001
 * (see ADR-0001). This module only defines the seam the CMP will plug into and a
 * default-denied state; it does NOT collect real consent or emit Consent Mode signals.
 */
export type ConsentCategory = 'ads' | 'analytics';

export type ConsentState = Record<ConsentCategory, boolean>;

export const defaultConsent: ConsentState = { ads: false, analytics: false };

const STORAGE_KEY = 'printready.consent';

export function readConsent(): ConsentState {
  if (typeof window === 'undefined') return defaultConsent;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConsent;
    return { ...defaultConsent, ...(JSON.parse(raw) as Partial<ConsentState>) };
  } catch {
    return defaultConsent;
  }
}

/**
 * STUB: the real CMP will own this UI and persist the result. For now it is a
 * no-op placeholder so the wiring (footer "cookie settings" → here) already exists.
 */
export function openConsentManager(): void {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('[consent] CMP not integrated yet (MVP-001 stub). See ADR-0001.');
  }
}
