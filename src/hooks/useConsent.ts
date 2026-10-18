'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  CONSENT_STORAGE_KEY,
  CONSENT_CHANGED_EVENT,
  hasConsentChoice,
  readConsent,
  defaultConsent,
  type ConsentState,
} from '@/lib/consent/consent';

const DEFAULT_CONSENT_SNAPSHOT = JSON.stringify(defaultConsent);

function getConsentSnapshot(): string {
  return JSON.stringify(readConsent());
}

export function subscribeToConsent(onStoreChange: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
  // BFCache restores may have missed a same-tab choice made on another document.
  window.addEventListener('pageshow', onStoreChange);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
    window.removeEventListener('pageshow', onStoreChange);
  };
}

export function useHasConsentChoice(): boolean {
  return useSyncExternalStore(subscribeToConsent, hasConsentChoice, () => false);
}

/**
 * Local user preferences only; integrations must also apply the regional/GPC gate.
 * SSR and the first client render both return
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
