import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useConsent } from '@/hooks/useConsent';
import { CONSENT_STORAGE_KEY } from '@/lib/consent/consent';

describe('useConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('tracks persisted consent changes announced by the browser storage event', () => {
    const { result } = renderHook(() => useConsent());

    expect(result.current).toEqual({ ads: false, analytics: false });

    act(() => {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ ads: true, analytics: true }),
      );
      window.dispatchEvent(new StorageEvent('storage', { key: CONSENT_STORAGE_KEY }));
    });

    expect(result.current).toEqual({ ads: true, analytics: true });
  });
});
