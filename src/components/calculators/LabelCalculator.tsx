'use client';

import { useMemo, useState } from 'react';
import { calculateLabel, validateLabel } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { ToggleField } from '@/components/ui/ToggleField';
import { Badge } from '@/components/ui/Badge';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

/** Common label-sheet sizes (mm). */
const SHEETS: Record<string, [number, number]> = {
  A4: [210, 297],
  A3: [297, 420],
  Letter: [215.9, 279.4],
};

export function LabelCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.label;
  const [sheet, setSheet] = useState('A4');
  const [sheetW, setSheetW] = useState('210');
  const [sheetH, setSheetH] = useState('297');
  const [labelW, setLabelW] = useState('63.5');
  const [labelH, setLabelH] = useState('38.1');
  const [margin, setMargin] = useState('7');
  const [gap, setGap] = useState('2.5');
  const [rotate, setRotate] = useState(false);
  const isCustomSheet = sheet === 'custom';

  function onSheet(value: string) {
    setSheet(value);
    const preset = SHEETS[value];
    if (preset) {
      setSheetW(String(preset[0]));
      setSheetH(String(preset[1]));
    }
  }

  const { result, errorMsg } = useMemo(() => {
    const input = {
      sheetWmm: toNum(sheetW),
      sheetHmm: toNum(sheetH),
      labelWmm: toNum(labelW),
      labelHmm: toNum(labelH),
      marginMm: toNum(margin),
      gapMm: toNum(gap),
      rotate,
    };
    const v = validateLabel(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculateLabel(input), errorMsg: null };
  }, [sheetW, sheetH, labelW, labelH, margin, gap, rotate, dict]);

  const sheetOptions = [
    ...Object.keys(SHEETS).map((k) => ({ value: k, label: k })),
    { value: 'custom', label: t.sheetCustom },
  ];

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <SelectField label={t.sheetSize} value={sheet} options={sheetOptions} onChange={onSheet} />
      </div>
      <NumberField
        label={t.sheetW}
        value={sheetW}
        onChange={setSheetW}
        suffix="mm"
        disabled={!isCustomSheet}
      />
      <NumberField
        label={t.sheetH}
        value={sheetH}
        onChange={setSheetH}
        suffix="mm"
        disabled={!isCustomSheet}
      />
      <NumberField label={t.labelW} value={labelW} onChange={setLabelW} suffix="mm" />
      <NumberField label={t.labelH} value={labelH} onChange={setLabelH} suffix="mm" />
      <NumberField label={t.margin} value={margin} onChange={setMargin} suffix="mm" />
      <NumberField label={t.gap} value={gap} onChange={setGap} suffix="mm" />
      <ToggleField label={t.rotate} checked={rotate} onChange={setRotate} helper={t.rotateHelper} />
    </div>
  );

  const ar = result?.rotated
    ? toNum(labelH) / Math.max(0.01, toNum(labelW))
    : toNum(labelW) / Math.max(0.01, toNum(labelH));
  const capCols = result ? Math.min(result.cols, 14) : 0;
  const capRows = result ? Math.min(result.rows, 12) : 0;
  const cellCount = Math.max(0, capCols * capRows);
  const diagram =
    cellCount > 0 ? (
      <div className="rounded-md border border-hairline bg-hairline-soft p-3">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.max(1, capCols)}, 1fr)`,
            gap: '4px',
          }}
        >
          {Array.from({ length: cellCount }).map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: String(ar > 0 ? ar : 1),
                background: 'var(--color-link-soft)',
                border: '1px solid #bcd8ff',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      </div>
    ) : undefined;

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? undefined}
      primaryLabel={t.totalLabel}
      primaryValue={result ? (t.unit ? `${result.total} ${t.unit}` : String(result.total)) : '—'}
      badge={result?.rotated ? <Badge tone="neutral">{t.rotatedBadge}</Badge> : undefined}
      diagram={diagram}
      rows={
        result
          ? [
              { label: t.gridLabel, value: `${result.rows} × ${result.cols}` },
              {
                label: t.remainderLabel,
                value: `${round(result.remainderWmm, 1)} × ${round(result.remainderHmm, 1)} mm`,
              },
            ]
          : undefined
      }
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
