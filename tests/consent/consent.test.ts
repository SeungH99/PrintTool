import { describe, it, expect } from 'vitest';
import { consentModeParams, defaultConsent } from '@/lib/consent/consent';

describe('consentModeParams', () => {
  it('denies every ad/analytics signal by default', () => {
    expect(consentModeParams(defaultConsent)).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  });

  it('grants the ad signals together when ads are consented', () => {
    const p = consentModeParams({ ads: true, analytics: false });
    expect(p.ad_storage).toBe('granted');
    expect(p.ad_user_data).toBe('granted');
    expect(p.ad_personalization).toBe('granted');
    expect(p.analytics_storage).toBe('denied');
  });

  it('grants analytics independently', () => {
    expect(consentModeParams({ ads: false, analytics: true }).analytics_storage).toBe('granted');
  });
});
