'use client';

import { useConsent } from '@/hooks/useConsent';

/**
 * Ad placement that respects the consent gate. With consent denied (the default,
 * and always until a real CMP grants it) the network is NOT loaded — the space is
 * merely reserved. See ADR-0001 / src/lib/consent/consent.ts.
 */
export function AdSlot({ label, note }: { label: string; note: string }) {
  const { ads } = useConsent();

  if (!ads) {
    return (
      <div
        className="my-12 flex min-h-[120px] flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-hairline bg-hairline-soft"
        aria-hidden="true"
      >
        <span className="font-mono text-[11px] uppercase tracking-widest text-faint">{label}</span>
        <span className="text-xs text-faint">{note}</span>
      </div>
    );
  }

  // TODO(ADR-0001): mount the real AdSense slot here once a certified CMP grants consent.
  return <div className="my-12 min-h-[120px]" data-ad-slot />;
}
