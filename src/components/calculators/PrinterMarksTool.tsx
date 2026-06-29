'use client';

import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { applyMarks } from '@/lib/marks/apply';
import { computeMarks, type MarksGeometry } from '@/lib/marks/geometry';
import { renderFirstPage } from '@/lib/preflight/thumbnail';
import { MM_TO_PT } from '@/lib/convert/page-geometry';
import type { CalculatorProps } from './types';
import { CalculatorHeader } from './CalculatorHeader';
import { NumberField } from '@/components/ui/NumberField';
import { ToggleField } from '@/components/ui/ToggleField';
import { Dropzone } from './Dropzone';
import { buttonClass } from '@/components/ui/buttonClass';
import { round, toNum } from './number';
import { trackEvent } from '@/lib/analytics';

type Phase = 'empty' | 'selected' | 'applying' | 'done' | 'error';

interface ResultView {
  url: string;
  name: string;
  size: number;
}

function formatBytes(n: number): string {
  return n < 1024 * 1024
    ? `${Math.max(1, Math.round(n / 1024))} KB`
    : `${(n / 1048576).toFixed(1)} MB`;
}

/** The page thumbnail with the live mark overlay, drawn from the same geometry the export uses. */
function MarksPreview({
  thumb,
  trimWpt,
  trimHpt,
  geometry,
}: {
  thumb: string | null;
  trimWpt: number;
  trimHpt: number;
  geometry: MarksGeometry;
}) {
  const m = geometry.marginPt;
  const vbW = trimWpt + 2 * m;
  const vbH = trimHpt + 2 * m;
  const stroke = Math.max(vbW, vbH) / 320;
  const fy = (y: number) => trimHpt - y; // PDF y-up → SVG y-down

  return (
    <div className="flex justify-center rounded-md border border-hairline bg-hairline-soft p-4">
      <svg
        viewBox={`${-m} ${-m} ${vbW} ${vbH}`}
        className="h-auto w-auto"
        style={{ maxHeight: '420px', maxWidth: '100%' }}
        role="img"
        aria-label="preview"
      >
        {thumb && (
          <image href={thumb} x={0} y={0} width={trimWpt} height={trimHpt} preserveAspectRatio="none" />
        )}
        <rect
          x={0}
          y={0}
          width={trimWpt}
          height={trimHpt}
          fill="none"
          stroke="#9ca3af"
          strokeWidth={stroke}
          strokeDasharray={`${stroke * 4} ${stroke * 4}`}
        />
        {geometry.lines.map((ln, i) => (
          <line
            key={i}
            x1={ln.x1}
            y1={fy(ln.y1)}
            x2={ln.x2}
            y2={fy(ln.y2)}
            stroke="#111827"
            strokeWidth={stroke}
          />
        ))}
        {geometry.circles.map((c, i) => (
          <circle
            key={i}
            cx={c.cx}
            cy={fy(c.cy)}
            r={c.r}
            fill="none"
            stroke="#111827"
            strokeWidth={stroke}
          />
        ))}
      </svg>
    </div>
  );
}

