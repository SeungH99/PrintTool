import { describe, it, expect } from 'vitest';
import { PDFDocument, rgb } from 'pdf-lib';
import { resizePdf } from '@/lib/convert/resizePdf';

const MM = 72 / 25.4;

/**
 * Build a source PDF with the given page sizes in points. Each page gets a
 * drawn rectangle so it has a Contents stream (pdf-lib cannot embed a page
 * with no contents — a truly blank addPage() would).
 */
async function makePdf(pages: Array<[number, number]>): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (const [w, h] of pages) {
    const page = doc.addPage([w, h]);
    page.drawRectangle({
      x: w * 0.25,
      y: h * 0.25,
      width: w * 0.5,
      height: h * 0.5,
      color: rgb(0.8, 0.1, 0.1),
    });
  }
  return doc.save();
}

describe('resizePdf', () => {
  it('normalises a tall page to A4 portrait', async () => {
    const bytes = await resizePdf(await makePdf([[300, 600]]), { pageSize: 'a4' });
    expect(bytes[0]).toBe(0x25); // "%"
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
    const page = doc.getPage(0);
    expect(page.getWidth()).toBeCloseTo(210 * MM, 0);
    expect(page.getHeight()).toBeCloseTo(297 * MM, 0);
  });

  it('auto-rotates to landscape for a wide page', async () => {
    const bytes = await resizePdf(await makePdf([[600, 300]]), { pageSize: 'a4' });
    const page = (await PDFDocument.load(bytes)).getPage(0);
    expect(page.getWidth()).toBeCloseTo(297 * MM, 0);
    expect(page.getWidth()).toBeGreaterThan(page.getHeight());
  });

  it('preserves page count and normalises every page', async () => {
    const bytes = await resizePdf(
      await makePdf([
        [300, 600],
        [600, 300],
        [400, 400],
      ]),
      { pageSize: 'letter' },
    );
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(3);
    for (const page of doc.getPages()) {
      const edges = [page.getWidth(), page.getHeight()].sort((a, b) => a - b);
      expect(edges[0]).toBeCloseTo(8.5 * 72, 0); // short edge
      expect(edges[1]).toBeCloseTo(11 * 72, 0); // long edge
    }
  });

  it('rejects bytes that are not a PDF', async () => {
    await expect(resizePdf(new Uint8Array([1, 2, 3]))).rejects.toThrow();
  });
});
