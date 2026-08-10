import { beforeEach, describe, expect, it } from 'vitest';
import { ensureAdSenseScript } from '@/lib/ads/loadAdSense';

const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-123';

function appendMarkedScript({
  async = true,
  crossOrigin,
  dataNscript,
}: {
  async?: boolean;
  crossOrigin?: string | null;
  dataNscript?: string;
} = {}): HTMLScriptElement {
  const script = document.createElement('script');
  script.async = async;
  if (crossOrigin !== null) script.crossOrigin = crossOrigin ?? 'anonymous';
  script.src = ADSENSE_SRC;
  script.setAttribute('data-printready-adsense', 'true');
  if (dataNscript) script.setAttribute('data-nscript', dataNscript);
  document.head.appendChild(script);
  return script;
}

function expectNativeScript(script: HTMLScriptElement): void {
  expect(document.head.querySelectorAll('script[data-printready-adsense]')).toHaveLength(1);
  expect(script.src).toBe(ADSENSE_SRC);
  expect(script.async).toBe(true);
  expect(script.crossOrigin).toBe('anonymous');
  expect(script).not.toHaveAttribute('data-nscript');
}

describe('ensureAdSenseScript', () => {
  beforeEach(() => document.head.replaceChildren());

  it('adds one native async script without Next.js data attributes', () => {
    const first = ensureAdSenseScript('ca-pub-123');
    const second = ensureAdSenseScript('ca-pub-123');

    expect(first).toBe(second);
    expect(document.head.querySelectorAll('script[data-printready-adsense]')).toHaveLength(1);
    expect(first.async).toBe(true);
    expect(first.crossOrigin).toBe('anonymous');
    expect(first).not.toHaveAttribute('data-nscript');
    expect(first.src).toContain('client=ca-pub-123');
  });

  it('replaces a marked script when the requested client changes', () => {
    const first = ensureAdSenseScript('ca-pub-A');
    const second = ensureAdSenseScript('ca-pub-B');

    expect(second).not.toBe(first);
    expect(first.isConnected).toBe(false);
    expect(document.head.querySelectorAll('script[data-printready-adsense]')).toHaveLength(1);
    expect(second.src).toBe(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-B',
    );
  });

  it('replaces a malformed marked script with a valid native loader', () => {
    const stale = document.createElement('script');
    stale.setAttribute('data-printready-adsense', 'true');
    stale.src = 'https://example.test/not-adsense.js';
    stale.setAttribute('data-nscript', 'afterInteractive');
    document.head.appendChild(stale);

    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expect(document.head.querySelectorAll('script[data-printready-adsense]')).toHaveLength(1);
    expect(script.async).toBe(true);
    expect(script.crossOrigin).toBe('anonymous');
    expect(script).not.toHaveAttribute('data-nscript');
  });

  it('encodes reserved client characters in the canonical script URL', () => {
    const script = ensureAdSenseScript('ca pub&?/+#');

    expect(script.src).toBe(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca%20pub%26%3F%2F%2B%23',
    );
  });

  it('replaces a same-URL Next.js managed script', () => {
    const stale = appendMarkedScript({ dataNscript: 'afterInteractive' });
    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expectNativeScript(script);
  });

  it('replaces a same-URL script that is not async', () => {
    const stale = appendMarkedScript({ async: false });
    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expectNativeScript(script);
  });

  it('replaces a same-URL script with no cross-origin mode', () => {
    const stale = appendMarkedScript({ crossOrigin: null });
    expect(stale).not.toHaveAttribute('crossorigin');

    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expectNativeScript(script);
  });

  it('replaces a same-URL script with the wrong cross-origin mode', () => {
    const stale = appendMarkedScript({ crossOrigin: 'use-credentials' });
    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(stale);
    expect(stale.isConnected).toBe(false);
    expectNativeScript(script);
  });

  it('replaces duplicate marked scripts even when they have the requested URL', () => {
    const first = appendMarkedScript();
    const duplicate = appendMarkedScript();
    const script = ensureAdSenseScript('ca-pub-123');

    expect(script).not.toBe(first);
    expect(script).not.toBe(duplicate);
    expect(first.isConnected).toBe(false);
    expect(duplicate.isConnected).toBe(false);
    expectNativeScript(script);
  });
});
