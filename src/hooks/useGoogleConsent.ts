'use client';

import { useEffect, useState } from 'react';
import { observeGoogleConsent, pendingGoogleConsent } from '@/lib/consent/consent';
import type { GoogleConsent } from '@/lib/consent/consent';

const analyticsWithoutCmp: GoogleConsent = {
  status: 'not-applicable',
  allowed: { ads: false, analytics: true },
};

export function useGoogleConsent(requiresManager = true) {
  const [consent, setConsent] = useState(pendingGoogleConsent);
  useEffect(() => {
    if (requiresManager) return observeGoogleConsent(setConsent);
  }, [requiresManager]);
  // A GA-only installation has no AdSense CMP to await. Explicit local analytics
  // permission is still required by the caller; this never enables advertising.
  return requiresManager ? consent : analyticsWithoutCmp;
}
