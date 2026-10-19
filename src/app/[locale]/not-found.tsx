'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

// Rendered when notFound() fires inside a locale (e.g. an unknown tool route).
// Layout supplies Header/Footer; this is only the 404 body. No params reach a
// not-found boundary, so the locale is read from the pathname.
export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split('/')[1];
  const locale = isLocale(segment) ? segment : 'ko';
  const dict = getDictionary(locale);
  const t = dict.notFound;

  return (
    <div data-printready-error className="relative overflow-hidden">
      <div className="bg-mesh pointer-events-none absolute inset-0 opacity-35" />
      <div className="hero-fade pointer-events-none absolute inset-0" />

      <section className="relative mx-auto max-w-[760px] px-6 pt-[clamp(72px,11vw,140px)] pb-[clamp(56px,8vw,96px)] text-center">
        <div className="font-mono text-[clamp(64px,14vw,128px)] font-semibold leading-none tracking-[-0.04em] text-ink">
          {t.code}
        </div>
        <h1 className="mt-5 text-[clamp(24px,3.4vw,34px)] font-semibold tracking-[-0.025em] text-ink">
          {t.title}
        </h1>
        <p className="mx-auto mt-4 max-w-[480px] text-base leading-relaxed text-body text-pretty">
          {t.desc}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex h-10 items-center rounded-pill bg-ink px-5 text-sm font-medium text-canvas"
          >
            {t.home}
          </Link>
          <a
            href="#nf-tools"
            className="inline-flex h-10 items-center rounded-pill border border-hairline bg-elevated px-5 text-sm font-medium text-ink"
          >
            {t.tools}
          </a>
        </div>
      </section>

      <section
        id="nf-tools"
        className="relative mx-auto max-w-page px-6 pb-[clamp(72px,9vw,112px)]"
      >
        <div className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.06em] text-faint">
          {t.toolsHead}
        </div>
        <div className="mx-auto grid max-w-[760px] grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
          {dict.tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${locale}/${tool.id}`}
              className="flex items-center gap-3 rounded-md border border-hairline bg-elevated p-4 transition-colors hover:border-faint"
            >
              <span className="flex-1 text-sm font-medium text-ink">{tool.title}</span>
              <span className="text-base text-faint">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
