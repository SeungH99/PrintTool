import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ReferencePage from '@/app/[locale]/reference/page';
import { getPage } from '@/content/pages';
import { getReference } from '@/content/reference';
import { SOURCES } from '@/content/sources';

describe('reference and methodology trust signals', () => {
  it.each(['ko', 'en'] as const)('sources every %s reference table', (locale) => {
    const reference = getReference(locale);

    expect(reference.updatedAt).toBe('2026-08-09');
    expect(
      reference.tables.map((table) => ({
        sourceIds: table.sourceIds,
        basis: table.basis,
      })),
    ).toEqual([
      { sourceIds: ['iso216'], basis: 'standard' },
      { sourceIds: [], basis: 'commercial-convention' },
      { sourceIds: ['iso536'], basis: 'standard' },
      { sourceIds: ['adobePrintPdf'], basis: 'calculated' },
      { sourceIds: ['adobeBleed'], basis: 'commercial-convention' },
    ]);

    for (const table of reference.tables) {
      expect(table.sourceIds.length > 0 || table.basis === 'commercial-convention').toBe(true);
      expect(table.sourceIds.every((id) => id in SOURCES)).toBe(true);
    }
  });

  it.each(['ko', 'en'] as const)(
    'labels every %s Korean-trim value as printer-dependent',
    (locale) => {
      const trimTable = getReference(locale).tables[1];
      const printerDependent = locale === 'ko' ? /인쇄소.*확인/ : /printer.*confirm/i;

      expect(trimTable.sourceIds).toEqual([]);
      expect(trimTable.basis).toBe('commercial-convention');
      for (const row of trimTable.rows) {
        expect(row.join(' ')).toMatch(printerDependent);
      }
    },
  );

  it.each(['ko', 'en'] as const)('publishes methodology and limitations in %s', (locale) => {
    const about = getPage(locale, 'about');

    expect(about.updatedAt).toBe('2026-08-09');
    expect(about.sections.map((section) => section.heading)).toEqual(
      locale === 'ko'
        ? [
            '무엇을 제공하는가',
            '계산값을 검증하는 방법',
            'PDF 검사가 확인할 수 없는 것',
            '콘텐츠와 테스트 업데이트',
            '오류 제보와 수정 원칙',
          ]
        : [
            'What PrintReady provides',
            'How calculations are validated',
            'What PDF preflight cannot confirm',
            'Content and test updates',
            'Error reporting and corrections',
          ],
    );

    const copy = [about.intro, ...about.sections.map((section) => section.body)].join(' ');
    expect(copy).toMatch(locale === 'ko' ? /참고용 안내/ : /guidance/i);
    expect(copy).toMatch(
      locale === 'ko' ? /인쇄소.*사양.*우선/ : /printer.*specification.*takes precedence/i,
    );
    expect(copy).toMatch(locale === 'ko' ? /파일.*브라우저/ : /files.*browser/i);
    expect(copy).toMatch(
      locale === 'ko' ? /오류.*fixture.*재현/i : /reported error.*fixture.*reproduced/i,
    );
  });

  it('renders the localized update date and source links immediately after their tables', async () => {
    const result = await ReferencePage({ params: Promise.resolve({ locale: 'en' }) });
    render(result);

    expect(screen.getByText('Updated: 2026-08-09')).toBeInTheDocument();
    const standardPaperTable = screen.getByRole('table', { name: 'ISO A and B paper sizes' });
    const sourceList = standardPaperTable.nextElementSibling;

    expect(sourceList).toHaveAttribute('aria-label', 'Sources for ISO A and B paper sizes');
    const sourceLink = within(sourceList as HTMLElement).getByRole('link', {
      name: /International Organization for Standardization.*ISO 216/i,
    });
    expect(sourceLink).toHaveAttribute('href', SOURCES.iso216.url);
    expect(sourceLink).toHaveAttribute('target', '_blank');
    expect(sourceLink).toHaveAttribute('rel', 'noreferrer');
  });
});
