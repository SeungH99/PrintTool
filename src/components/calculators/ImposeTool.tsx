'use client';

import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { imposePdf } from '@/lib/impose/impose';
import { imposeLayout } from '@/lib/impose/layout';
import { MM_TO_PT } from '@/lib/convert/page-geometry';
import type { CalculatorProps } from './types';
import { CalculatorHeader } from './CalculatorHeader';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { Badge } from '@/components/ui/Badge';
import { Dropzone } from './Dropzone';
import { NupGrid } from './NupGrid';
import { buttonClass } from '@/components/ui/buttonClass';
import { round, toNum } from './number';
import { trackEvent } from '@/lib/analytics';

type Phase = 'empty' | 'selected' | 'imposing' | 'done' | 'error';

interface ImposeResultView {
  url: string;
  name: string;
  perSheet: number;
  cols: number;
  rows: number;
  rotated: boolean;
  size: number;
}

/** Common parent press sheets (mm). */
const SHEETS: Record<string, [number, number]> = {
  '4x6전지 (788×1091)': [788, 1091],
  '국전지 (636×939)': [636, 939],
  'SRA3 (320×450)': [320, 450],
  'A3 (297×420)': [297, 420],
};

function formatBytes(n: number): string {
  return n < 1024 * 1024
    ? `${Math.max(1, Math.round(n / 1024))} KB`
    : `${(n / 1048576).toFixed(1)} MB`;
}

