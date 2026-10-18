import { consentModeParams, defaultConsent } from '@/lib/consent/consent';
import { hardReload } from '@/lib/consent/pageReload';

const OPTIONAL_LOADERS =
  'script[src*="adsbygoogle.js"],script[src*="googletagmanager.com/gtag/js"],#ga-init';
type RuntimeWindow = Window & {
  __printreadyAdsLoaded?: boolean;
  __printreadyAnalyticsLoaded?: boolean;
  __printreadyAnalyticsAllowed?: boolean;
  __printreadyShutdownPending?: boolean;
  gtag?: (...args: unknown[]) => void;
  [key: `ga-disable-${string}`]: boolean;
};

/** Shared by ordinary navigation and the root crash boundary that replaces it.
 * Removing loaders cannot undo executed code: reload once only if a runtime exists.
 */
export function shutdownOptionalRuntime(ga?: string): boolean {
  const globals = window as unknown as RuntimeWindow;
  if (globals.__printreadyShutdownPending) return true;
  const wasLoaded =
    globals.__printreadyAdsLoaded ||
    globals.__printreadyAnalyticsLoaded ||
    document.querySelector(OPTIONAL_LOADERS);
  if (!wasLoaded) return false;
  globals.__printreadyShutdownPending = true;
  globals.__printreadyAnalyticsAllowed = false;
  if (ga) globals[`ga-disable-${ga}`] = true;
  globals.gtag?.('consent', 'update', consentModeParams(defaultConsent));
  document
    .querySelectorAll(`${OPTIONAL_LOADERS},ins.adsbygoogle`)
    .forEach((element) => element.remove());
  hardReload();
  return true;
}
