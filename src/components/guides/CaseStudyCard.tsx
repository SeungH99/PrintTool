import Link from 'next/link';
import type { CaseStudySummary } from '@/content/guides';
import type { Locale } from '@/i18n/config';

const copy = {
  ko: { label: '검증 사례', updated: '업데이트' },
  en: { label: 'Verified case', updated: 'Updated' },
} as const;

export function CaseStudyCard({ locale, study }: { locale: Locale; study: CaseStudySummary }) {
  const labels = copy[locale];

  return (
    <Link
      className="flex flex-col gap-2 rounded-lg border border-hairline bg-elevated p-5 no-underline transition-colors hover:border-link"
      href={`/${locale}/guides/${study.slug}`}
    >
      <span className="font-mono text-xs uppercase tracking-wide text-mute">{labels.label}</span>
      <span className="text-base font-semibold text-ink">{study.title}</span>
      <span className="text-[13px] leading-relaxed text-mute">{study.description}</span>
      <span className="mt-auto pt-2 text-xs text-mute">
        {labels.updated}: <time dateTime={study.updatedAt}>{study.updatedAt}</time>
      </span>
    </Link>
  );
}
