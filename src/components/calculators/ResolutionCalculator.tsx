'use client';

import { useMemo, useState } from 'react';
import { calculateResolution } from '@/lib/calculations';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';
import type { CalculatorProps } from './types';

export function ResolutionCalculator({
  dict,
  locale,
  eyebrow,
  title,
  desc,
}: CalculatorProps) {
  const t = dict.calc.res;
  const [widthPx, setWidthPx] = useState('3000');
  const [heightPx, setHeightPx] = useState('2400');
  const [dpi, setDpi] = useState('300');
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');

  const result = useMemo(() => {
    const d = toNum(dpi);
    if (d <= 0) return null;
    return calculateResolution({ widthPx: toNum(widthPx), heightPx: toNum(heightPx), dpi: d, unit });
  }, [widthPx, heightPx, dpi, unit]);

  const levelInfo: Record<'high' | 'ok' | 'low', { text: string; tone: BadgeTone }> = {
    high: { text: t.levelHigh, tone: 'success' },
    ok: { text: t.levelOk, tone: 'warning' },
    low: { text: t.levelLow, tone: 'error' },
  };
  const level = result ? levelInfo[result.level] : null;

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NumberField label={t.widthPx} value={widthPx} onChange={setWidthPx} suffix="px" />
      <NumberField label={t.heightPx} value={heightPx} onChange={setHeightPx} suffix="px" />
      <NumberField label={t.dpi} value={dpi} onChange={setDpi} suffix="DPI" helper={t.dpiHelper} />
      <SelectField
        label={t.unit}
        value={unit}
        options={[
          { value: 'cm', label: t.unitCm },
          { value: 'inch', label: t.unitInch },
        ]}
        onChange={(v) => setUnit(v === 'inch' ? 'inch' : 'cm')}
      />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      primaryLabel={t.sizeLabel}
      primaryValue={
        result ? `${round(result.width)} × ${round(result.height)} ${result.unit}` : '—'
      }
      badge={level ? <Badge tone={level.tone}>{level.text}</Badge> : undefined}
      rows={result ? [{ label: t.megapixelsLabel, value: `${round(result.megapixels)} MP` }] : undefined}
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
