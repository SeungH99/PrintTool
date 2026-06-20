import { describe, it, expect } from 'vitest';
import { buildPreflightReport } from '@/lib/preflight/report';
import type { PdfAnalysis } from '@/lib/preflight/analyze';

const base: PdfAnalysis = {
  pageCount: 1,
  pageWidthMm: 210,
  pageHeightMm: 297,
  hasTrimBox: false,
  hasBleedBox: false,
  fontsEmbedded: 'unknown',
  minImageDpi: null,
  colorMode: 'none',
};

const byKey = (r: ReturnType<typeof buildPreflightReport>) =>
  Object.fromEntries(r.items.map((i) => [i.key, i.status]));

describe('buildPreflightReport', () => {
  it('passes page size, flags missing trim/bleed, marks undetectable items unknown', () => {
    const r = buildPreflightReport(base);
    const k = byKey(r);
    expect(k.pageSize).toBe('pass');
    expect(k.trim).toBe('warn');
    expect(k.bleed).toBe('warn');
    expect(k.resolution).toBe('unknown');
    expect(k.color).toBe('unknown');
    expect(k.fonts).toBe('unknown');
    expect(r.unknown).toBe(3);
    expect(r.overall).toBe('warn');
  });

  it('passes trim and bleed when the boxes are present', () => {
    const r = buildPreflightReport({ ...base, hasTrimBox: true, hasBleedBox: true });
    const k = byKey(r);
    expect(k.trim).toBe('pass');
    expect(k.bleed).toBe('pass');
    expect(r.overall).toBe('ok');
  });

  it('maps font embedding (all -> pass, none -> warn)', () => {
    expect(byKey(buildPreflightReport({ ...base, fontsEmbedded: 'all' })).fonts).toBe('pass');
    expect(byKey(buildPreflightReport({ ...base, fontsEmbedded: 'none' })).fonts).toBe('warn');
  });

  it('maps image DPI against the minimum (default 300)', () => {
    expect(byKey(buildPreflightReport({ ...base, minImageDpi: 400 })).resolution).toBe('pass');
    expect(byKey(buildPreflightReport({ ...base, minImageDpi: 200 })).resolution).toBe('warn');
    expect(byKey(buildPreflightReport({ ...base, minImageDpi: null })).resolution).toBe('unknown');
  });

  it('maps color mode (cmyk -> pass, rgb -> warn, none -> unknown)', () => {
    expect(byKey(buildPreflightReport({ ...base, colorMode: 'cmyk' })).color).toBe('pass');
    expect(byKey(buildPreflightReport({ ...base, colorMode: 'rgb' })).color).toBe('warn');
    expect(byKey(buildPreflightReport({ ...base, colorMode: 'none' })).color).toBe('unknown');
  });
});
