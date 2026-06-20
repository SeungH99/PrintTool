import { describe, it, expect } from 'vitest';
import { calculateSpine } from '@/lib/calculations';

describe('calculateSpine', () => {
  const book = { pages: 200, interiorGsm: 100, coverGsm: 250 } as const;

  it('counts leaves as half the page count', () => {
    expect(calculateSpine({ ...book, binding: 'perfect' }).leaves).toBe(100);
  });

  it('perfect binding = leaves x caliper + both cover calipers', () => {
    // 100 leaves x (100 x 0.00126) + 2 x (250 x 0.00126) = 12.6 + 0.63
    expect(calculateSpine({ ...book, binding: 'perfect' }).spineMm).toBeCloseTo(13.23, 2);
  });

  it('saddle stitch nests, so the spine is a fraction of the flat thickness', () => {
    // 12.6 x 0.55
    expect(calculateSpine({ ...book, binding: 'saddle' }).spineMm).toBeCloseTo(6.93, 2);
  });

  it('case binding adds board thickness', () => {
    // 12.6 + 4 (board)
    expect(calculateSpine({ ...book, binding: 'case' }).spineMm).toBeCloseTo(16.6, 2);
  });

  it('flags a page count that is not a multiple of 4', () => {
    expect(calculateSpine({ ...book, binding: 'perfect' }).warnPageMultiple).toBe(false);
    expect(calculateSpine({ pages: 201, interiorGsm: 100, coverGsm: 250, binding: 'perfect' }).warnPageMultiple).toBe(true);
  });

  it('allows overriding the paper bulk assumption', () => {
    const a = calculateSpine({ ...book, binding: 'perfect' });
    const b = calculateSpine({ ...book, binding: 'perfect' }, { bulkMmPerGsm: 0.0008 });
    expect(b.spineMm).toBeLessThan(a.spineMm);
  });
});
