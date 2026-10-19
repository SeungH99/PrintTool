import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConsentScripts } from '@/components/ads/ConsentScripts';
import { CONSENT_STORAGE_KEY } from '@/lib/consent/consent';

const mocks = vi.hoisted(() => ({ usePathname: vi.fn(), hardReload: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname: mocks.usePathname }));
vi.mock('@/lib/consent/pageReload', () => ({ hardReload: mocks.hardReload }));

function googleConsent(status = 3, gdprApplies = false) {
  const google = {
    callbackQueue: {
      push: (entry: Record<string, () => void>) =>
        Object.values(entry).forEach((callback) => callback()),
    },
    getGoogleConsentModeValues: () => ({
      adStoragePurposeConsentStatus: status,
      adUserDataPurposeConsentStatus: status,
      adPersonalizationPurposeConsentStatus: status,
      analyticsStoragePurposeConsentStatus: status,
    }),
  };
  Object.assign(window, {
    googlefc: google,
    __tcfapi: (
      command: string,
      _version: number,
      callback: (data: unknown, success: boolean) => void,
    ) => {
      if (command === 'addEventListener')
        callback({ gdprApplies, listenerId: 5, eventStatus: 'tcloaded' }, true);
    },
  });
}

const optionalTags = 'script[src*="adsbygoogle.js"],script[src*="googletagmanager.com/gtag/js"]';

