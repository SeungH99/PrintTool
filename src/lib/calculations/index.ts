import type {
  ResolutionInput,
  SpineInput,
  PaperWeightInput,
  PreflightSettings,
} from './types';

export * from './types';

export class NotImplementedError extends Error {
  constructor(what: string) {
    super(`${what} is not implemented yet (MVP-001 scaffold). See ADR-0002.`);
    this.name = 'NotImplementedError';
  }
}

/**
 * The four MVP calculation seams (resolution, spine, paper weight, PDF preflight).
 * Signatures only — real formulas + unit tests land in follow-up tasks. Magic
 * constants from the design prototype must be source-verified before use (ADR-0002).
 */
export function calculateResolution(input: ResolutionInput): never {
  void input;
  throw new NotImplementedError('calculateResolution');
}

export function calculateSpine(input: SpineInput): never {
  void input;
  throw new NotImplementedError('calculateSpine');
}

export function calculatePaperWeight(input: PaperWeightInput): never {
  void input;
  throw new NotImplementedError('calculatePaperWeight');
}

export function runPreflight(settings: PreflightSettings): never {
  void settings;
  throw new NotImplementedError('runPreflight');
}

// fold / label: UI is in scope, calculation is deferred entirely (ADR-0002 — 6 UI / 4 logic).
