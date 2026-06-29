type Gtag = (command: 'event', name: string, params: Record<string, unknown>) => void;

/**
 * Send a GA4 event via gtag. No-op until gtag loads and consent is granted
 * (Consent Mode v2), and on the server. Use for high-intent tool actions that a
 * page_view can't capture — e.g. a finished conversion or a completed check.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.('event', name, params);
}
