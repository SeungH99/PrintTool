'use client';

import Script from 'next/script';
import { consentModeParams, defaultConsent } from '@/lib/consent/consent';

/**
 * Loads Google Consent Mode v2 (default-denied) plus the analytics/ads tags,
 * each gated on its own env var. The consent UI comes from the certified CMP
 * (Funding Choices) configured in the AdSense console, not from this code.
 * Renders nothing when neither GA nor AdSense is configured (e.g. local dev) —
 * ADR-0001 / MVP-005.
 */
export function ConsentScripts() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  if (!client && !ga) return null;

  const defaults = JSON.stringify({ ...consentModeParams(defaultConsent), wait_for_update: 500 });

  return (
    <>
      {/* Consent Mode default must run before any ad/analytics tag fires; beforeInteractive
          in the (root) locale layout is the documented App Router pattern. */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',${defaults});`}
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
