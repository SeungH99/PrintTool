import { describe, it, expect } from 'vitest';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { analyzePdf } from '@/lib/preflight/analyze';

describe('analyzePdf', () => {
  it('reads page count and A4 page size in millimeters', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([595.28, 841.89]); // A4 in points
    const bytes = await doc.save();

    const a = await analyzePdf(bytes);
    expect(a.pageCount).toBe(1);
    expect(a.pageWidthMm).toBeCloseTo(210, 0);
    expect(a.pageHeightMm).toBeCloseTo(297, 0);
    expect(a.hasTrimBox).toBe(false);
    expect(a.hasBleedBox).toBe(false);
    expect(a.fontsEmbedded).toBe('unknown'); // no fonts on a blank page
    expect(a.minImageDpi).toBeNull(); // no images on a blank page
  });

  it('flags standard (base-14) fonts as not embedded', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595.28, 841.89]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.drawText('PrintReady', { x: 50, y: 700, size: 24, font });
    const bytes = await doc.save();

    const a = await analyzePdf(bytes);
    expect(a.fontsEmbedded).toBe('none');
  });

  it('rejects bytes that are not a PDF', async () => {
    await expect(analyzePdf(new TextEncoder().encode('not a pdf'))).rejects.toThrow();
  });
});
