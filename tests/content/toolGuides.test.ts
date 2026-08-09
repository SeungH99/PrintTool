import { describe, expect, it } from 'vitest';
import { getDictionary } from '@/i18n/dictionaries';
import { toolIds, type ToolId } from '@/lib/tools';
import { getToolCaseLink } from '@/content/toolCaseLinks';

describe('focused tool guidance', () => {
  it.each(['ko', 'en'] as const)('keeps %s tool copy concise and unique', (locale) => {
    const dict = getDictionary(locale);
    const intros = toolIds.map((id) => dict.toolGuides[id].intro);

    expect(new Set(intros).size).toBe(toolIds.length);
    for (const id of toolIds) {
      expect(dict.toolGuides[id].body.length).toBeLessThanOrEqual(3);
      expect(dict.toolGuides[id].faq.length).toBeLessThanOrEqual(3);
    }
  });

  it('links only tools supported by a verified case', () => {
    const expectedCases: Partial<Record<ToolId, string>> = {
      pdf: 'print-file-prep',
      convert: 'print-file-prep',
      res: 'resolution-and-dpi',
      color: 'cmyk-vs-rgb',
      bleed: 'bleed-and-trim',
      booklet: 'saddle-stitch-booklet',
      impose: 'saddle-stitch-booklet',
    };

    for (const locale of ['ko', 'en'] as const) {
      for (const toolId of toolIds) {
        const relatedCase = getToolCaseLink(locale, toolId);
        const caseSlug = expectedCases[toolId];

        if (!caseSlug) {
          expect(relatedCase, `${locale}/${toolId}`).toBeUndefined();
          continue;
        }

        expect(relatedCase?.href).toBe(`/${locale}/guides/${caseSlug}`);
        expect(relatedCase?.label).toBe(
          locale === 'ko' ? '실제 파일로 검증한 사례 보기' : 'View the verified file example',
        );
      }
    }
  });
});
