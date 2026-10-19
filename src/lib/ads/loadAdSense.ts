import { isAdSenseEnabled } from '@/lib/ads/config';

const ADSENSE_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
const SUPPORTED_ATTRIBUTES = new Set(['async', 'crossorigin', 'src']);

function adSenseScriptUrl(client: string): string {
  return `${ADSENSE_URL}?client=${encodeURIComponent(client)}`;
}

function isAdSenseLoader(script: HTMLScriptElement): boolean {
  try {
    const url = new URL(script.src, document.baseURI);
    return `${url.origin}${url.pathname}` === ADSENSE_URL;
  } catch {
    return false;
  }
}

function isNativeAdSenseScript(script: HTMLScriptElement, src: string): boolean {
  return (
    script.src === src &&
    script.async === true &&
    script.hasAttribute('async') &&
    script.crossOrigin === 'anonymous' &&
    script.getAttributeNames().every((attribute) => SUPPORTED_ATTRIBUTES.has(attribute))
  );
}

/** Adds the enabled AdSense loader once, without Next.js script-management attributes. */
export function ensureAdSenseScript(client: string): HTMLScriptElement | null {
  if (!isAdSenseEnabled()) return null;

  const src = adSenseScriptUrl(client);
  const existing = Array.from(document.head.querySelectorAll<HTMLScriptElement>('script')).filter(
    isAdSenseLoader,
  );
  const matchingScript = existing.find((script) => isNativeAdSenseScript(script, src));
  if (matchingScript && existing.length === 1) return matchingScript;

  existing.forEach((script) => script.remove());

  const script = document.createElement('script');
  script.async = true;
  script.setAttribute('async', '');
  script.crossOrigin = 'anonymous';
  script.src = src;
  document.head.appendChild(script);
  return script;
}
