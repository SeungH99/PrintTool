import type { PreflightSettings } from './types';

export * from './types';
export { calculateResolution } from './resolution';
export { calculatePaperWeight } from './paperWeight';
export { calculateSpine, type SpineOptions } from './spine';

export class NotImplementedError extends Error {
  constructor(what: string) {
    super(`${what} is not implemented yet. See ADR-0002.`);
    this.name = 'NotImplementedError';
  }
}

/**
 * PDF preflight is deferred to a dedicated task (pdf.js/pdf-lib, 6-item detection).
 * Kept as a typed seam; not implemented (ADR-0002).
 */
export function runPreflight(settings: PreflightSettings): never {
  void settings;
  throw new NotImplementedError('runPreflight');
}

// fold / label: UI is in scope, calculation is deferred entirely (ADR-0002 — 6 UI / 4 logic).
