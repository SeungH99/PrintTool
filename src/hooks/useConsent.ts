'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  CONSENT_STORAGE_KEY,
  readConsent,
  defaultConsent,
  type ConsentState,
} from '@/lib/consent/consent';

const DEFAULT_CONSENT_SNAPSHOT = JSON.stringify(defaultConsent);

function getConsentSnapshot(): string {
  return JSON.stringify(readConsent());
}

function subscribeToConsent(onStoreChange: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}

/**
 * Read-only view of the consent stub. SSR and the first client render both return
 * the default-denied state (so ads never load without consent and hydration stays
 * consistent); after mount it reflects any persisted value.
 */
export function useConsent(): ConsentState {
  const snapshot = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    () => DEFAULT_CONSENT_SNAPSHOT,
  );

  return useMemo(() => JSON.parse(snapshot) as ConsentState, [snapshot]);
}
