'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

const LANGS: Record<Locale, { short: string; label: string }> = {
  ko: { short: 'KO', label: '한국어' },
  en: { short: 'EN', label: 'English' },
};

/**
 * Language dropdown — mirrors the design (current locale short code → menu of
 * full names). Closes on outside click / Escape / selection.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function hrefFor(target: Locale): string {
    const segments = pathname.split('/');
    segments[1] = target; // swap the leading locale segment, keep the rest of the path
    const next = segments.join('/');
    return next === '' ? `/${target}` : next;
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={locale === 'ko' ? '언어 선택' : 'Select language'}
        className="inline-flex h-8 items-center gap-1 rounded-sm border border-hairline px-2.5 text-[13px] font-medium text-body transition-colors hover:text-ink"
      >
        {LANGS[locale].short}
        <span aria-hidden="true" className="text-[10px] opacity-70">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] flex w-32 flex-col gap-0.5 rounded-md border border-hairline bg-elevated p-1.5 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.18)]"
        >
          {locales.map((l) => (
            <Link
              key={l}
              href={hrefFor(l)}
              onClick={() => setOpen(false)}
              aria-current={l === locale ? 'true' : undefined}
              className={cn(
                'rounded-sm px-2.5 py-1.5 text-[13px] no-underline transition-colors',
                l === locale
                  ? 'bg-hairline-soft font-medium text-ink'
                  : 'text-body hover:bg-hairline-soft',
              )}
            >
              {LANGS[l].label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
