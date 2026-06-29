import { PDFDocument, cmyk } from 'pdf-lib';
import { computeMarks, type MarksOptions } from './geometry';

export interface ApplyMarksOptions extends MarksOptions {
  /** Stroke width of the marks, in points. */
  thicknessPt: number;
}

/**
 * Draw printer marks (crop + registration) around the trim box of every page.
 * Marks are stamped directly on each page after growing its MediaBox to hold
 * them, so the page's existing /Rotate keeps content and marks aligned. The trim
 * is read from the TrimBox when present (else the page's CropBox/MediaBox).
 * Registration ink is rich black (CMYK 100/100/100/100) so it prints on every
 * plate. Pure bytes in, bytes out.
 */
export async function applyMarks(
  pdfBytes: Uint8Array,
  opts: ApplyMarksOptions,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  if (doc.getPageCount() === 0) throw new Error('PDF has no pages');
  const color = cmyk(0, 0, 0, 1);

  for (const page of doc.getPages()) {
    const media = page.getMediaBox();
    const trim = page.getTrimBox();
    const g = computeMarks(trim.width, trim.height, opts);
    const m = g.marginPt;

    // Grow the page box to contain both the existing content and the new marks.
    const left = Math.min(media.x, trim.x - m);
    const bottom = Math.min(media.y, trim.y - m);
    const right = Math.max(media.x + media.width, trim.x + trim.width + m);
    const top = Math.max(media.y + media.height, trim.y + trim.height + m);
    page.setMediaBox(left, bottom, right - left, top - bottom);
    page.setCropBox(left, bottom, right - left, top - bottom);

    for (const ln of g.lines) {
      page.drawLine({
        start: { x: trim.x + ln.x1, y: trim.y + ln.y1 },
        end: { x: trim.x + ln.x2, y: trim.y + ln.y2 },
        thickness: opts.thicknessPt,
        color,
      });
    }
    for (const ci of g.circles) {
      page.drawCircle({
        x: trim.x + ci.cx,
        y: trim.y + ci.cy,
        size: ci.r,
        borderColor: color,
        borderWidth: opts.thicknessPt,
      });
    }
  }

  return doc.save();
}
