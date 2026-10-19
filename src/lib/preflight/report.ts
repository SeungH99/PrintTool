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
  /** Minimum acceptable image DPI (default 300). */
  minDpi?: number;
}

/**
 * Maps a structural PDF analysis into the 6-item preflight report. `pageSize` is
 * detected; `trim`/`bleed` report box presence, not artwork coverage. Image DPI,
 * image color classification and font embedding use best-effort detected values;
 * unavailable values remain `unknown` and require manual review.
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

  const fontsStatus: PreflightStatus =
    analysis.fontsEmbedded === 'all'
      ? 'pass'
      : analysis.fontsEmbedded === 'unknown'
        ? 'unknown'
        : 'warn';

  const resolutionStatus: PreflightStatus =
    analysis.minImageDpi === null
      ? 'unknown'
      : analysis.minImageDpi >= (options.minDpi ?? 300)
        ? 'pass'
        : 'warn';

  const colorStatus: PreflightStatus =
    analysis.colorMode === 'cmyk' ? 'pass' : analysis.colorMode === 'rgb' ? 'warn' : 'unknown';

  const items: PreflightItem[] = [
    { key: 'pageSize', status: 'pass' },
    { key: 'trim', status: trimStatus },
    { key: 'bleed', status: bleedStatus },
    { key: 'resolution', status: resolutionStatus },
    { key: 'color', status: colorStatus },
    { key: 'fonts', status: fontsStatus },
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
