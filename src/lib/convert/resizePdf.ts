import { PDFDocument } from 'pdf-lib';
import { MM_TO_PT, PAGE_PT, type Orientation, type StandardPageId } from './page-geometry';

export type { Orientation };
export type ResizeTargetId = StandardPageId;

export interface ResizePdfOptions {
  /** Target page size every source page is normalised to. */
  pageSize?: ResizeTargetId;
  /** Uniform page margin in millimetres. */
  marginMm?: number;
  orientation?: Orientation;
}

/**
 * Re-fit every page of an existing PDF onto a normalised target page size,
 * preserving aspect ratio and centring (fit-to-page). Pure: bytes in, bytes
 * out. Page content is scaled, not re-rendered — the colour space is untouched.
 */
export async function resizePdf(
  pdfBytes: Uint8Array,
  options: ResizePdfOptions = {},
): Promise<Uint8Array> {
  const { pageSize = 'a4', marginMm = 0, orientation = 'auto' } = options;

  const src = await PDFDocument.load(pdfBytes);
  const out = await PDFDocument.create();
  const embedded = await out.embedPages(src.getPages());

  for (const ep of embedded) {
    const { width: sw, height: sh } = ep.scale(1);

    let { w: pw, h: ph } = PAGE_PT[pageSize];
    const landscape = orientation === 'landscape' || (orientation === 'auto' && sw > sh);
    if (landscape) [pw, ph] = [ph, pw];

    const margin = marginMm * MM_TO_PT;
    const scale = Math.min((pw - margin * 2) / sw, (ph - margin * 2) / sh);
    const dw = sw * scale;
    const dh = sh * scale;

    const page = out.addPage([pw, ph]);
    page.drawPage(ep, { x: (pw - dw) / 2, y: (ph - dh) / 2, xScale: scale, yScale: scale });
  }

  return out.save();
}
