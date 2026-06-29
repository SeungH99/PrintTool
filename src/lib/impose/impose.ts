import { PDFDocument, degrees } from 'pdf-lib';
import { MM_TO_PT } from '@/lib/convert/page-geometry';
import { imposeLayout, type ImposeOptions } from './layout';

export type { ImposeOptions };

export interface ImposeResult {
  bytes: Uint8Array;
  cols: number;
  rows: number;
  perSheet: number;
  rotated: boolean;
}

/**
 * Repeat the first page of a PDF across a parent press sheet (n-up imposition).
 * Reads the finished-piece size from the source page, lays it out via the pure
 * `imposeLayout`, and stamps each copy with pdf-lib. Pure bytes in, bytes out.
 * Throws if no copy fits (piece larger than the usable sheet area).
 */
export async function imposePdf(
  pdfBytes: Uint8Array,
  opts: ImposeOptions,
): Promise<ImposeResult> {
  const src = await PDFDocument.load(pdfBytes);
  if (src.getPageCount() === 0) throw new Error('PDF has no pages');

  const srcPage = src.getPage(0);
  const { width: pieceWpt, height: pieceHpt } = srcPage.getSize();
  const layout = imposeLayout(opts, pieceWpt / MM_TO_PT, pieceHpt / MM_TO_PT);
  if (layout.perSheet === 0) throw new Error('Piece does not fit on the sheet');

  const out = await PDFDocument.create();
  const [embedded] = await out.embedPages([srcPage]);
  const page = out.addPage([layout.sheetWpt, layout.sheetHpt]);
  for (const p of layout.placements) {
    page.drawPage(embedded, { x: p.xPt, y: p.yPt, rotate: degrees(p.rotateDeg) });
  }

  return {
    bytes: await out.save(),
    cols: layout.cols,
    rows: layout.rows,
    perSheet: layout.perSheet,
    rotated: layout.rotated,
  };
}
