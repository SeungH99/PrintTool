import { describe, it, expect } from 'vitest';
import { calculateFold } from '@/lib/calculations';

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

describe('calculateFold', () => {
  it('half fold splits the width into two equal panels', () => {
    const { panels } = calculateFold({ widthMm: 210, type: 'half', innerMm: 0 });
    expect(panels.map((p) => p.widthMm)).toEqual([105, 105]);
  });

  it('z-fold gives three equal panels', () => {
    const { panels } = calculateFold({ widthMm: 297, type: 'zfold', innerMm: 0 });
    expect(panels).toHaveLength(3);
    panels.forEach((p) => expect(p.widthMm).toBeCloseTo(99, 5));
  });

  it('letter fold narrows the inner panel and keeps the total width', () => {
    const { panels } = calculateFold({ widthMm: 297, type: 'letter', innerMm: 2 });
    // inner = 297/3 - 2 = 97, outer = (297 - 97) / 2 = 100
    expect(panels.map((p) => p.widthMm)).toEqual([100, 97, 100]);
    expect(panels[1].shorter).toBe(true);
    expect(sum(panels.map((p) => p.widthMm))).toBeCloseTo(297, 5);
  });

  it('roll fold narrows progressively toward the inner panels and conserves width', () => {
    const { panels } = calculateFold({ widthMm: 297, type: 'roll', innerMm: 2 });
    expect(panels).toHaveLength(4);
    // strictly decreasing widths
    for (let i = 1; i < panels.length; i++) {
      expect(panels[i].widthMm).toBeLessThan(panels[i - 1].widthMm);
    }
    expect(sum(panels.map((p) => p.widthMm))).toBeCloseTo(297, 5);
  });
});
