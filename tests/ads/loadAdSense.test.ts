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
});
