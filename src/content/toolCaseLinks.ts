import type { CaseStudySlug } from '@/content/caseStudies';
import type { Locale } from '@/i18n/config';
import type { ToolId } from '@/lib/tools';

const TOOL_CASES: Partial<Record<ToolId, CaseStudySlug>> = {
  pdf: 'print-file-prep',
  convert: 'print-file-prep',
  res: 'resolution-and-dpi',
  color: 'cmyk-vs-rgb',
  bleed: 'bleed-and-trim',
  booklet: 'saddle-stitch-booklet',
};

const CASE_LINK_LABELS: Record<Locale, string> = {
  ko: '실제 파일로 검증한 사례 보기',
  en: 'View the verified file example',
};

export function getToolCaseLink(
  locale: Locale,
  toolId: ToolId,
): { href: string; label: string } | undefined {
  const caseSlug = TOOL_CASES[toolId];
  if (!caseSlug) return undefined;

  return {
    href: `/${locale}/guides/${caseSlug}`,
    label: CASE_LINK_LABELS[locale],
  };
}
