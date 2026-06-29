import { describe, it, expect } from 'vitest';
import { calculateBooklet } from '@/lib/calculations';

describe('calculateBooklet', () => {
  it('pairs saddle-stitch pages outer/inner for an 8-page booklet', () => {
    const r = calculateBooklet({ pages: 8 });
    expect(r.valid).toBe(true);
    expect(r.sheets).toBe(2);
    expect(r.blanks).toBe(0);
    expect(r.spreads).toEqual([
      { sheet: 1, side: 'outer', left: 8, right: 1 },
      { sheet: 1, side: 'inner', left: 2, right: 7 },
      { sheet: 2, side: 'outer', left: 6, right: 3 },
      { sheet: 2, side: 'inner', left: 4, right: 5 },
    ]);
  });

  it('pads a non-multiple-of-4 page count with blanks and flags it', () => {
    const r = calculateBooklet({ pages: 6 });
    expect(r.valid).toBe(false);
    expect(r.paddedPages).toBe(8);
    expect(r.blanks).toBe(2);
    expect(r.sheets).toBe(2);
  });

  it('throws on non-positive pages', () => {
    expect(() => calculateBooklet({ pages: 0 })).toThrow();
  });
});
