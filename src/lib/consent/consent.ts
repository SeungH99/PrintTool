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

/**
 * Regions requiring opt-in consent (GDPR / UK GDPR / Swiss FADP) — ISO 3166-2
 * country codes. Consent Mode defaults to DENIED here (the certified CMP collects
 * consent); visitors elsewhere get a GRANTED default so measurement/ads aren't lost
 * for non-regulated traffic (fixes the GA4 "consent 0%" tag-quality warning).
 * EU 27 + EEA (IS/LI/NO) + UK + Switzerland.
 */
export const CONSENT_REQUIRED_REGIONS = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'IS',
  'LI',
  'NO',
  'GB',
  'CH',
] as const;

export const CONSENT_STORAGE_KEY = 'printready.consent';

export function readConsent(): ConsentState {
  if (typeof window === 'undefined') return defaultConsent;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
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

/**
 * GPC (Global Privacy Control) opt-out — advertising signals forced to denied for the
 * CCPA "do not sell/share" browser signal. Analytics (measurement) is left untouched.
 */
export const gpcOptOutParams = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

type GtagWindow = { gtag?: (...args: unknown[]) => void };

/** Push a Consent Mode update to gtag. No-op if gtag is not loaded. */
export function applyConsentMode(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  (window as unknown as GtagWindow).gtag?.('consent', 'update', consentModeParams(state));
}

type TcfListenerId = number | string;
type TcfData = { gdprApplies?: boolean; listenerId?: TcfListenerId };
type TcfApi = (
  command: 'addEventListener' | 'removeEventListener',
  version: number,
  callback: (data: TcfData | undefined, success: boolean) => void,
  listenerId?: TcfListenerId,
) => void;

type FundingChoicesWindow = {
  googlefc?: {
    callbackQueue?: {
      push: (entry: { CONSENT_API_READY: () => void }) => unknown;
    };
    showRevocationMessage?: () => void;
  };
  __tcfapi?: TcfApi;
};

/** Observe whether Google's ready TCF API says EU regulations apply to this visitor. */
export function observeConsentManager(onChange: (available: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  let active = true;
  let tcfApi: TcfApi | undefined;
  let listenerId: TcfListenerId | undefined;
  const globals = window as unknown as FundingChoicesWindow;
  const fc = (globals.googlefc ??= {});
  const callbackQueue = (fc.callbackQueue ??= [] as Array<{
    CONSENT_API_READY: () => void;
  }>);

  callbackQueue.push({
    CONSENT_API_READY: () => {
      if (!active) return;
      tcfApi = globals.__tcfapi;
      if (!tcfApi) {
        if (active) onChange(false);
        return;
      }
      tcfApi('addEventListener', 0, (data, success) => {
        if (data?.listenerId !== undefined) {
          listenerId = data.listenerId;
          if (!active) {
            tcfApi?.('removeEventListener', 0, () => undefined, listenerId);
            listenerId = undefined;
            return;
          }
        }
        if (active) onChange(Boolean(success && data?.gdprApplies));
      });
    },
  });

  return () => {
    active = false;
    if (tcfApi && listenerId !== undefined) {
      tcfApi('removeEventListener', 0, () => undefined, listenerId);
      listenerId = undefined;
    }
  };
}

/** Re-open the regional CMP UI when Google has loaded it for this visitor. */
export function openConsentManager(): boolean {
  if (typeof window === 'undefined') return false;
  const fc = (window as unknown as FundingChoicesWindow).googlefc;
  if (fc?.showRevocationMessage) {
    fc.showRevocationMessage();
    return true;
  }
  return false;
}
