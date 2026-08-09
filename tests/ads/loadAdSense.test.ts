import { beforeEach, describe, expect, it } from 'vitest';
import { ensureAdSenseScript } from '@/lib/ads/loadAdSense';

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
});
