'use client';

import { useMemo, useState } from 'react';
import { calculatePaperWeight, validatePaperWeight } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { CopyButton } from '@/components/ui/CopyButton';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

const SIZES: Record<string, [number, number]> = {
  A4: [210, 297],
  A3: [297, 420],
  B4: [257, 364],
  B5: [182, 257],
  Letter: [215.9, 279.4],
};

/** Edge-on stack of sheets; the stack grows (capped) with the sheet count. */
function PaperStack({ sheets }: { sheets: number }) {
  const layers = Math.min(Math.max(Math.round(sheets / 40), 4), 20);
  return (
    <div className="flex h-[140px] items-center justify-center">
      <div className="flex flex-col-reverse gap-[2px]" aria-hidden="true">
        {Array.from({ length: layers }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-[1px] border border-hairline bg-elevated"
            style={{ width: `${150 - (i % 2) * 6}px` }}
          />
        ))}
      </div>
    </div>
  );
}

export function PaperWeightCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.weight;
  const [size, setSize] = useState('A4');
  const [width, setWidth] = useState('210');
  const [height, setHeight] = useState('297');
  const [gsm, setGsm] = useState('100');
  const [sheets, setSheets] = useState('500');

  const isCustom = size === 'custom';

  function onSize(value: string) {
    setSize(value);
    const preset = SIZES[value];
    if (preset) {
      setWidth(String(preset[0]));
      setHeight(String(preset[1]));
    }
  }

  const { result, errorMsg } = useMemo(() => {
    const input = {
      widthMm: toNum(width),
      heightMm: toNum(height),
      gsm: toNum(gsm),
      sheets: toNum(sheets),
    };
    const v = validatePaperWeight(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculatePaperWeight(input), errorMsg: null };
  }, [width, height, gsm, sheets, dict]);

  const sizeOptions = [
    ...Object.keys(SIZES).map((k) => ({ value: k, label: k })),
    { value: 'custom', label: t.sizeCustom },
  ];

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SelectField label={t.size} value={size} options={sizeOptions} onChange={onSize} />
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
      <NumberField label={t.gsm} value={gsm} onChange={setGsm} suffix="g/m²" />
      <NumberField
        label={t.sheets}
        value={sheets}
        onChange={setSheets}
        suffix={locale === 'ko' ? '매' : 'sheets'}
      />
    </div>
  );

  const totalValue = result ? `${round(result.totalKg, 2)} kg` : '—';
  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? undefined}
      primaryLabel={t.totalLabel}
      primaryValue={totalValue}
      primaryAction={
        result ? (
          <CopyButton value={totalValue} label={`${t.totalLabel} ${dict.calc.copy}`} />
        ) : undefined
      }
      diagram={result ? <PaperStack sheets={toNum(sheets)} /> : undefined}
      rows={
        result
          ? [
              { label: t.areaLabel, value: `${round(result.areaM2, 4)} m²` },
              { label: t.perSheetLabel, value: `${round(result.perSheetG, 2)} g` },
              { label: t.packageLabel, value: `${round(result.packageKg, 2)} kg` },
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
