'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

const NAMES: Record<Locale, string> = { ko: '한국어', en: 'EN' };

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  function hrefFor(target: Locale): string {
    const segments = pathname.split('/');
    segments[1] = target; // swap the leading locale segment, keep the rest of the path
    const next = segments.join('/');
    return next === '' ? `/${target}` : next;
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex h-8 items-center overflow-hidden rounded-sm border border-hairline"
    >
      {locales.map((l, i) => (
        <Link
          key={l}
          href={hrefFor(l)}
          aria-current={l === locale ? 'true' : undefined}
          className={cn(
            'px-2.5 text-[13px] font-medium leading-8 no-underline',
            i > 0 && 'border-l border-hairline',
            l === locale ? 'bg-ink text-white' : 'text-body hover:text-ink',
          )}
        >
          {NAMES[l]}
        </Link>
      ))}
    </div>
  );
}
