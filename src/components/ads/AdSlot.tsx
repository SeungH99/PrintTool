'use client';

import { useEffect, useRef } from 'react';
import { useConsent } from '@/hooks/useConsent';

/**
 * Ad placement that respects the consent gate. With consent denied (the default,
 * until the certified CMP grants it) or no publisher ID configured, the network is
 * NOT loaded — the space is merely reserved. See ADR-0001 / src/lib/consent/consent.ts.
 */
export function AdSlot({ label, note }: { label: string; note: string }) {
  const { ads } = useConsent();
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const pushed = useRef(false);

  useEffect(() => {
    if (!ads || !client || pushed.current) return;
    try {
      (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ??= [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // adsbygoogle.js not ready yet; will retry on next consent/mount change.
    }
  }, [ads, client]);

  if (!ads || !client) {
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

  return (
    <ins
      className="adsbygoogle my-12 block min-h-[120px]"
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
