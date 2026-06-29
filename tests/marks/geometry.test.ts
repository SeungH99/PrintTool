import { describe, it, expect } from 'vitest';
import { computeMarks, type MarksOptions } from '@/lib/marks/geometry';

const MM_TO_PT = 72 / 25.4;
const base: MarksOptions = {
  bleedMm: 3,
  offsetMm: 2,
  lengthMm: 5,
  crop: true,
  registration: false,
};

describe('computeMarks', () => {
  it('emits eight crop marks (two per corner) and no circles', () => {
    const g = computeMarks(200, 300, base);
    expect(g.lines).toHaveLength(8);
    expect(g.circles).toHaveLength(0);
    // margin = (bleed + offset + length) in points
    expect(g.marginPt).toBeCloseTo(10 * MM_TO_PT, 3);
  });

  it('places the bottom-left marks outside the trim corner', () => {
    const g = computeMarks(200, 300, base);
    const out = 5 * MM_TO_PT;
    const len = 5 * MM_TO_PT;
    // vertical mark at x=0 extending downward
    expect(g.lines).toContainEqual({ x1: 0, y1: -out, x2: 0, y2: -(out + len) });
    // horizontal mark at y=0 extending left
    expect(g.lines).toContainEqual({ x1: -out, y1: 0, x2: -(out + len), y2: 0 });
  });

  it('adds four registration targets with crosshairs', () => {
    const g = computeMarks(200, 300, { ...base, crop: false, registration: true });
    expect(g.circles).toHaveLength(4);
    expect(g.lines).toHaveLength(8); // 2 crosshair lines per target
  });

  it('combines crop and registration marks', () => {
    const g = computeMarks(200, 300, { ...base, registration: true });
    expect(g.lines).toHaveLength(16);
    expect(g.circles).toHaveLength(4);
  });
});
