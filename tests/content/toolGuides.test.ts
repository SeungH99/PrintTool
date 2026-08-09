import { describe, expect, it } from 'vitest';
import { getDictionary } from '@/i18n/dictionaries';
import { toolIds, type ToolId } from '@/lib/tools';
import { getToolCaseLink } from '@/content/toolCaseLinks';
import { getToolExample } from '@/content/toolExamples';

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

  it.each([
    {
      locale: 'ko' as const,
      required: [
        /내장 기본 CMYK ICC 프로파일/,
        /Little CMS/,
        /상업 인쇄소/,
        /프로파일/,
        /잉크/,
        /용지/,
        /렌더링/,
      ],
      falseClaim: /프로파일을 적용하지 않은|채널 비율을 이용한 일반적인 근사치/,
    },
    {
      locale: 'en' as const,
      required: [
        /bundled default CMYK ICC profile/i,
        /Little CMS/,
        /commercial printer/i,
        /profile/i,
        /ink/i,
        /stock|paper/i,
        /rendering/i,
      ],
      falseClaim: /profile-free|general channel formula/i,
    },
  ])(
    'describes the $locale color conversion engine accurately',
    ({ locale, required, falseClaim }) => {
      const guide = getDictionary(locale).toolGuides.color;
      const copy = [
        guide.intro,
        ...guide.body.map(({ text }) => text),
        ...guide.faq.map(({ a }) => a),
      ].join(' ');

      for (const phrase of required) expect(copy).toMatch(phrase);
      expect(copy).not.toMatch(falseClaim);
    },
  );

  it.each([
    {
      locale: 'ko' as const,
      required: [/첫 페이지만/, /격자/, /간격/],
      exampleRequired: [/첫 페이지.*반복/, /N-up|격자/],
      falseClaim: /중철|프린터 스프레드|페이지 순서|읽기 순서/,
    },
    {
      locale: 'en' as const,
      required: [/first page/i, /grid/i, /spacing/i],
      exampleRequired: [/first page.*repeat/i, /N-up|grid/i],
      falseClaim: /saddle-stitch|printer spreads?|page order|reading order/i,
    },
  ])(
    'describes the $locale imposition behavior accurately',
    ({ locale, required, exampleRequired, falseClaim }) => {
      const guide = getDictionary(locale).toolGuides.impose;
      const example = getToolExample(locale, 'impose');
      expect(example).toBeDefined();

      const exampleCopy = `${example!.heading} ${example!.body}`;
      const copy = [
        guide.intro,
        ...guide.body.map(({ text }) => text),
        ...guide.faq.map(({ a }) => a),
        exampleCopy,
      ].join(' ');

      for (const phrase of required) expect(copy).toMatch(phrase);
      for (const phrase of exampleRequired) expect(exampleCopy).toMatch(phrase);
      expect(copy).not.toMatch(falseClaim);
    },
  );

  it.each([
    {
      locale: 'ko' as const,
      required: [/모서리/, /오프셋 입력은 없습니다/, /각 변 전체를 균등/],
      falseClaim: /가장자리에서 일정한 오프셋|가장자리 오프셋/,
    },
    {
      locale: 'en' as const,
      required: [/corner/i, /no edge-offset control/i, /each full edge evenly/i],
      falseClaim: /applies an edge offset|edge offset and equal spacing/i,
    },
  ])('describes the $locale grommet controls accurately', ({ locale, required, falseClaim }) => {
    const guide = getDictionary(locale).toolGuides.grommet;
    const copy = [
      guide.intro,
      ...guide.body.map(({ text }) => text),
      ...guide.faq.map(({ a }) => a),
    ].join(' ');

    for (const phrase of required) expect(copy).toMatch(phrase);
    expect(copy).not.toMatch(falseClaim);
  });
});
