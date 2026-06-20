/** Shared print page geometry for the convert tools (imageToPdf, resizePdf). */

export const MM_TO_PT = 72 / 25.4;

/** Standard page sizes the convert tools normalise onto. */
export type StandardPageId = 'a4' | 'letter';

export type Orientation = 'auto' | 'portrait' | 'landscape';

/** Page dimensions in points (1pt = 1/72in). */
export const PAGE_PT: Record<StandardPageId, { w: number; h: number }> = {
  a4: { w: 210 * MM_TO_PT, h: 297 * MM_TO_PT },
  letter: { w: 8.5 * 72, h: 11 * 72 },
};
