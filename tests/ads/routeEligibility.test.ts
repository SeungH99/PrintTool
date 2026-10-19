import { describe, expect, it } from 'vitest';
import { isAdEligibleRoute } from '@/lib/ads/routeEligibility';

describe('ad route eligibility', () => {
  it.each([
    '/ko',
    '/en/pdf',
    '/ko/convert',
    '/en/guides',
    '/ko/guides/bleed-and-trim',
    '/en/reference',
  ])('allows recognized editorial/tool route %s', (path) => {
    expect(isAdEligibleRoute(path)).toBe(true);
  });

  it.each([
    '/ko/contact',
    '/en/terms',
    '/ko/privacy',
    '/en/about',
    '/ko/not-a-real-tool',
    '/ko/pdf/unknown',
    '/ko/guides/unknown',
    '/ko/guides/bleed-and-trim/extra',
    '/fr/pdf',
    '/pdf',
    '/ko//pdf',
    '/ko/error',
  ])('denies non-content or unknown route %s', (path) => {
    expect(isAdEligibleRoute(path)).toBe(false);
  });
});
