import { describe, it, expect } from 'vitest';
import { calculateBleed } from '@/lib/calculations';

describe('calculateBleed', () => {
  // A business card 90 x 50 mm, 3mm bleed, 3mm safe margin.
  const card = { widthMm: 90, heightMm: 50, bleedMm: 3, safeMm: 3 };

  it('adds bleed on all four sides to the work size', () => {
    const r = calculateBleed(card);
    expect(r.workWmm).toBe(96);
    expect(r.workHmm).toBe(56);
  });

  it('insets the safe box by the safe margin on all sides', () => {
    const r = calculateBleed(card);
    expect(r.safeWmm).toBe(84);
    expect(r.safeHmm).toBe(44);
  });

  it('echoes the trim (finished) size', () => {
    const r = calculateBleed(card);
    expect(r.trimWmm).toBe(90);
    expect(r.trimHmm).toBe(50);
  });

  it('supports zero bleed and zero safe margin', () => {
    const r = calculateBleed({ ...card, bleedMm: 0, safeMm: 0 });
    expect(r.workWmm).toBe(90);
    expect(r.safeWmm).toBe(90);
  });

  it('throws when the safe margin exceeds half the trim size', () => {
    expect(() => calculateBleed({ ...card, safeMm: 30 })).toThrow();
  });
});
