'use client';

import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { imageToPdf, type Orientation, type PageSizeId } from '@/lib/convert/imageToPdf';
import { resizePdf } from '@/lib/convert/resizePdf';
import type { CalculatorProps } from './types';
import { CalculatorHeader } from './CalculatorHeader';
import { SelectField } from '@/components/ui/SelectField';
import { buttonClass } from '@/components/ui/buttonClass';

type Phase = 'empty' | 'selected' | 'converting' | 'done' | 'error';

interface Result {
  url: string;
  name: string;
  pages: number;
  input: string;
}

const isPdf = (f: File) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
const isWebp = (f: File) => f.type === 'image/webp' || /\.webp$/i.test(f.name);

/** Decode a WebP image to PNG bytes via canvas (pdf-lib embeds PNG/JPEG only). */
async function webpToPng(source: Blob): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(source);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

function inputLabel(f: File): string {
  if (isPdf(f)) return 'PDF';
  if (isWebp(f)) return 'WebP';
  return f.type === 'image/png' ? 'PNG' : 'JPEG';
}

export function ConvertTool({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.convert;
  const [phase, setPhase] = useState<Phase>('empty');
  const [file, setFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState<PageSizeId>('a4');
  const [orientation, setOrientation] = useState<Orientation>('auto');
  const [result, setResult] = useState<Result | null>(null);

  // Revoke the object URL when the result is replaced or the component unmounts.
  useEffect(() => {
    if (!result) return;
    return () => URL.revokeObjectURL(result.url);
  }, [result]);

  function selectFile(f: File) {
    setFile(f);
    // 'fit' only applies to images — a PDF resize needs a concrete page size.
    if (isPdf(f) && pageSize === 'fit') setPageSize('a4');
    setPhase('selected');
  }

  function reset() {
    setResult(null);
    setFile(null);
    setPhase('empty');
  }

  async function convert() {
    if (!file) return;
    setPhase('converting');
    try {
      let out: Uint8Array;
      let pages: number;

      if (isPdf(file)) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const target = pageSize === 'fit' ? 'a4' : pageSize;
        out = await resizePdf(bytes, { pageSize: target, orientation });
        pages = (await PDFDocument.load(bytes)).getPageCount();
      } else if (isWebp(file)) {
        out = await imageToPdf(await webpToPng(file), 'image/png', { pageSize, orientation });
        pages = 1;
      } else {
        const bytes = new Uint8Array(await file.arrayBuffer());
        out = await imageToPdf(bytes, file.type, { pageSize, orientation });
        pages = 1;
      }

      const base = file.name.replace(/\.[^.]+$/, '') || 'converted';
      // pdf-lib returns Uint8Array<ArrayBufferLike>; BlobPart wants ArrayBuffer-backed.
      const url = URL.createObjectURL(new Blob([out as BlobPart], { type: 'application/pdf' }));
      setResult({ url, name: `${base}-print.pdf`, pages, input: inputLabel(file) });
      setPhase('done');
    } catch {
      setPhase('error');
    }
  }

  const pdfSelected = !!file && isPdf(file);
  const sizeOptions = [
    { value: 'a4', label: t.sizeA4 },
    { value: 'letter', label: t.sizeLetter },
    ...(pdfSelected ? [] : [{ value: 'fit', label: t.sizeFit }]),
  ];
  const sizeShort: Record<PageSizeId, string> = { a4: 'A4', letter: 'Letter', fit: t.sizeFit };

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
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) selectFile(f);
              }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                phase === 'error' ? 'border-error bg-[#fdeaea]' : 'border-hairline bg-elevated'
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) selectFile(f);
                }}
              />
              {phase === 'error' ? (
                <>
                  <div className="text-base font-semibold text-ink">{t.errTitle}</div>
                  <div className="text-sm text-body">{t.errDesc}</div>
                </>
              ) : (
                <div className="text-base font-semibold text-ink">{t.dropTitle}</div>
              )}
              <div className="text-[13px] text-mute">{t.dropOr}</div>
              <span className="inline-flex h-9 items-center rounded-pill border border-hairline bg-elevated px-4 text-sm font-medium text-ink">
                {t.dropBtn}
              </span>
              <span className="font-mono text-[11px] text-faint">{t.dropTypes}</span>
            </label>
          )}

          {(phase === 'selected' || phase === 'converting') && file && (
            <>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-elevated p-5">
                <div className="min-w-0">
                  <div className="mb-0.5 text-[11px] uppercase tracking-wide text-faint">
                    {t.selected}
                  </div>
                  <div className="truncate text-sm font-medium text-ink">{file.name}</div>
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
                  <SelectField
                    label={t.sizeLabel}
                    value={pageSize}
                    options={sizeOptions}
                    onChange={(v) => setPageSize(v as PageSizeId)}
                  />
                  <SelectField
                    label={t.orientationLabel}
                    value={orientation}
                    options={[
                      { value: 'auto', label: t.orientAuto },
                      { value: 'portrait', label: t.orientPortrait },
                      { value: 'landscape', label: t.orientLandscape },
                    ]}
                    onChange={(v) => setOrientation(v as Orientation)}
                  />
                </div>
              </div>

              {phase === 'converting' ? (
                <div className="flex items-center gap-3 rounded-lg border border-hairline bg-elevated p-5">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-hairline border-t-ink" />
                  <span className="text-sm font-medium text-ink">{t.converting}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void convert()}
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
                <div className="mb-4 truncate font-mono text-sm text-ink">{result.name}</div>

                <div className="mb-4 flex flex-col border-t border-hairline">
                  {[
                    { label: t.specInput, value: result.input },
                    { label: t.specPages, value: String(result.pages) },
                    { label: t.specSize, value: sizeShort[pageSize] },
                    { label: t.specColor, value: 'RGB' },
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

        <aside className="flex flex-col gap-4">
          <p className="rounded-md border border-[#f6dca8] bg-warning-soft px-4 py-3 text-xs leading-relaxed text-[#ab570a]">
            {t.cmykNote}
          </p>
          <div className="rounded-lg border border-hairline bg-elevated p-5">
            <div className="mb-3 text-sm font-semibold text-ink">{t.guideTitle}</div>
            <ul className="m-0 flex list-disc flex-col gap-2 pl-4 text-[13px] leading-relaxed text-body">
              {t.guide.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs leading-relaxed text-mute">{t.disclaimer}</p>
        </aside>
      </section>
    </>
  );
}
