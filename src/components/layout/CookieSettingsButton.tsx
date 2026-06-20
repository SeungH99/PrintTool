'use client';

import { openConsentManager } from '@/lib/consent/consent';

// Footer "cookie settings" entry point. Wired to the consent stub today; a real
// CMP will take over openConsentManager() without changing this call site (ADR-0001).
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => openConsentManager()}
      className="cursor-pointer border-0 bg-transparent p-0 text-left text-[13px] text-body transition-colors hover:text-ink"
    >
      {label}
    </button>
  );
}
