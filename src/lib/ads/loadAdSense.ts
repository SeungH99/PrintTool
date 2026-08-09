const SCRIPT_ATTR = 'data-printready-adsense';
const ADSENSE_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

function adSenseScriptUrl(client: string): string {
  return `${ADSENSE_URL}?client=${encodeURIComponent(client)}`;
}

/** Adds the AdSense loader once, without Next.js script-management attributes. */
export function ensureAdSenseScript(client: string): HTMLScriptElement {
  const src = adSenseScriptUrl(client);
  const existing = Array.from(
    document.head.querySelectorAll<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`),
  );
  const matchingScript = existing.find((script) => script.src === src);
  if (matchingScript && existing.length === 1) return matchingScript;

  existing.forEach((script) => script.remove());

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = src;
  script.setAttribute(SCRIPT_ATTR, 'true');
  document.head.appendChild(script);
  return script;
}
