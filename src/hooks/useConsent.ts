'use client';

import { useEffect, useState } from 'react';
import { readConsent, defaultConsent, type ConsentState } from '@/lib/consent/consent';

/**
 * Read-only view of the consent stub. SSR and the first client render both return
 * the default-denied state (so ads never load without consent and hydration stays
 * consistent); after mount it reflects any persisted value.
 */
export function useConsent(): ConsentState {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  useEffect(() => {
    setConsent(readConsent());
  }, []);
  return consent;
}
