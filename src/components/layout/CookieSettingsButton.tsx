'use client';

import { useEffect, useState } from 'react';
import { observeConsentManager, openConsentManager } from '@/lib/consent/consent';

// Google only loads its regional CMP API for applicable visitors. The privacy-policy
// URL remains a functional fallback everywhere else instead of exposing a no-op button.
export function CookieSettingsButton({
  label,
  privacyHref,
}: {
  label: string;
  privacyHref: string;
}) {
  const [cmpApplies, setCmpApplies] = useState(false);

  useEffect(() => observeConsentManager(setCmpApplies), []);

  return (
    <a
      href={privacyHref}
      onClick={(event) => {
        if (cmpApplies && openConsentManager()) event.preventDefault();
      }}
      className="text-[13px] text-body no-underline transition-colors hover:text-ink"
    >
      {label}
    </a>
  );
}
