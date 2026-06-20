import { describe, it, expect } from 'vitest';
import { calculateLabel } from '@/lib/calculations';

const base = {
  sheetWmm: 210,
  sheetHmm: 297,
  labelWmm: 63.5,
  labelHmm: 38.1,
  marginMm: 7,
  gapMm: 2.5,
  rotate: false,
};

describe('calculateLabel', () => {
  it('computes the grid that fits within the usable area', () => {
    const r = calculateLabel(base);
    // usable 196 x 283 -> 3 cols x 7 rows = 21
    expect(r.cols).toBe(3);
    expect(r.rows).toBe(7);
    expect(r.total).toBe(21);
    expect(r.rotated).toBe(false);
  });

  it('reports leftover space on the sheet', () => {
    const r = calculateLabel(base);
    expect(r.remainderWmm).toBeGreaterThanOrEqual(0);
    expect(r.remainderHmm).toBeGreaterThanOrEqual(0);
  });

  it('uses a rotated layout when it fits more labels', () => {
    // Tall narrow labels: rotating should fit more across the wider sheet dimension.
    const r = calculateLabel({ ...base, labelWmm: 38.1, labelHmm: 63.5, rotate: true });
    expect(r.rotated).toBe(true);
    expect(r.total).toBeGreaterThanOrEqual(21);
  });
});
