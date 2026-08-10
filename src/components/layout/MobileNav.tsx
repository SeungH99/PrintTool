'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
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
    if (!open) {
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
      return;
    }

    const dialog = dialogRef.current;
    const focusableSelector = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
    const focusable = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    focusable()[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function openMenu() {
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : triggerRef.current;
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={dict.nav.menu}
        aria-expanded={open}
        onClick={openMenu}
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-hairline bg-elevated text-lg text-ink"
      >
        <span aria-hidden="true">☰</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={dialogRef}
            className="fixed inset-0 z-50"
            role="dialog"
            aria-label={dict.nav.menu}
            aria-modal="true"
          >
            <div className="absolute inset-0 bg-black/30" aria-hidden="true" onClick={closeMenu} />
            <nav className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col gap-1 overflow-y-auto border-l border-hairline bg-canvas p-4 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.25)]">
              <button
                type="button"
                aria-label={dict.nav.closeMenu}
                onClick={closeMenu}
                className="mb-2 self-end px-2 text-base text-mute transition-colors hover:text-ink"
              >
                ✕
              </button>
              <Link
                href={`/${locale}`}
                onClick={closeMenu}
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
                        onClick={closeMenu}
                        className="block rounded-sm px-3 py-2.5 text-sm text-body no-underline transition-colors hover:bg-hairline-soft hover:text-ink"
                      >
                        {tool.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