describe('ConsentScripts actual tag loading', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'true');
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT', 'ca-pub-test');
    vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-TEST');
    localStorage.clear();
    mocks.usePathname.mockReturnValue('/ko/pdf');
    mocks.hardReload.mockReset();
    googleConsent();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    document.querySelectorAll('script').forEach((element) => element.remove());
    document.querySelector('[data-printready-error]')?.remove();
    for (const key of [
      'googlefc',
      '__tcfapi',
      'gtag',
      'dataLayer',
      '__printreadyAdsLoaded',
      '__printreadyAnalyticsLoaded',
      '__printreadyShutdownPending',
    ])
      Reflect.deleteProperty(window, key);
    Reflect.deleteProperty(navigator, 'globalPrivacyControl');
  });

  it('makes no optional Google request before a choice even when Google says nonregional', () => {
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
    const globals = window as typeof window & {
      gtag: (...args: unknown[]) => void;
      dataLayer: ArrayLike<unknown>[];
    };
    globals.gtag('event', 'before-consent');
    expect(globals.dataLayer.map((entry) => Array.from(entry))).not.toContainEqual([
      'event',
      'before-consent',
    ]);
  });

  it.each([undefined, 'false', '', '1', 'TRUE'])(
    'keeps advertising off with switch %s despite saved acceptance, without disabling Analytics',
    (setting) => {
      vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', setting);
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
      render(<ConsentScripts />);

      expect(document.querySelector('script[src*="adsbygoogle.js"]')).toBeNull();
      expect(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')).not.toBeNull();
      const entries = (window as typeof window & { dataLayer: ArrayLike<unknown>[] }).dataLayer.map(
        (entry) => Array.from(entry),
      );
      expect(
        entries.filter((entry) => entry[0] === 'consent' && entry[1] === 'update').at(-1),
      ).toEqual([
        'consent',
        'update',
        {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'granted',
        },
      ]);
    },
  );

  it('shuts down an already loaded advertising runtime when the switch is turned off', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    const { rerender } = render(<ConsentScripts />);
    expect(document.querySelector('script[src*="adsbygoogle.js"]')).not.toBeNull();

    vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'false');
    rerender(<ConsentScripts />);

    expect(mocks.hardReload).toHaveBeenCalledOnce();
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
  });

  it.each([
    '/ko/not-a-real-tool',
    '/ko/pdf/nested-404',
    '/en/guides/missing',
    '/ko/contact',
    '/en/terms',
    '/ko/privacy',
  ])('never loads optional tags on excluded route %s even with saved acceptance', (path) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    mocks.usePathname.mockReturnValue(path);
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
  });

  it('initializes a callable global gtag before loading Analytics after acceptance', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(2);
    const globals = window as typeof window & {
      gtag: (...args: unknown[]) => void;
      dataLayer: ArrayLike<unknown>[];
    };
    expect(() => globals.gtag('event', 'test')).not.toThrow();
    expect(globals.dataLayer.map((entry) => Array.from(entry))).toContainEqual([
      'config',
      'G-TEST',
    ]);
    // Google consumes the canonical gtag Arguments protocol, not ordinary arrays.
    for (const entry of globals.dataLayer) {
      expect(Object.prototype.toString.call(entry)).toBe('[object Arguments]');
    }
    expect(globals.dataLayer.map((entry) => Array.from(entry))).toEqual(
      expect.arrayContaining([
        ['consent', 'default', expect.objectContaining({ ad_storage: 'denied' })],
        ['consent', 'update', expect.objectContaining({ ad_storage: 'granted' })],
        ['config', 'G-TEST'],
        ['event', 'test'],
      ]),
    );
  });

  it('preserves preexisting data-layer content when initializing the Google protocol', () => {
    const earlierContent = { page_category: 'production' };
    Object.assign(window, { dataLayer: [earlierContent] });
    render(<ConsentScripts />);
    const queue = (window as typeof window & { dataLayer: unknown[] }).dataLayer;
    expect(queue[0]).toBe(earlierContent);
    expect(queue.length).toBeGreaterThan(1);
    expect(Object.prototype.toString.call(queue[1])).toBe('[object Arguments]');
  });

  it('loads Analytics without advertising for an independent saved choice', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: false, analytics: true }));
    render(<ConsentScripts />);
    expect(document.querySelector('script[src*="gtag/js"]')).not.toBeNull();
    expect(document.querySelector('script[src*="adsbygoogle.js"]')).toBeNull();
  });

  it('loads configured Analytics after local opt-in without waiting for a nonexistent AdSense CMP', () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT', '');
    vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-ONLY');
    Reflect.deleteProperty(window, 'googlefc');
    Reflect.deleteProperty(window, '__tcfapi');
    localStorage.setItem(CONSENT_STORAGE_KEY, '{"ads":true,"analytics":true}');
    render(<ConsentScripts />);
    expect(document.querySelector('script[src*="gtag/js"]')).toHaveAttribute(
      'src',
      'https://www.googletagmanager.com/gtag/js?id=G-ONLY',
    );
    expect(document.querySelector('script[src*="adsbygoogle.js"]')).toBeNull();
    expect(document.querySelector('#google-consent-manager')).toBeNull();
  });

  it('does not override regional Google denial with local acceptance', () => {
    googleConsent(2, true);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
  });

  it('does not grant unconfigured regional purposes', () => {
    googleConsent(4, true);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
  });

  it('does not grant when the consent service has not supplied applicability', () => {
    Reflect.deleteProperty(window, 'googlefc');
    Reflect.deleteProperty(window, '__tcfapi');
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
  });

  it('keeps both categories off under GPC even after consent callbacks grant', () => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true });
    googleConsent(1, true);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
  });

  it('checks the rendered error boundary even on a recognized content URL', () => {
    document.body.insertAdjacentHTML('beforeend', '<section data-printready-error></section>');
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
  });

  it('reloads and removes the optional loaders when SPA navigation enters an excluded route', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    const { rerender } = render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(2);
    mocks.usePathname.mockReturnValue('/ko/contact');
    rerender(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
    expect(mocks.hardReload).toHaveBeenCalledOnce();
  });

  it('reloads after a cross-tab revocation to stop integrations already running', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: true }));
    render(<ConsentScripts />);
    act(() => {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: false, analytics: false }));
      window.dispatchEvent(new StorageEvent('storage', { key: CONSENT_STORAGE_KEY }));
    });
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
    expect(mocks.hardReload).toHaveBeenCalledOnce();
  });

  it('removes inherited ad/analytics scripts on an excluded screen even after the layout remounts', () => {
    document.head.insertAdjacentHTML(
      'beforeend',
      '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-test"></script><script id="ga-loader" src="https://www.googletagmanager.com/gtag/js?id=G-TEST"></script>',
    );
    mocks.usePathname.mockReturnValue('/ko/contact');
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
    expect(mocks.hardReload).toHaveBeenCalledOnce();
  });

  it('stops a runtime inherited by a remount after preference revocation even if its loader was removed', () => {
    Object.assign(window, { __printreadyAdsLoaded: true });
    localStorage.setItem(CONSENT_STORAGE_KEY, '{"ads":false,"analytics":false}');
    render(<ConsentScripts />);
    expect(mocks.hardReload).toHaveBeenCalledOnce();
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
  });

  it('stops loaded tags when a runtime error boundary appears later', async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, '{"ads":true,"analytics":true}');
    render(<ConsentScripts />);
    expect(document.querySelectorAll(optionalTags)).toHaveLength(2);
    await act(async () =>
      document.body.insertAdjacentHTML('beforeend', '<section data-printready-error></section>'),
    );
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
    expect(mocks.hardReload).toHaveBeenCalledOnce();
  });

  it('rechecks stored choices when browser history restores a page from the back-forward cache', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, '{"ads":true,"analytics":true}');
    render(<ConsentScripts />);
    act(() => {
      localStorage.setItem(CONSENT_STORAGE_KEY, '{"ads":false,"analytics":false}');
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    });
    expect(document.querySelectorAll(optionalTags)).toHaveLength(0);
    expect(mocks.hardReload).toHaveBeenCalledOnce();
  });
});