export function PrinterMarksTool({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.marks;
  const [phase, setPhase] = useState<Phase>('empty');
  const [file, setFile] = useState<File | null>(null);
  const [trimMm, setTrimMm] = useState<{ w: number; h: number } | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [crop, setCrop] = useState(true);
  const [registration, setRegistration] = useState(true);
  const [bleed, setBleed] = useState('3');
  const [offset, setOffset] = useState('0');
  const [length, setLength] = useState('5');
  const [weight, setWeight] = useState('0.25');
  const [result, setResult] = useState<ResultView | null>(null);

  useEffect(() => {
    if (!result) return;
    return () => URL.revokeObjectURL(result.url);
  }, [result]);

  async function selectFile(f: File) {
    setFile(f);
    setResult(null);
    setTrimMm(null);
    setThumb(null);
    try {
      if (f.size > 100 * 1024 * 1024) throw new Error('File too large');
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      if (doc.getPageCount() === 0) throw new Error('PDF has no pages');
      const trim = doc.getPage(0).getTrimBox();
      setTrimMm({ w: trim.width / MM_TO_PT, h: trim.height / MM_TO_PT });
      try {
        setThumb(await renderFirstPage(buffer, 480));
      } catch {
        setThumb(null);
      }
      setPhase('selected');
    } catch {
      setPhase('error');
    }
  }

  function reset() {
    setResult(null);
    setFile(null);
    setTrimMm(null);
    setThumb(null);
    setPhase('empty');
  }

  async function apply() {
    if (!file) return;
    setPhase('applying');
    try {
      const out = await applyMarks(new Uint8Array(await file.arrayBuffer()), {
        bleedMm: toNum(bleed),
        offsetMm: toNum(offset),
        lengthMm: toNum(length),
        crop,
        registration,
        thicknessPt: toNum(weight),
      });
      const base = file.name.replace(/\.[^.]+$/, '') || 'marks';
      const url = URL.createObjectURL(new Blob([out as BlobPart], { type: 'application/pdf' }));
      setResult({ url, name: `${base}-marks.pdf`, size: out.length });
      setPhase('done');
      trackEvent('tool_complete', { tool: 'marks' });
    } catch {
      setPhase('error');
    }
  }

  const geometry =
    trimMm && (crop || registration)
      ? computeMarks(trimMm.w * MM_TO_PT, trimMm.h * MM_TO_PT, {
          bleedMm: toNum(bleed),
          offsetMm: toNum(offset),
          lengthMm: toNum(length),
          crop,
          registration,
        })
      : null;

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

          {(phase === 'selected' || phase === 'applying') && file && (
            <>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-elevated p-5">
                <div className="min-w-0">
                  <div className="mb-0.5 text-[11px] uppercase tracking-wide text-faint">
                    {t.selected}
                  </div>
                  <div className="truncate text-sm font-medium text-ink">{file.name}</div>
                  {trimMm && (
                    <div className="mt-0.5 text-xs tabular-nums text-mute">
                      {t.trimLabel}: {round(trimMm.w, 1)} × {round(trimMm.h, 1)} mm
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

              {geometry && trimMm && (
                <div className="rounded-lg border border-hairline bg-elevated p-5">
                  <div className="mb-4 font-mono text-[11px] uppercase tracking-wider text-faint">
                    {t.previewTitle}
                  </div>
                  <MarksPreview
                    thumb={thumb}
                    trimWpt={trimMm.w * MM_TO_PT}
                    trimHpt={trimMm.h * MM_TO_PT}
                    geometry={geometry}
                  />
                </div>
              )}

              <div className="rounded-lg border border-hairline bg-elevated p-5">
                <div className="mb-4 font-mono text-[11px] uppercase tracking-wider text-faint">
                  {t.settingsTitle}
                </div>
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <ToggleField label={t.crop} checked={crop} onChange={setCrop} />
                  <ToggleField label={t.registration} checked={registration} onChange={setRegistration} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberField label={t.bleed} value={bleed} onChange={setBleed} suffix="mm" />
                  <NumberField label={t.offset} value={offset} onChange={setOffset} suffix="mm" />
                  <NumberField label={t.length} value={length} onChange={setLength} suffix="mm" />
                  <NumberField label={t.weight} value={weight} onChange={setWeight} suffix="pt" />
                </div>
              </div>

              {phase === 'applying' ? (
                <div className="flex items-center gap-3 rounded-lg border border-hairline bg-elevated p-5">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-hairline border-t-ink" />
                  <span className="text-sm font-medium text-ink">{t.applying}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void apply()}
                  disabled={!crop && !registration}
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
                <div className="mb-4 flex items-center justify-between gap-4 border-y border-hairline py-2.5 text-sm">
                  <span className="text-body">{t.specOutSize}</span>
                  <span className="font-medium tabular-nums text-ink">{formatBytes(result.size)}</span>
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
