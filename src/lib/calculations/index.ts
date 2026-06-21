import type { PreflightSettings } from './types';

export * from './types';
export { calculateResolution } from './resolution';
export { calculatePaperWeight } from './paperWeight';
export { calculateSpine, type SpineOptions } from './spine';
export { calculateFold } from './fold';
export { calculateLabel } from './label';
export * from './validate';

export class NotImplementedError extends Error {
  constructor(what: string) {
    super(`${what} is not implemented yet. See ADR-0002.`);
    this.name = 'NotImplementedError';
  }
}

/**
 * PDF preflight is handled in its own module/task (pdf.js, detection-only).
 * Kept as a typed seam here for callers that import from the calculations barrel.
 */
export function runPreflight(settings: PreflightSettings): never {
  void settings;
  throw new NotImplementedError('runPreflight');
}
