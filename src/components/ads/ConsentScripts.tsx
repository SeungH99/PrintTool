'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@/hooks/useConsent';
import { useGoogleConsent } from '@/hooks/useGoogleConsent';
import { ensureAdSenseScript } from '@/lib/ads/loadAdSense';
import { isAdEligibleRoute } from '@/lib/ads/routeEligibility';
import {
  consentModeParams,
  defaultConsent,
  hasGlobalPrivacyControl,
  resolveConsent,
  type ConsentState,
} from '@/lib/consent/consent';
import { shutdownOptionalRuntime } from '@/lib/consent/runtimeShutdown';
type GoogleWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __printreadyAnalyticsAllowed?: boolean;
  __printreadyAdsLoaded?: boolean;
  __printreadyAnalyticsLoaded?: boolean;
  [key: `ga-disable-${string}`]: boolean;
};

/** Initialize the callable global before loading either Google integration. */
function initializeConsentMode(): GoogleWindow {
  const globals = window as unknown as GoogleWindow;
  if (!globals.gtag) {
    globals.dataLayer ??= [];
    globals.gtag = function gtag(...args: unknown[]) {
      if (args[0] === 'event' && !globals.__printreadyAnalyticsAllowed) return;
      // gtag's data-layer command protocol specifically requires Arguments objects.
      // eslint-disable-next-line prefer-rest-params -- Google's command queue uses this exact protocol.
      globals.dataLayer!.push(arguments);
    };
    globals.gtag('consent', 'default', consentModeParams(defaultConsent));
  }
  return globals;
}

/** CMP bootstrap is separate from AdSense: it must work before optional tags. */
function ensureConsentManager(client: string): void {
  if (document.getElementById('google-consent-manager')) return;
  const script = document.createElement('script');
  script.id = 'google-consent-manager';
  script.async = true;
  script.src = `https://fundingchoicesmessages.google.com/i/${encodeURIComponent(client.replace(/^ca-/, ''))}?ers=1`;
  document.head.appendChild(script);
}

/** Basic consent mode: no optional network requests until BOTH gates allow them. */
export function ConsentScripts() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const pathname = usePathname();
  const local = useConsent();
  const google = useGoogleConsent(Boolean(client));
  const loaded = useRef<ConsentState>({ ads: false, analytics: false });
  const reloading = useRef(false);
  const eligible = isAdEligibleRoute(pathname);
  const { ads: adsAllowed, analytics: analyticsAllowed } = resolveConsent(
    local,
    google,
    hasGlobalPrivacyControl(),
  );

  useEffect(() => {
    const inherited = window as unknown as GoogleWindow;
    // The locale layout can remount while the document and Google's runtime survive.
    loaded.current.ads ||= Boolean(
      inherited.__printreadyAdsLoaded || document.querySelector('script[src*="adsbygoogle.js"]'),
    );
    loaded.current.analytics ||= Boolean(
      inherited.__printreadyAnalyticsLoaded ||
      document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
    );
    const stopAndReload = () => {
      if (reloading.current) return;
      reloading.current = shutdownOptionalRuntime(ga);
    };
    const hasError = () => Boolean(document.querySelector('[data-printready-error]'));
    const previouslyLoaded = loaded.current.ads || loaded.current.analytics;
    if ((!eligible || hasError()) && previouslyLoaded) {
      stopAndReload();
      return;
    }
    if (!eligible || hasError() || (!client && !ga) || reloading.current) return;

    const globals = initializeConsentMode();
    if (client) ensureConsentManager(client);
    if ((loaded.current.ads && !adsAllowed) || (loaded.current.analytics && !analyticsAllowed)) {
      stopAndReload();
      return;
    }
    // Never promote a Google CMP denial. Only the intersected state is published.
    globals.gtag?.(
      'consent',
      'update',
      consentModeParams({ ads: adsAllowed, analytics: analyticsAllowed }),
    );
    globals.__printreadyAnalyticsAllowed = analyticsAllowed;
    if (ga) globals[`ga-disable-${ga}`] = !analyticsAllowed;
    if (client && adsAllowed && !loaded.current.ads) {
      ensureAdSenseScript(client);
      loaded.current.ads = true;
      globals.__printreadyAdsLoaded = true;
    }
    if (ga && analyticsAllowed && !loaded.current.analytics) {
      globals.gtag?.('js', new Date());
      globals.gtag?.('config', ga);
      const script = document.createElement('script');
      script.id = 'ga-loader';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`;
      document.head.appendChild(script);
      loaded.current.analytics = true;
      globals.__printreadyAnalyticsLoaded = true;
    }

    // A valid URL may render a runtime error after its initial successful render.
    const observer = new MutationObserver(() => {
      if (hasError() && (loaded.current.ads || loaded.current.analytics)) stopAndReload();
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-printready-error'],
    });
    const onHistory = () => {
      if (
        !isAdEligibleRoute(window.location.pathname) &&
        (loaded.current.ads || loaded.current.analytics)
      )
        stopAndReload();
    };
    window.addEventListener('popstate', onHistory);
    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', onHistory);
    };
  }, [client, ga, eligible, adsAllowed, analyticsAllowed]);

  return null;
}
