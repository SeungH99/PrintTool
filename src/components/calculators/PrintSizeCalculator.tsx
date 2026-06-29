'use client';

import { useMemo, useState } from 'react';
import { calculatePrintSize, validatePrintSize } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

const FORMATS: Record<string, [number, number]> = {
  A3: [297, 420],
  A4: [210, 297],
  A5: [148, 210],
  A6: [105, 148],
  B4: [257, 364],
  B5: [182, 257],
  Letter: [215.9, 279.4],
  Legal: [215.9, 355.6],
  Tabloid: [279.4, 431.8],
  'Business card': [90, 50],
  Postcard: [100, 148],
};

/** A paper-shaped box at the chosen aspect ratio, labelled with the pixel size. */
function SizePreview({ aspect, label }: { aspect: number; label: string }) {
  const maxW = 248;
  const maxH = 168;
  let w = maxW;
  let h = maxW / aspect;
  if (h > maxH) {
    h = maxH;
    w = maxH * aspect;
  }
  return (
    <div className="flex h-[176px] w-full items-center justify-center">
      <div
        className="flex items-center justify-center rounded-[2px] border border-hairline bg-canvas"
        style={{ width: `${w}px`, height: `${h}px` }}
        aria-hidden="true"
      >
        <span className="font-mono text-[11px] text-faint">{label}</span>
      </div>
    </div>
  );
}

export function PrintSizeCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.size;
  const [format, setFormat] = useState('A4');
  const [width, setWidth] = useState('210');
  const [height, setHeight] = useState('297');
  const [dpi, setDpi] = useState('300');
  const isCustom = format === 'custom';

  function onFormat(value: string) {
    setFormat(value);
    const preset = FORMATS[value];
    if (preset) {
      setWidth(String(preset[0]));
      setHeight(String(preset[1]));
    }
  }

  const { result, errorMsg } = useMemo(() => {
    const input = { widthMm: toNum(width), heightMm: toNum(height), dpi: toNum(dpi) };
    const v = validatePrintSize(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculatePrintSize(input), errorMsg: null };
  }, [width, height, dpi, dict]);

  const formatOptions = [
    ...Object.keys(FORMATS).map((k) => ({ value: k, label: k })),
    { value: 'custom', label: t.custom },
  ];

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SelectField label={t.format} value={format} options={formatOptions} onChange={onFormat} />
      <NumberField label={t.dpi} value={dpi} onChange={setDpi} suffix="DPI" helper={t.dpiHelper} />
      <NumberField
        label={t.width}
        value={width}
        onChange={setWidth}
        suffix="mm"
        disabled={!isCustom}
      />
      <NumberField
        label={t.height}
        value={height}
        onChange={setHeight}
        suffix="mm"
        disabled={!isCustom}
      />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? undefined}
      primaryLabel={t.pxLabel}
      primaryValue={result ? `${result.widthPx} × ${result.heightPx} px` : '—'}
      diagram={
        result ? (
          <SizePreview
            aspect={result.widthCm / result.heightCm}
            label={`${result.widthPx}×${result.heightPx}`}
          />
        ) : undefined
      }
      rows={
        result
          ? [
              {
                label: t.mmLabel,
                value: `${round(result.widthCm * 10)} × ${round(result.heightCm * 10)} mm`,
              },
              {
                label: t.cmLabel,
                value: `${round(result.widthCm)} × ${round(result.heightCm)} cm`,
              },
              {
                label: t.inLabel,
                value: `${round(result.widthIn, 2)} × ${round(result.heightIn, 2)} in`,
              },
            ]
          : undefined
      }
      note={t.note}
    />
  );

  return (
    <CalculatorShell
      eyebrow={eyebrow}
      title={title}
      desc={desc}
      backHref={`/${locale}`}
      backLabel={dict.calc.back}
      inputsLabel={dict.calc.inputs}
      inputs={inputs}
      results={results}
      guideTitle={dict.calc.guideTitle}
      guide={t.guide}
    />
  );
}
