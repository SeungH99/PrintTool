import type { Locale } from '@/i18n/config';
import { caseStudies, caseStudySlugs } from './data';

export { caseStudies, caseStudySlugs };
export * from './types';

export function getCaseStudy(locale: Locale, slug: string) {
  const record = caseStudies.find((study) => study.slug === slug);
  if (!record) return undefined;
  return { ...record, ...record.copy[locale] };
}

export function getCaseStudySummary(locale: Locale, slug: string) {
  const study = getCaseStudy(locale, slug);
  if (!study) return undefined;
  return {
    slug: study.slug,
    kind: 'case-study' as const,
    title: study.title,
    description: study.description,
    updatedAt: study.updatedAt,
    relatedTools: study.relatedTools,
  };
}
