import type { SpineInput, SpineResult } from './types';

export interface SpineOptions {
  /** Paper caliper per GSM, in mm. Default assumes typical uncoated offset bulk. */
  bulkMmPerGsm?: number;
  /** Hardcover board thickness added at the spine for case binding, in mm. */
  caseBoardMm?: number;
  /** Saddle-stitch nesting factor (effective spine vs. flat thickness). */
  saddleFactor?: number;
}

// Heuristic defaults — ASSUMPTIONS, not measured values. Actual results vary by
// paper bulk, binding shop and board stock; confirm with the printer / paper spec
// before treating any output as production-accurate (ADR-0002).
const DEFAULT_BULK_MM_PER_GSM = 0.00126; // ~1.26 cm3/g, typical uncoated offset
const DEFAULT_CASE_BOARD_MM = 4; // hardcover board thickness at the spine
const DEFAULT_SADDLE_FACTOR = 0.55; // nested signatures reduce the effective spine

/**
 * Estimated spine thickness. The underlying paper math (leaves x caliper) is sound;
 * the bulk/board/saddle constants are documented assumptions, overridable via `options`.
 */
export function calculateSpine(input: SpineInput, options: SpineOptions = {}): SpineResult {
  const { binding, pages, interiorGsm, coverGsm } = input;
  const bulk = options.bulkMmPerGsm ?? DEFAULT_BULK_MM_PER_GSM;
  const board = options.caseBoardMm ?? DEFAULT_CASE_BOARD_MM;
  const saddleFactor = options.saddleFactor ?? DEFAULT_SADDLE_FACTOR;

  const leaves = pages / 2;
  const textBlockMm = leaves * interiorGsm * bulk;
  const coverMm = 2 * coverGsm * bulk;

  let spineMm: number;
  switch (binding) {
    case 'perfect':
      spineMm = textBlockMm + coverMm; // cover wraps around the spine
      break;
    case 'case':
      spineMm = textBlockMm + board; // boards dominate; cover paper negligible
      break;
    case 'saddle':
      spineMm = textBlockMm * saddleFactor; // nested signatures, almost no flat spine
      break;
    default: {
      const exhaustive: never = binding;
      throw new Error(`unknown binding: ${String(exhaustive)}`);
    }
  }

  return { spineMm, leaves, warnPageMultiple: pages % 4 !== 0 };
}
