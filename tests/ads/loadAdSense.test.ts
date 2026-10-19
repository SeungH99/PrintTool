import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureAdSenseScript } from '@/lib/ads/loadAdSense';

const ADSENSE_BASE = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
const ADSENSE_SRC = `${ADSENSE_BASE}?client=ca-pub-123`;

function appendAdSenseScript({
  async = true,
  crossOrigin,
  dataNscript,
  client = 'ca-pub-123',
  legacyMarker = false,
}: {
  async?: boolean;
  crossOrigin?: string | null;
  dataNscript?: string;
  client?: string;
  legacyMarker?: boolean;
} = {}): HTMLScriptElement {
  const script = document.createElement('script');
  script.async = async;
  if (crossOrigin !== null) script.crossOrigin = crossOrigin ?? 'anonymous';
  script.src = `${ADSENSE_BASE}?client=${client}`;
  if (legacyMarker) script.setAttribute('data-printready-adsense', 'true');
  if (dataNscript) script.setAttribute('data-nscript', dataNscript);
  document.head.appendChild(script);
  return script;
}

function adSenseScripts(): HTMLScriptElement[] {
  return Array.from(
    document.head.querySelectorAll<HTMLScriptElement>(`script[src^="${ADSENSE_BASE}"]`),
  );
}

function expectNativeScript(script: HTMLScriptElement | null): asserts script is HTMLScriptElement {
  expect(script).not.toBeNull();
  if (!script) throw new Error('Expected an AdSense script');
  expect(adSenseScripts()).toEqual([script]);
  expect(script.src).toBe(ADSENSE_SRC);
  expect(script.async).toBe(true);
  expect(script.crossOrigin).toBe('anonymous');
  expect(script.getAttributeNames().sort()).toEqual(['async', 'crossorigin', 'src']);
  expect(script).not.toHaveAttribute('data-nscript');
  expect(script).not.toHaveAttribute('data-printready-adsense');
}

describe('ensureAdSenseScript', () => {
  beforeEach(() => {
    document.head.replaceChildren();
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'true');
  });

  afterEach(() => {
    document.head.replaceChildren();
    vi.unstubAllEnvs();
  });

  it.each([undefined, 'false', '', 'TRUE', '1', ' true '])(
    'does not create a loader unless explicitly enabled (value: %s)',
    (value) => {
      vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', value);

      expect(ensureAdSenseScript('ca-pub-123')).toBeNull();
      expect(adSenseScripts()).toHaveLength(0);
    },
  );

  it('adds one exact Google-supported async script and reuses it', () => {
    const first = ensureAdSenseScript('ca-pub-123');
    const second = ensureAdSenseScript('ca-pub-123');

    expect(first).toBe(second);
    expectNativeScript(first);
  });

  it('replaces the loader when the requested client changes', () => {
    const first = ensureAdSenseScript('ca-pub-A');
    const second = ensureAdSenseScript('ca-pub-B');

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(second).not.toBe(first);
    expect(first!.isConnected).toBe(false);
    expect(adSenseScripts()).toEqual([second]);
    expect(second!.src).toBe(`${ADSENSE_BASE}?client=ca-pub-B`);
    expect(second).not.toHaveAttribute('data-printready-adsense');
  });

  it('removes the legacy custom marker from an otherwise valid loader', () => {
    const stale = appendAdSenseScript({ legacyMarker: true });
    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expectNativeScript(script);
  });

  it('does not remove unrelated scripts', () => {
    const unrelated = document.createElement('script');
    unrelated.src = 'https://example.test/not-adsense.js';
    unrelated.setAttribute('data-printready-adsense', 'true');
    document.head.appendChild(unrelated);

    ensureAdSenseScript('ca-pub-123');

    expect(unrelated.isConnected).toBe(true);
    expect(adSenseScripts()).toHaveLength(1);
  });

  it('encodes reserved client characters in the canonical script URL', () => {
    const script = ensureAdSenseScript('ca pub&?/+#');

    expect(script).not.toBeNull();
    expect(script!.src).toBe(`${ADSENSE_BASE}?client=ca%20pub%26%3F%2F%2B%23`);
  });

  it('replaces a same-URL Next.js managed script', () => {
    const stale = appendAdSenseScript({ dataNscript: 'afterInteractive' });
    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expectNativeScript(script);
  });

  it('replaces a same-URL script that is not async', () => {
    const stale = appendAdSenseScript({ async: false });
    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expectNativeScript(script);
  });

  it('replaces a same-URL script with no cross-origin mode', () => {
    const stale = appendAdSenseScript({ crossOrigin: null });
    expect(stale).not.toHaveAttribute('crossorigin');

    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expectNativeScript(script);
  });

  it('replaces a same-URL script with the wrong cross-origin mode', () => {
    const stale = appendAdSenseScript({ crossOrigin: 'use-credentials' });
    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expectNativeScript(script);
  });

  it('replaces duplicate AdSense scripts even when they have the requested URL', () => {
    const first = appendAdSenseScript();
    const duplicate = appendAdSenseScript();
    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(first);
    expect(script).not.toBe(duplicate);
    expect(first.isConnected).toBe(false);
    expect(duplicate.isConnected).toBe(false);
    expectNativeScript(script);
  });
});
