import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  consentModeParams,
  defaultConsent,
  observeConsentManager,
  openConsentManager,
} from '@/lib/consent/consent';

describe('consentModeParams', () => {
  it('denies every ad/analytics signal by default', () => {
    expect(consentModeParams(defaultConsent)).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  });

  it('grants the ad signals together when ads are consented', () => {
    const p = consentModeParams({ ads: true, analytics: false });
    expect(p.ad_storage).toBe('granted');
    expect(p.ad_user_data).toBe('granted');
    expect(p.ad_personalization).toBe('granted');
    expect(p.analytics_storage).toBe('denied');
  });

  it('grants analytics independently', () => {
    expect(consentModeParams({ ads: false, analytics: true }).analytics_storage).toBe('granted');
  });
});

describe('openConsentManager', () => {
  afterEach(() => {
    delete (window as typeof window & { googlefc?: unknown }).googlefc;
    vi.restoreAllMocks();
  });

  it('opens the Google privacy options API directly when it is available', () => {
    const showRevocationMessage = vi.fn();
    (window as typeof window & { googlefc?: unknown }).googlefc = { showRevocationMessage };

    expect(openConsentManager()).toBe(true);
    expect(showRevocationMessage).toHaveBeenCalledOnce();
  });

  it('returns false without a misleading environment warning when the regional API is absent', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(openConsentManager()).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it('does not suppress the fallback for a callback queue without a callable revocation API', () => {
    const push = vi.fn();
    (window as typeof window & { googlefc?: unknown }).googlefc = {
      callbackQueue: { push },
    };

    expect(openConsentManager()).toBe(false);
    expect(push).not.toHaveBeenCalled();
  });
});

describe('observeConsentManager', () => {
  afterEach(() => {
    delete (window as typeof window & { googlefc?: unknown }).googlefc;
    delete (window as typeof window & { __tcfapi?: unknown }).__tcfapi;
  });

  it('does not register a TCF listener when readiness arrives after cleanup', () => {
    let ready: (() => void) | undefined;
    (window as typeof window & { googlefc?: unknown }).googlefc = {
      callbackQueue: {
        push: (entry: { CONSENT_API_READY: () => void }) => {
          ready = entry.CONSENT_API_READY;
        },
      },
    };
    const tcfApi = vi.fn();
    (window as typeof window & { __tcfapi?: unknown }).__tcfapi = tcfApi;

    const cleanup = observeConsentManager(vi.fn());
    cleanup();
    ready?.();

    expect(tcfApi).not.toHaveBeenCalled();
  });

  it('removes a registered TCF listener during cleanup', () => {
    (window as typeof window & { googlefc?: unknown }).googlefc = {
      callbackQueue: {
        push: (entry: { CONSENT_API_READY: () => void }) => entry.CONSENT_API_READY(),
      },
    };
    const tcfApi = vi.fn(
      (
        command: string,
        _version: number,
        callback: (
          data?: { gdprApplies?: boolean; listenerId?: number },
          success?: boolean,
        ) => void,
      ) => {
        if (command === 'addEventListener') {
          callback({ gdprApplies: true, listenerId: 17 }, true);
        }
      },
    );
    (window as typeof window & { __tcfapi?: unknown }).__tcfapi = tcfApi;

    const cleanup = observeConsentManager(vi.fn());
    cleanup();

    expect(tcfApi).toHaveBeenLastCalledWith('removeEventListener', 0, expect.any(Function), 17);
  });
});
