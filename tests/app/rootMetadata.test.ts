import { afterEach, describe, expect, it, vi } from 'vitest';

describe('root metadata', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('provides an absolute metadata base before locale metadata is merged', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://printready.example');
    vi.resetModules();

    const { metadata } = await import('@/app/layout');

    expect(metadata.metadataBase?.toString()).toBe('https://printready.example/');
  });
});
