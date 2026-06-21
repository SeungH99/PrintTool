'use client';

import { usePathname } from 'next/navigation';
import { localeFromPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buttonClass } from '@/components/ui/buttonClass';

/**
 * Error boundary for a locale segment. The layout supplies Header/Footer; this
 * is only the error body. Locale is read from the pathname (no params reach an
 * error boundary). `reset()` retries the failed render.
 */
export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = localeFromPath(usePathname());
  const t = getDictionary(locale).error;

  return (
    <section className="mx-auto flex max-w-page flex-col items-center px-6 py-24 text-center">
      <h1 className="m-0 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{t.title}</h1>
      <p className="mx-auto mt-4 max-w-[460px] text-base leading-relaxed text-body">{t.desc}</p>
      <button
        type="button"
        onClick={() => reset()}
        className={`mt-8 ${buttonClass({ variant: 'primary', shape: 'pill' })}`}
      >
        {t.retry}
      </button>
    </section>
  );
}
