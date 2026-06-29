'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import { buttonClass } from '@/components/ui/buttonClass';
import { groupTools } from '@/lib/tools';

/**
 * Mobile header navigation (`md:hidden`) — a burger button that opens a drawer
 * with home, the full tool list, and the primary CTA. Closes on overlay click,
 * Escape, or selecting a link. The desktop nav (md+) is unaffected.
 */
export function MobileNav({ locale, dict }: { locale: string; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-hairline bg-elevated text-lg text-ink"
      >
        <span aria-hidden="true">☰</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <nav className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col gap-1 border-l border-hairline bg-canvas p-4 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.25)]">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="mb-2 self-end px-2 text-base text-mute transition-colors hover:text-ink"
            >
              ✕
            </button>
            <Link
              href={`/${locale}`}
              onClick={() => setOpen(false)}
              className="rounded-sm px-3 py-2.5 text-sm font-medium text-ink no-underline transition-colors hover:bg-hairline-soft"
            >
              {dict.nav.home}
            </Link>
            {groupTools(dict.tools).map((group) => (
              <div key={group.key}>
                <div
                  className={
                    locale === 'ko'
                      ? 'mt-2 px-3 py-1 text-[13px] font-semibold text-faint'
                      : 'mt-2 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-faint'
                  }
                >
                  {dict.home.categories[group.key]}
                </div>
                {group.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/${locale}/${tool.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-sm px-3 py-2.5 text-sm text-body no-underline transition-colors hover:bg-hairline-soft hover:text-ink"
                  >
                    {tool.title}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href={`/${locale}/pdf`}
              onClick={() => setOpen(false)}
              className={`mt-3 ${buttonClass({ variant: 'primary', shape: 'pill', full: true })}`}
            >
              {dict.nav.cta}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
