'use client';

import { OPEN_CONSENT_EVENT } from '@/lib/consent/consent';

// Opens working first-party controls for every visitor; the panel also exposes
// the regional Google controls when they apply.
export function CookieSettingsButton({ label }: { label: string; privacyHref: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="text-[13px] text-body no-underline transition-colors hover:text-ink"
    >
      {label}
    </button>
  );
}
