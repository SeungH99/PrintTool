import type { GrommetInput, GrommetResult } from './types';
import { validateGrommet } from './validate';

/** Evenly spaced positions along one edge, with a grommet at each corner. */
function edge(length: number, spacing: number): number[] {
  const n = Math.max(2, Math.ceil(length / spacing) + 1);
  const step = length / (n - 1);
  return Array.from({ length: n }, (_, i) => Math.round(i * step));
}

/**
 * Banner grommet (eyelet) placement. Grommets sit at every corner and are spaced
 * no farther apart than the chosen spacing along each edge; positions are evenly
 * distributed. Pure geometry — no React, fully unit-tested.
 */
export function calculateGrommet(input: GrommetInput): GrommetResult {
  const v = validateGrommet(input);
  if (!v.ok) throw new RangeError(v.error);
  const { widthMm, heightMm, spacingMm } = input;
  const topPositions = edge(widthMm, spacingMm);
  const sidePositions = edge(heightMm, spacingMm);
  const topCount = topPositions.length;
  const sideCount = sidePositions.length;
  // Each corner is shared by a top/bottom edge and a side edge, so subtract 4.
  const total = 2 * topCount + 2 * sideCount - 4;
  return { topCount, sideCount, total, topPositions, sidePositions };
}
