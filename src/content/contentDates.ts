import { caseStudies } from '@/content/caseStudies';
import { getEditorialGuide } from '@/content/guides';
import { toolIds, type ToolId } from '@/lib/tools';

const STATIC_DATES: Record<string, string> = {
  '': '2026-10-18',
  '/guides': '2026-10-18',
  '/reference': '2026-08-09',
  '/about': '2026-08-09',
  '/contact': '2026-06-30',
  '/terms': '2026-06-30',
  '/privacy': '2026-10-18',
};

/** Returns the published revision date for a locale-independent sitemap path. */
export function contentLastModified(path: string): string {
  const caseStudy = caseStudies.find((study) => `/guides/${study.slug}` === path);
  if (caseStudy) return caseStudy.updatedAt;

  const editorial = getEditorialGuide('en', path.replace('/guides/', ''));
  if (editorial) return editorial.updatedAt;

  if (path.startsWith('/') && toolIds.includes(path.slice(1) as ToolId)) {
    return '2026-10-18';
  }

  return STATIC_DATES[path] ?? '2026-06-30';
}
