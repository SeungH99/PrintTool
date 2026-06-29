import { calculateNup } from '@/lib/calculations';
import { MM_TO_PT } from '@/lib/convert/page-geometry';

export interface ImposeOptions {
  sheetWmm: number;
  sheetHmm: number;
  /** Gap between adjacent pieces, in mm. */
  gapMm: number;
  /** Edge/gripper margin kept clear on all four sides, in mm. */
  marginMm: number;
}

/** Where one copy of the piece is drawn, in PDF points (origin = sheet bottom-left). */
export interface Placement {
  xPt: number;
  yPt: number;
  /** 0 = upright, 90 = rotated a quarter turn to gain yield. */
  rotateDeg: 0 | 90;
}

export interface ImposeLayout {
  sheetWpt: number;
  sheetHpt: number;
  cols: number;
  rows: number;
  perSheet: number;
  rotated: boolean;
  placements: Placement[];
}

/**
 * Pure imposition geometry: given a parent sheet and a finished-piece size, reuse
 * the n-up yield calc on the usable area (sheet minus edge margins), then lay out
 * every copy's draw position. When the rotated orientation yields more, each piece
 * is turned a quarter turn — positions account for pdf-lib rotating about the
 * bottom-left corner. No pdf-lib, no React; fully unit-tested.
 */
export function imposeLayout(opts: ImposeOptions, pieceWmm: number, pieceHmm: number): ImposeLayout {
  const { sheetWmm, sheetHmm, gapMm, marginMm } = opts;
  const sheetWpt = sheetWmm * MM_TO_PT;
  const sheetHpt = sheetHmm * MM_TO_PT;

  const usableWmm = sheetWmm - 2 * marginMm;
  const usableHmm = sheetHmm - 2 * marginMm;
  if (usableWmm <= 0 || usableHmm <= 0) {
    return { sheetWpt, sheetHpt, cols: 0, rows: 0, perSheet: 0, rotated: false, placements: [] };
  }

  const nup = calculateNup({
    sheetWmm: usableWmm,
    sheetHmm: usableHmm,
    pieceWmm,
    pieceHmm,
    gapMm,
  });
  const { cols, rows, rotated, perSheet } = nup;

  const pieceWpt = pieceWmm * MM_TO_PT;
  const pieceHpt = pieceHmm * MM_TO_PT;
  // When rotated, the piece occupies (pieceH × pieceW) on the sheet.
  const cellWpt = rotated ? pieceHpt : pieceWpt;
  const cellHpt = rotated ? pieceWpt : pieceHpt;
  const marginPt = marginMm * MM_TO_PT;
  const gapPt = gapMm * MM_TO_PT;

  const placements: Placement[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cellX = marginPt + c * (cellWpt + gapPt);
      const cellY = sheetHpt - marginPt - (r + 1) * cellHpt - r * gapPt;
      // A 90° turn about the bottom-left pushes the piece left by its height,
      // so shift x right by the cell width to land it back inside the cell.
      placements.push(
        rotated
          ? { xPt: cellX + cellWpt, yPt: cellY, rotateDeg: 90 }
          : { xPt: cellX, yPt: cellY, rotateDeg: 0 },
      );
    }
  }

  return { sheetWpt, sheetHpt, cols, rows, perSheet, rotated, placements };
}
