/** Shared input parsing + display rounding for calculator components. */
export function toNum(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function round(n: number, digits = 1): string {
  const factor = 10 ** digits;
  return (Math.round(n * factor) / factor).toFixed(digits);
}
