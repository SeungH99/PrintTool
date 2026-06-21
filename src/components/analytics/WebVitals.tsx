'use client';

import { useReportWebVitals } from 'next/web-vitals';

type Gtag = (command: 'event', name: string, params: Record<string, unknown>) => void;

// Module-level so the callback reference stays stable (Next dedupes by reference).
function report(metric: { name: string; id: string; value: number; rating: string }): void {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (!gtag) return;
  gtag('event', metric.name, {
    // CLS is unitless; scale ×1000 so GA4 stores an integer. Others are in ms.
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    metric_rating: metric.rating,
    non_interaction: true,
  });
}

/**
 * Reports Core Web Vitals (LCP/INP/CLS/FCP/TTFB) to GA4 via gtag. Rendered only when
 * GA is configured; a no-op until gtag loads / consent is granted (Consent Mode v2).
 */
export function WebVitals() {
  useReportWebVitals(report);
  return null;
}
