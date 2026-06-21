'use client';

import Script from 'next/script';
import { consentModeParams, defaultConsent, CONSENT_REQUIRED_REGIONS } from '@/lib/consent/consent';

/**
 * Loads Google Consent Mode v2 plus the analytics/ads tags, each gated on its own
 * env var. Consent Mode defaults to DENIED in regulated regions (EEA/UK/CH — the
 * certified CMP, Funding Choices, collects consent) and GRANTED elsewhere so
 * non-regulated traffic is still measured (GA4 tag quality). Renders nothing when
 * neither GA nor AdSense is configured (e.g. local dev) — ADR-0001 / MVP-005.
 */
export function ConsentScripts() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  if (!client && !ga) return null;

  // Regulated regions: denied + wait for the CMP. The region-less default covers the rest (granted).
  const regional = JSON.stringify({
    ...consentModeParams(defaultConsent),
    region: CONSENT_REQUIRED_REGIONS,
    wait_for_update: 500,
  });
  const fallback = JSON.stringify(consentModeParams({ ads: true, analytics: true }));

  return (
    <>
      {/* Consent Mode default must run before any ad/analytics tag fires; beforeInteractive
          in the (root) locale layout is the documented App Router pattern. */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',${regional});gtag('consent','default',${fallback});`}
      </Script>

      {ga && (
        <>
          <Script
            id="ga-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}

      {client && (
        <Script
          id="adsbygoogle"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        />
      )}
    </>
  );
}
