import { beforeEach, describe, expect, it } from 'vitest';
import {
  CONSENT_STORAGE_KEY,
  hasConsentChoice,
  readConsent,
  resolveConsent,
  writeConsent,
  type GoogleConsent,
} from '@/lib/consent/consent';

const nonregional: GoogleConsent = {
  status: 'not-applicable',
  allowed: { ads: true, analytics: true },
};

describe('persisted optional preferences', () => {
  beforeEach(() => localStorage.clear());

  it('requires an explicit choice before either optional category is available', () => {
    expect(hasConsentChoice()).toBe(false);
    expect(resolveConsent(readConsent(), nonregional, false)).toEqual({
      ads: false,
      analytics: false,
    });
  });

  it('persists independent category choices through a fresh storage read', () => {
    expect(writeConsent({ ads: false, analytics: true })).toBe(true);
    expect(hasConsentChoice()).toBe(true);
    expect(readConsent()).toEqual({ ads: false, analytics: true });
  });

  it.each(['{"ads":"true","analytics":true}', '{"ads":true}', 'null', '[]'])(
    'does not treat malformed stored values as permission: %s',
    (value) => {
      localStorage.setItem(CONSENT_STORAGE_KEY, value);
      expect(hasConsentChoice()).toBe(false);
      expect(readConsent()).toEqual({ ads: false, analytics: false });
    },
  );

  it('never lets local acceptance override Google regional denial', () => {
    expect(
      resolveConsent(
        { ads: true, analytics: true },
        { status: 'regional', allowed: { ads: false, analytics: true } },
        false,
      ),
    ).toEqual({ ads: false, analytics: true });
  });

  it.each(['pending', 'unavailable'] as const)(
    'fails closed when regional consent is %s',
    (status) => {
      expect(
        resolveConsent(
          { ads: true, analytics: true },
          { status, allowed: { ads: false, analytics: false } },
          false,
        ),
      ).toEqual({ ads: false, analytics: false });
    },
  );

  it('lets GPC take precedence over all asynchronous and stored grants', () => {
    expect(resolveConsent({ ads: true, analytics: true }, nonregional, true)).toEqual({
      ads: false,
      analytics: false,
    });
  });
});
