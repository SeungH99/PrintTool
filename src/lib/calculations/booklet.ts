import type { BookletInput, BookletResult, BookletSpread } from './types';
import { validateBooklet } from './validate';

/**
 * Saddle-stitch booklet imposition. A booklet must have a multiple of 4 pages;
 * any shortfall is padded with blanks. Each folded sheet holds 4 pages whose
 * reader page numbers are paired outer/inner from the outside sheet inward.
 * Pure math — no React, fully unit-tested.
 */
export function calculateBooklet(input: BookletInput): BookletResult {
  const v = validateBooklet(input);
  if (!v.ok) throw new RangeError(v.error);
  const pages = Math.max(1, Math.round(input.pages));
  const paddedPages = Math.ceil(pages / 4) * 4;
  const sheets = paddedPages / 4;
  const spreads: BookletSpread[] = [];
  for (let s = 0; s < sheets; s += 1) {
    spreads.push({ sheet: s + 1, side: 'outer', left: paddedPages - 2 * s, right: 1 + 2 * s });
    spreads.push({ sheet: s + 1, side: 'inner', left: 2 + 2 * s, right: paddedPages - 1 - 2 * s });
  }
  return { valid: pages % 4 === 0, paddedPages, blanks: paddedPages - pages, sheets, spreads };
}
