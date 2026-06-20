'use client';

import { useMemo, useState } from 'react';
import { calculateLabel } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { ToggleField } from '@/components/ui/ToggleField';
import { Badge } from '@/components/ui/Badge';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

export function LabelCalculator({
  dict,
  locale,
  eyebrow,
  title,
  desc,
}: CalculatorProps) {
  const t = dict.calc.label;
  const [sheetW, setSheetW] = useState('210');
  const [sheetH, setSheetH] = useState('297');
  const [labelW, setLabelW] = useState('63.5');
  const [labelH, setLabelH] = useState('38.1');
  const [margin, setMargin] = useState('7');
  const [gap, setGap] = useState('2.5');
  const [rotate, setRotate] = useState(false);

  const result = useMemo(
    () =>
      calculateLabel({
        sheetWmm: toNum(sheetW),
        sheetHmm: toNum(sheetH),
        labelWmm: toNum(labelW),
        labelHmm: toNum(labelH),
        marginMm: toNum(margin),
        gapMm: toNum(gap),
        rotate,
      }),
    [sheetW, sheetH, labelW, labelH, margin, gap, rotate],
  );

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NumberField label={t.sheetW} value={sheetW} onChange={setSheetW} suffix="mm" />
      <NumberField label={t.sheetH} value={sheetH} onChange={setSheetH} suffix="mm" />
      <NumberField label={t.labelW} value={labelW} onChange={setLabelW} suffix="mm" />
      <NumberField label={t.labelH} value={labelH} onChange={setLabelH} suffix="mm" />
      <NumberField label={t.margin} value={margin} onChange={setMargin} suffix="mm" />
      <NumberField label={t.gap} value={gap} onChange={setGap} suffix="mm" />
      <ToggleField label={t.rotate} checked={rotate} onChange={setRotate} helper={t.rotateHelper} />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      primaryLabel={t.totalLabel}
      primaryValue={t.unit ? `${result.total} ${t.unit}` : String(result.total)}
      badge={result.rotated ? <Badge tone="neutral">{t.rotatedBadge}</Badge> : undefined}
      rows={[
        { label: t.gridLabel, value: `${result.rows} × ${result.cols}` },
        {
          label: t.remainderLabel,
          value: `${round(result.remainderWmm, 1)} × ${round(result.remainderHmm, 1)} mm`,
        },
      ]}
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
