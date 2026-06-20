'use client';

import { useMemo, useState } from 'react';
import { calculatePaperWeight } from '@/lib/calculations';
import type { Dictionary } from '@/i18n/dictionaries';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
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

export function PaperWeightCalculator({
  dict,
  locale,
  eyebrow,
  title,
  desc,
}: {
  dict: Dictionary;
  locale: string;
  eyebrow: string;
  title: string;
  desc: string;
}) {
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

  const result = useMemo(
    () =>
      calculatePaperWeight({
        widthMm: toNum(width),
        heightMm: toNum(height),
        gsm: toNum(gsm),
        sheets: toNum(sheets),
      }),
    [width, height, gsm, sheets],
  );

  const sizeOptions = [
    ...Object.keys(SIZES).map((k) => ({ value: k, label: k })),
    { value: 'custom', label: t.sizeCustom },
  ];

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SelectField label={t.size} value={size} options={sizeOptions} onChange={onSize} />
      <NumberField label={t.width} value={width} onChange={setWidth} suffix="mm" disabled={!isCustom} />
      <NumberField label={t.height} value={height} onChange={setHeight} suffix="mm" disabled={!isCustom} />
      <NumberField label={t.gsm} value={gsm} onChange={setGsm} suffix="g/m²" />
      <NumberField label={t.sheets} value={sheets} onChange={setSheets} suffix={locale === 'ko' ? '매' : 'sheets'} />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      primaryLabel={t.totalLabel}
      primaryValue={`${round(result.totalKg, 2)} kg`}
      rows={[
        { label: t.perSheetLabel, value: `${round(result.perSheetG, 2)} g` },
        { label: t.packageLabel, value: `${round(result.packageKg, 2)} kg` },
      ]}
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
