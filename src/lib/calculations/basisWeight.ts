import type { BasisWeightInput, BasisWeightResult } from './types';
import { validateBasisWeight } from './validate';

/**
 * GSM → US basis weight (lb), per paper grade. Each grade has a different basis
 * sheet size, so `lb = gsm / factor` with a grade-specific factor (gsm per lb).
 * Factors are the industry-standard conversion constants. Pure math.
 */
const FACTORS = {
  bond: 3.7607,
  text: 1.4805,
  cover: 2.7048,
  index: 1.8753,
  tag: 1.6275,
  bristol: 2.1922,
} as const;

export function calculateBasisWeight(input: BasisWeightInput): BasisWeightResult {
  const v = validateBasisWeight(input);
  if (!v.ok) throw new RangeError(v.error);
  const { gsm } = input;
  return {
    bond: gsm / FACTORS.bond,
    text: gsm / FACTORS.text,
    cover: gsm / FACTORS.cover,
    index: gsm / FACTORS.index,
    tag: gsm / FACTORS.tag,
    bristol: gsm / FACTORS.bristol,
  };
}
