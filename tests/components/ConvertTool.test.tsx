import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { PDFDocument, cmyk } from 'pdf-lib';
import { ConvertTool } from '@/components/calculators/ConvertTool';
import { getDictionary } from '@/i18n/dictionaries';

describe('PDF resize output description', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    { locale: 'ko' as const, preserved: '원본 PDF 색상 유지' },
    { locale: 'en' as const, preserved: 'Original PDF colors preserved' },
  ])('does not claim a resized CMYK PDF became RGB in $locale', async ({ locale, preserved }) => {
    const doc = await PDFDocument.create();
    doc
      .addPage([200, 100])
      .drawRectangle({ x: 0, y: 0, width: 200, height: 100, color: cmyk(1, 0, 0, 0) });
    const bytes = await doc.save();
    const file = new File([bytes as BlobPart], 'cmyk-artwork.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'arrayBuffer', { value: async () => bytes.slice().buffer });
    // jsdom has no Blob URL implementation. Actual PDF resizing stays real.
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL() {
          return 'blob:converted';
        }
        static revokeObjectURL() {}
      },
    );
    const dict = getDictionary(locale);
    render(<ConvertTool dict={dict} locale={locale} eyebrow="PDF" title="Convert" desc="" />);
    fireEvent.change(screen.getByLabelText(/(?:놓으세요|here)/), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: dict.calc.convert.start }));
    await screen.findByRole('link', { name: dict.calc.convert.download });
    const colorRow = within(screen.getByText(dict.calc.convert.specColor).parentElement!);
    expect(colorRow.getByText(preserved)).toBeInTheDocument();
    expect(colorRow.queryByText('RGB')).not.toBeInTheDocument();
  });
});
