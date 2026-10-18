import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { PdfPreflight } from '@/components/calculators/PdfPreflight';
import { analyzePdf, type PdfAnalysis } from '@/lib/preflight/analyze';
import { getDictionary } from '@/i18n/dictionaries';

// Browser PDF workers/canvas are outside this presentation test. Keep the real
// report builder and upload UI: changing their warning mapping must fail here.
vi.mock('@/lib/preflight/analyze', () => ({ analyzePdf: vi.fn() }));
vi.mock('@/lib/preflight/thumbnail', () => ({ renderFirstPage: async () => null }));

const detected: PdfAnalysis = {
  pageCount: 1,
  pageWidthMm: 297,
  pageHeightMm: 210,
  hasTrimBox: false,
  hasBleedBox: false,
  fontsEmbedded: 'unknown',
  minImageDpi: 102.626,
  colorMode: 'rgb',
};

async function upload(locale: 'ko' | 'en', analysis = detected) {
  vi.mocked(analyzePdf).mockResolvedValue(analysis);
  const dict = getDictionary(locale);
  render(<PdfPreflight dict={dict} locale={locale} eyebrow="PDF" title="PDF" desc="" />);
  const file = new File(['PDF bytes'], 'a4-rgb.pdf', { type: 'application/pdf' });
  Object.defineProperty(file, 'arrayBuffer', { value: async () => new ArrayBuffer(0) });
  fireEvent.change(screen.getByLabelText(/PDF.*(?:놓으세요|here)/), {
    target: { files: [file] },
  });
  await screen.findByText('102.6 DPI');
  return dict.calc.pdf;
}

function resultRow(label: string) {
  return within(screen.getByText(label).parentElement!.parentElement!);
}

describe('PDF report interpretation', () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    {
      locale: 'ko' as const,
      review: '확인 필요',
      dpi: '권장 DPI 미만 (300 DPI 기준)',
      rgb: 'RGB / 비CMYK 검출',
      missing: '박스 없음',
      manual: '수동 확인 필요',
    },
    {
      locale: 'en' as const,
      review: 'Needs review',
      dpi: 'Below recommended DPI (300 DPI threshold)',
      rgb: 'RGB / non-CMYK detected',
      missing: 'Box missing',
      manual: 'Manual review needed',
    },
  ])(
    'explains detected low DPI/RGB separately from missing boxes in $locale',
    async ({ locale, review, dpi, rgb, missing, manual }) => {
      const labels = await upload(locale);
      const resolution = resultRow(labels.items.resolution);
      expect(resolution.getByText('102.6 DPI')).toBeInTheDocument();
      expect(resolution.getByText(dpi)).toBeInTheDocument();
      expect(resolution.getByText(review)).toBeInTheDocument();
      expect(resultRow(labels.items.color).getByText(rgb)).toBeInTheDocument();
      expect(resultRow(labels.items.trim).getByText(missing)).toBeInTheDocument();
      expect(resultRow(labels.items.bleed).getByText(missing)).toBeInTheDocument();
      expect(resultRow(labels.items.fonts).getByText(manual)).toBeInTheDocument();
      expect(screen.queryByText(/^(미설정|Not set)$/)).not.toBeInTheDocument();
    },
  );
});
