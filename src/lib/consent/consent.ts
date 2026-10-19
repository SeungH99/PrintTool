/**
 * Optional integrations require an explicit local choice AND Google's regional
 * permission. Unknown applicability fails closed; local choices never replace a
 * certified regional CMP. GPC restricts both optional categories.
 */
export type ConsentCategory = 'ads' | 'analytics';

export type ConsentState = Record<ConsentCategory, boolean>;

export const defaultConsent: ConsentState = { ads: false, analytics: false };

/**
 * Regions requiring opt-in consent (GDPR / UK GDPR / Swiss FADP) — ISO 3166-2
 * country codes. Defaults are denied everywhere, including outside these regions.
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
export const CONSENT_CHANGED_EVENT = 'printready:consent-changed';
export const OPEN_CONSENT_EVENT = 'printready:open-consent';

function storedChoice(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    const value: unknown = raw ? JSON.parse(raw) : null;
    if (!value || typeof value !== 'object' || !('ads' in value) || !('analytics' in value))
      return null;
    if (typeof value.ads !== 'boolean' || typeof value.analytics !== 'boolean') return null;
    return { ads: value.ads, analytics: value.analytics };
  } catch {
    return null;
  }
}

export function hasConsentChoice(): boolean {
  return storedChoice() !== null;
}

export function readConsent(): ConsentState {
  return storedChoice() ?? defaultConsent;
}

/** Do not report a saved choice if storage is blocked or full. */
export function writeConsent(state: ConsentState): boolean {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    return true;
  } catch {
    return false;
  }
}

export interface GoogleConsent {
  status: 'pending' | 'unavailable' | 'not-applicable' | 'regional';
  allowed: ConsentState;
}

export const pendingGoogleConsent: GoogleConsent = { status: 'pending', allowed: defaultConsent };

export function hasGlobalPrivacyControl(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
  );
}

export function resolveConsent(
  local: ConsentState,
  google: GoogleConsent,
  gpc: boolean,
): ConsentState {
  if (gpc || google.status === 'pending' || google.status === 'unavailable') return defaultConsent;
  return {
    ads: local.ads && google.allowed.ads,
    analytics: local.analytics && google.allowed.analytics,
  };
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
 * We conservatively disable both optional categories for GPC.
 */
export const gpcOptOutParams = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
} as const;

type GtagWindow = { gtag?: (...args: unknown[]) => void };

/** Push a Consent Mode update to gtag. No-op if gtag is not loaded. */
export function applyConsentMode(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  (window as unknown as GtagWindow).gtag?.('consent', 'update', consentModeParams(state));
}

type TcfListenerId = number | string;
type TcfData = { gdprApplies?: boolean; listenerId?: TcfListenerId; eventStatus?: string };
type TcfApi = (
  command: 'addEventListener' | 'removeEventListener',
  version: number,
  callback: (data: TcfData | undefined, success: boolean) => void,
  listenerId?: TcfListenerId,
) => void;

type ConsentModeValues = {
  adStoragePurposeConsentStatus?: number;
  adUserDataPurposeConsentStatus?: number;
  adPersonalizationPurposeConsentStatus?: number;
  analyticsStoragePurposeConsentStatus?: number;
};
type GoogleReadyCallback = Partial<
  Record<'CONSENT_API_READY' | 'CONSENT_MODE_DATA_READY', () => void>
>;

type FundingChoicesWindow = {
  googlefc?: {
    callbackQueue?: {
      push: (entry: GoogleReadyCallback) => unknown;
    };
    showRevocationMessage?: () => void;
    getGoogleConsentModeValues?: () => ConsentModeValues;
  };
  __tcfapi?: TcfApi;
};

/** Google's documented basic-consent-mode API, not an inferred vendor grant.
 * https://developers.google.com/funding-choices/fc-api-docs
 * NOT_CONFIGURED is only usable after TCF explicitly says GDPR does not apply.
 */
export function observeGoogleConsent(onChange: (state: GoogleConsent) => void): () => void {
  let active = true;
  let gdprApplies: boolean | undefined;
  let listenerId: TcfListenerId | undefined;
  let tcfApi: TcfApi | undefined;
  let modeReady = false;
  const globals = window as unknown as FundingChoicesWindow;
  const fc = (globals.googlefc ??= {});
  const queue = (fc.callbackQueue ??= [] as GoogleReadyCallback[]);
  const unavailable = () => {
    if (active) onChange({ status: 'unavailable', allowed: defaultConsent });
  };
  const publish = () => {
    if (!active || !modeReady) return;
    const values = fc.getGoogleConsentModeValues?.();
    if (!values) return unavailable();
    const ads = [
      values.adStoragePurposeConsentStatus,
      values.adUserDataPurposeConsentStatus,
      values.adPersonalizationPurposeConsentStatus,
    ];
    const all = [...ads, values.analyticsStoragePurposeConsentStatus];
    if (all.some((value) => value === undefined || value === 0)) return unavailable();
    const notApplicable = gdprApplies === false || all.every((value) => value === 3);
    const permits = (value: number | undefined) =>
      value === 1 || value === 3 || (value === 4 && gdprApplies === false);
    onChange({
      status: notApplicable ? 'not-applicable' : 'regional',
      allowed: {
        ads: ads.every(permits),
        analytics: permits(values.analyticsStoragePurposeConsentStatus),
      },
    });
  };
  const refresh = () =>
    queue.push({
      CONSENT_MODE_DATA_READY: () => {
        modeReady = true;
        publish();
      },
    });
  queue.push({
    CONSENT_API_READY: () => {
      if (!active) return;
      tcfApi = globals.__tcfapi;
      if (!tcfApi) return;
      tcfApi('addEventListener', 0, (data, success) => {
        if (data?.listenerId !== undefined) {
          listenerId = data.listenerId;
          if (!active) {
            tcfApi?.('removeEventListener', 0, () => undefined, listenerId);
            return;
          }
        }
        if (!active) return;
        if (!success || typeof data?.gdprApplies !== 'boolean') {
          unavailable();
          return;
        }
        gdprApplies = data.gdprApplies;
        refresh();
      });
    },
  });
  refresh();
  const timeout = window.setTimeout(() => {
    if (!modeReady) unavailable();
  }, 8000);
  return () => {
    active = false;
    window.clearTimeout(timeout);
    if (tcfApi && listenerId !== undefined)
      tcfApi('removeEventListener', 0, () => undefined, listenerId);
  };
}

/** Observe whether Google's ready TCF API says EU regulations apply to this visitor. */
export function observeConsentManager(onChange: (available: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  let active = true;
  let tcfApi: TcfApi | undefined;
  let listenerId: TcfListenerId | undefined;
  const globals = window as unknown as FundingChoicesWindow;
  const fc = (globals.googlefc ??= {});
  const callbackQueue = (fc.callbackQueue ??= [] as GoogleReadyCallback[]);

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
    // Public API functions must execute via the ready callback queue.
    if (fc.callbackQueue)
      fc.callbackQueue.push({ CONSENT_API_READY: () => fc.showRevocationMessage?.() });
    else fc.showRevocationMessage();
    return true;
  }
  return false;
}
