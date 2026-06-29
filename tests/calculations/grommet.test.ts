import { describe, it, expect } from 'vitest';
import { calculateGrommet } from '@/lib/calculations';

describe('calculateGrommet', () => {
  // 3000 x 1000 mm banner, grommet every 600 mm.
  const banner = { widthMm: 3000, heightMm: 1000, spacingMm: 600 };

  it('counts grommets per edge including corners', () => {
    const r = calculateGrommet(banner);
    expect(r.topCount).toBe(6); // ceil(3000/600)+1
    expect(r.sideCount).toBe(3); // ceil(1000/600)+1
  });

  it('counts the perimeter total with shared corners once', () => {
    const r = calculateGrommet(banner);
    expect(r.total).toBe(2 * 6 + 2 * 3 - 4); // 14
  });

  it('places the first and last position at the corners', () => {
    const r = calculateGrommet(banner);
    expect(r.topPositions[0]).toBe(0);
    expect(r.topPositions[r.topPositions.length - 1]).toBe(3000);
  });

  it('always has at least a grommet at each corner', () => {
    const r = calculateGrommet({ widthMm: 200, heightMm: 200, spacingMm: 600 });
    expect(r.topCount).toBe(2);
    expect(r.total).toBe(4);
  });

  it('throws on non-positive spacing', () => {
    expect(() => calculateGrommet({ ...banner, spacingMm: 0 })).toThrow();
  });
});
