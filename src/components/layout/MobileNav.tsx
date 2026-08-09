'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import { groupTools } from '@/lib/tools';

/**
 * Mobile header navigation (`md:hidden`) — a burger button that opens a drawer
 * with home and the full tool list. Closes on overlay click, Escape, or selecting
 * a link. The desktop nav (md+) is unaffected.
 */
export function MobileNav({ locale, dict }: { locale: string; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const groupedTools = groupTools(dict.tools);
  const mobileGroups = [
    {
      key: 'file-preparation',
      label: `${dict.home.categories.preflight} · ${dict.home.categories.convert}`,
      tools: groupedTools
        .filter(({ key }) => key === 'preflight' || key === 'convert')
        .flatMap(({ tools }) => tools),
    },
    ...groupedTools
      .filter(({ key }) => key !== 'preflight' && key !== 'convert')
      .map((group) => ({
        ...group,
        label: dict.home.categories[group.key],
      })),
  ];

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
            <div data-testid="mobile-tool-groups">
              {mobileGroups.map((group) => (
                <div key={group.key}>
                  <h2
                    className={
                      locale === 'ko'
                        ? 'mt-2 px-3 py-1 text-[13px] font-semibold text-faint'
                        : 'mt-2 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-faint'
                    }
                  >
                    {group.label}
                  </h2>
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
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