export function ImposeTool({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.impose;
  const sheetKeys = Object.keys(SHEETS);
  const [phase, setPhase] = useState<Phase>('empty');
  const [file, setFile] = useState<File | null>(null);
  const [pieceMm, setPieceMm] = useState<{ w: number; h: number } | null>(null);
  const [sheet, setSheet] = useState(sheetKeys[0]);
  const [sheetW, setSheetW] = useState('788');
  const [sheetH, setSheetH] = useState('1091');
  const [gap, setGap] = useState('3');
  const [margin, setMargin] = useState('10');
  const [result, setResult] = useState<ImposeResultView | null>(null);
  const isCustom = sheet === 'custom';

  useEffect(() => {
    if (!result) return;
    return () => URL.revokeObjectURL(result.url);
  }, [result]);

  function onSheet(value: string) {
    setSheet(value);
    const preset = SHEETS[value];
    if (preset) {
      setSheetW(String(preset[0]));
      setSheetH(String(preset[1]));
    }
  }

  async function selectFile(f: File) {
    setFile(f);
    setResult(null);
    setPieceMm(null);
    try {
      if (f.size > 100 * 1024 * 1024) throw new Error('File too large');
      const doc = await PDFDocument.load(await f.arrayBuffer());
      if (doc.getPageCount() === 0) throw new Error('PDF has no pages');
      const { width, height } = doc.getPage(0).getSize();
      setPieceMm({ w: width / MM_TO_PT, h: height / MM_TO_PT });
      setPhase('selected');
    } catch {
      setPhase('error');
    }
  }

  function reset() {
    setResult(null);
    setFile(null);
    setPieceMm(null);
    setPhase('empty');
  }

  async function convert() {
    if (!file) return;
    setPhase('imposing');
    try {
      const out = await imposePdf(new Uint8Array(await file.arrayBuffer()), {
        sheetWmm: toNum(sheetW),
        sheetHmm: toNum(sheetH),
        gapMm: toNum(gap),
        marginMm: toNum(margin),
      });
      const base = file.name.replace(/\.[^.]+$/, '') || 'imposed';
      const url = URL.createObjectURL(new Blob([out.bytes as BlobPart], { type: 'application/pdf' }));
      setResult({
        url,
        name: `${base}-imposed.pdf`,
        perSheet: out.perSheet,
        cols: out.cols,
        rows: out.rows,
        rotated: out.rotated,
        size: out.bytes.length,
      });
      setPhase('done');
      trackEvent('tool_complete', { tool: 'impose' });
    } catch {
      setPhase('error');
    }
  }

  const sheetOptions = [
    ...sheetKeys.map((k) => ({ value: k, label: k })),
    { value: 'custom', label: t.custom },
  ];

  const numbersOk =
    toNum(sheetW) > 0 && toNum(sheetH) > 0 && toNum(gap) >= 0 && toNum(margin) >= 0;
  let layout = null;
  if (pieceMm && numbersOk) {
    try {
      layout = imposeLayout(
        { sheetWmm: toNum(sheetW), sheetHmm: toNum(sheetH), gapMm: toNum(gap), marginMm: toNum(margin) },
        pieceMm.w,
        pieceMm.h,
      );
    } catch {
      layout = null;
    }
  }

  return (
    <>
      <CalculatorHeader
        eyebrow={eyebrow}
        title={title}
        desc={desc}
        backHref={`/${locale}`}
        backLabel={dict.calc.back}
      />

      <section className="mx-auto grid max-w-page gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-5">
          {(phase === 'empty' || phase === 'error') && (
            <Dropzone
              accept="application/pdf,.pdf"
              isError={phase === 'error'}
              onFile={(f) => void selectFile(f)}
              labels={t}
            />
          )}

          {(phase === 'selected' || phase === 'imposing') && file && (
            <>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-elevated p-5">
                <div className="min-w-0">
                  <div className="mb-0.5 text-[11px] uppercase tracking-wide text-faint">
                    {t.selected}
                  </div>
                  <div className="truncate text-sm font-medium text-ink">{file.name}</div>
                  {pieceMm && (
                    <div className="mt-0.5 text-xs tabular-nums text-mute">
                      {t.pieceLabel}: {round(pieceMm.w, 1)} × {round(pieceMm.h, 1)} mm
                    </div>
                  )}
                </div>
                {phase === 'selected' && (
                  <button
                    type="button"
                    onClick={reset}
                    className="shrink-0 text-[13px] text-mute transition-colors hover:text-ink"
                  >
                    {t.change}
                  </button>
                )}
              </div>

              <div className="rounded-lg border border-hairline bg-elevated p-5">
                <div className="mb-4 font-mono text-[11px] uppercase tracking-wider text-faint">
                  {t.settingsTitle}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <SelectField
                      label={t.sheet}
                      value={sheet}
                      options={sheetOptions}
                      onChange={onSheet}
                    />
                  </div>
                  <NumberField
                    label={t.sheetW}
                    value={sheetW}
                    onChange={setSheetW}
                    suffix="mm"
                    disabled={!isCustom}
                  />
                  <NumberField
                    label={t.sheetH}
                    value={sheetH}
                    onChange={setSheetH}
                    suffix="mm"
                    disabled={!isCustom}
                  />
                  <NumberField label={t.gap} value={gap} onChange={setGap} suffix="mm" />
                  <NumberField
                    label={t.margin}
                    value={margin}
                    onChange={setMargin}
                    suffix="mm"
                    helper={t.marginHelper}
                  />
                </div>

                {layout && (
                  <div className="mt-5 border-t border-hairline pt-5">
                    {layout.perSheet > 0 ? (
                      <>
                        <NupGrid
                          cols={layout.cols}
                          rows={layout.rows}
                          aspect={toNum(sheetW) / toNum(sheetH)}
                        />
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm">
                          <span className="text-body">
                            {t.perSheetLabel}:{' '}
                            <span className="font-medium tabular-nums text-ink">
                              {layout.perSheet}
                            </span>
                          </span>
                          <span className="text-body">
                            {t.gridLabel}:{' '}
                            <span className="font-medium tabular-nums text-ink">
                              {layout.cols} × {layout.rows}
                            </span>
                          </span>
                          {layout.rotated && <Badge tone="neutral">{t.rotatedBadge}</Badge>}
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-[13px] text-[#ab570a]">{t.tooBig}</p>
                    )}
                  </div>
                )}
              </div>

              {phase === 'imposing' ? (
                <div className="flex items-center gap-3 rounded-lg border border-hairline bg-elevated p-5">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-hairline border-t-ink" />
                  <span className="text-sm font-medium text-ink">{t.imposing}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void convert()}
                  disabled={!layout || layout.perSheet === 0}
                  className={buttonClass({ variant: 'primary', shape: 'pill', full: true })}
                >
                  {t.start}
                </button>
              )}
            </>
          )}

          {phase === 'done' && result && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-elevated p-5">
                <span className="text-base font-semibold text-ink">{t.doneTitle}</span>
                <button
                  type="button"
                  onClick={reset}
                  className="text-[13px] text-mute transition-colors hover:text-ink"
                >
                  {t.reset}
                </button>
              </div>

              <div className="rounded-lg border border-hairline bg-elevated p-5">
                <div className="mb-1.5 text-[11px] uppercase tracking-wide text-faint">
                  {t.outLabel}
                </div>
                <div className="mb-4 truncate text-sm text-ink">{result.name}</div>

                <div className="mb-4 flex flex-col border-t border-hairline">
                  {[
                    { label: t.perSheetLabel, value: String(result.perSheet) },
                    { label: t.gridLabel, value: `${result.cols} × ${result.rows}` },
                    { label: t.specOutSize, value: formatBytes(result.size) },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 border-b border-hairline py-2.5 text-sm last:border-b-0"
                    >
                      <span className="text-body">{row.label}</span>
                      <span className="font-medium tabular-nums text-ink">{row.value}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={result.url}
                  download={result.name}
                  className={buttonClass({ variant: 'primary', shape: 'pill', full: true })}
                >
                  {t.download}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-hairline bg-elevated p-5">
            <div className="mb-3 text-sm font-semibold text-ink">{t.guideTitle}</div>
            <ul className="m-0 flex list-disc flex-col gap-2 pl-4 text-[13px] leading-relaxed text-body">
              {t.guide.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs leading-relaxed text-mute">{t.disclaimer}</p>
        </div>
      </section>
    </>
  );
}
