/**
 * Consent + ad-load gate. The certified CMP (Google Funding Choices, configured in
 * the AdSense console "Privacy & messaging") owns the actual consent UI; this module
 * provides the default-denied state, the Consent Mode v2 parameter mapping, and the
 * seam to push updates to gtag. Real consent gating requires NEXT_PUBLIC_ADSENSE_CLIENT
 * and an AdSense account — see ADR-0001 / MVP-005.
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

export type ConsentSignal = 'granted' | 'denied';

export interface ConsentModeParams {
  ad_storage: ConsentSignal;
  ad_user_data: ConsentSignal;
  ad_personalization: ConsentSignal;
  analytics_storage: ConsentSignal;
}

/** Pure mapping from our consent state to Google Consent Mode v2 parameters. */
export function consentModeParams(state: ConsentState): ConsentModeParams {
  const ads: ConsentSignal = state.ads ? 'granted' : 'denied';
  return {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: state.analytics ? 'granted' : 'denied',
  };
}

type GtagWindow = { gtag?: (...args: unknown[]) => void };

/** Push a Consent Mode update to gtag. No-op if gtag is not loaded. */
export function applyConsentMode(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  (window as unknown as GtagWindow).gtag?.('consent', 'update', consentModeParams(state));
}

type FundingChoicesWindow = {
  googlefc?: {
    callbackQueue?: { push: (cb: () => void) => void };
    showRevocationMessage?: () => void;
  };
};

/** Re-open the CMP consent UI (Funding Choices). No-op + warning if the CMP isn't loaded. */
export function openConsentManager(): void {
  if (typeof window === 'undefined') return;
  const fc = (window as unknown as FundingChoicesWindow).googlefc;
  if (fc?.callbackQueue) {
    fc.callbackQueue.push(() => fc.showRevocationMessage?.());
    return;
  }
  // eslint-disable-next-line no-console
  console.warn('[consent] CMP not loaded (set NEXT_PUBLIC_ADSENSE_CLIENT). See ADR-0001 / MVP-005.');
}
