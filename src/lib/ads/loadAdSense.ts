const SCRIPT_ATTR = 'data-printready-adsense';

/** Adds the AdSense loader once, without Next.js script-management attributes. */
export function ensureAdSenseScript(client: string): HTMLScriptElement {
  const existing = document.head.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`);
  if (existing) return existing;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
    encodeURIComponent(client);
  script.setAttribute(SCRIPT_ATTR, 'true');
  document.head.appendChild(script);
  return script;
}
