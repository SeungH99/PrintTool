// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { PDFDocument, rgb } from 'pdf-lib';
import { applyMarks } from '@/lib/marks/apply';

async function makePage(wPt: number, hPt: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([wPt, hPt]);
  page.drawRectangle({ x: 10, y: 10, width: 40, height: 40, color: rgb(0, 0, 0) });
  return doc.save();
}

describe('applyMarks', () => {
  it('grows the page box to make room for the marks', async () => {
    const src = await makePage(300, 400);
    const out = await applyMarks(src, {
      bleedMm: 3,
      offsetMm: 2,
      lengthMm: 5,
      crop: true,
      registration: true,
      thicknessPt: 0.25,
    });

    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(1);
    const media = doc.getPage(0).getMediaBox();
    const margin = 10 * (72 / 25.4);
    // Box expanded by ~margin on each side and origin shifted negative.
    expect(media.x).toBeCloseTo(-margin, 1);
    expect(media.width).toBeCloseTo(300 + 2 * margin, 1);
    expect(media.height).toBeCloseTo(400 + 2 * margin, 1);
  });

  it('rejects bytes that are not a valid PDF', async () => {
    await expect(
      applyMarks(new Uint8Array([1, 2, 3, 4]), {
        bleedMm: 3,
        offsetMm: 2,
        lengthMm: 5,
        crop: true,
        registration: false,
        thicknessPt: 0.25,
      }),
    ).rejects.toThrow();
  });
});
