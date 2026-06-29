// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { PDFDocument, rgb } from 'pdf-lib';
import { imposePdf } from '@/lib/impose/impose';

async function makePiece(wPt: number, hPt: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([wPt, hPt]);
  // pdf-lib refuses to embed a page with no content stream, so draw something.
  page.drawRectangle({ x: 10, y: 10, width: 40, height: 40, color: rgb(0, 0, 0) });
  return doc.save();
}

describe('imposePdf', () => {
  it('produces a single parent-sheet page sized to the sheet', async () => {
    const piece = await makePiece(595, 842); // ~A4 in pt
    const { bytes, perSheet, rotated } = await imposePdf(piece, {
      sheetWmm: 788,
      sheetHmm: 1091,
      gapMm: 0,
      marginMm: 0,
    });
    expect(perSheet).toBe(10);
    expect(rotated).toBe(true);

    const out = await PDFDocument.load(bytes);
    expect(out.getPageCount()).toBe(1);
    const { width, height } = out.getPage(0).getSize();
    expect(width).toBeCloseTo(788 * (72 / 25.4), 1);
    expect(height).toBeCloseTo(1091 * (72 / 25.4), 1);
  });

  it('throws when the piece does not fit', async () => {
    const piece = await makePiece(800, 800);
    await expect(
      imposePdf(piece, { sheetWmm: 200, sheetHmm: 200, gapMm: 0, marginMm: 0 }),
    ).rejects.toThrow();
  });
});
