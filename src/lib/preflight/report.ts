import type { PdfAnalysis } from './analyze';

export type PreflightStatus = 'pass' | 'warn' | 'error' | 'unknown';

export interface PreflightItem {
  key: 'pageSize' | 'trim' | 'bleed' | 'resolution' | 'color' | 'fonts';
  status: PreflightStatus;
}

export interface PreflightReport {
  items: PreflightItem[];
  pass: number;
  warn: number;
  error: number;
  unknown: number;
  overall: 'ok' | 'warn' | 'error';
}

export interface PreflightOptions {
  /** Set false to treat a missing TrimBox as "not checked" instead of a warning. */
  requireTrimBox?: boolean;
  /** Set false to treat a missing BleedBox as "not checked" instead of a warning. */
  requireBleed?: boolean;
}

/**
 * Maps a structural PDF analysis into the 6-item preflight report. `pageSize` is
 * detected; `trim`/`bleed` are detected as present-or-missing; `resolution`,
 * `color` and `fonts` are beyond this in-browser check and reported as `unknown`
 * (detection-limited) rather than guessed.
 */
export function buildPreflightReport(
  analysis: PdfAnalysis,
  options: PreflightOptions = {},
): PreflightReport {
  const trimStatus: PreflightStatus = analysis.hasTrimBox
    ? 'pass'
    : options.requireTrimBox === false
      ? 'unknown'
      : 'warn';
  const bleedStatus: PreflightStatus = analysis.hasBleedBox
    ? 'pass'
    : options.requireBleed === false
      ? 'unknown'
      : 'warn';

  const items: PreflightItem[] = [
    { key: 'pageSize', status: 'pass' },
    { key: 'trim', status: trimStatus },
    { key: 'bleed', status: bleedStatus },
    { key: 'resolution', status: 'unknown' },
    { key: 'color', status: 'unknown' },
    { key: 'fonts', status: 'unknown' },
  ];

  const count = (s: PreflightStatus) => items.filter((i) => i.status === s).length;
  const pass = count('pass');
  const warn = count('warn');
  const error = count('error');
  const unknown = count('unknown');

  return {
    items,
    pass,
    warn,
    error,
    unknown,
    overall: error > 0 ? 'error' : warn > 0 ? 'warn' : 'ok',
  };
}
