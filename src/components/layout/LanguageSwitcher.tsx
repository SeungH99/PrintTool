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
 * Language dropdown — globe + current short code, opening a menu of short code +
 * full name (mirrors the design). Closes on outside click / Escape / selection.
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
        className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-hairline px-2.5 text-[13px] font-medium text-body transition-colors hover:text-ink"
      >
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M2.5 10h15M10 2.5c2 2.2 3 5 3 7.5s-1 5.3-3 7.5c-2-2.2-3-5-3-7.5s1-5.3 3-7.5z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        {LANGS[locale].short}
        <span aria-hidden="true" className="text-[9px] opacity-60">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] flex w-44 flex-col gap-0.5 rounded-md border border-hairline bg-elevated p-1.5 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.18)]"
        >
          {locales.map((l) => (
            <Link
              key={l}
              href={hrefFor(l)}
              onClick={() => setOpen(false)}
              aria-current={l === locale ? 'true' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-sm px-2.5 py-2 no-underline transition-colors',
                l === locale ? 'bg-hairline-soft' : 'hover:bg-hairline-soft',
              )}
            >
              <span className="w-[26px] flex-none font-mono text-[11px] tracking-wide text-mute">
                {LANGS[l].short}
              </span>
              <span
                className={cn('text-[13px]', l === locale ? 'font-medium text-ink' : 'text-body')}
              >
                {LANGS[l].label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
