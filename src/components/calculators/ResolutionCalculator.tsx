'use client';

import { useMemo, useState } from 'react';
import { calculateResolution } from '@/lib/calculations';
import type { Dictionary } from '@/i18n/dictionaries';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { CalculatorShell } from './CalculatorShell';

function toNum(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function round(n: number, digits = 1): string {
  const factor = 10 ** digits;
  return (Math.round(n * factor) / factor).toFixed(digits);
}

export function ResolutionCalculator({
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
    <div className="rounded-lg border border-hairline bg-elevated p-6 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
      <div className="mb-4 font-mono text-[11px] uppercase tracking-wider text-faint">
        {dict.calc.result}
      </div>
      {result ? (
        <>
          <div className="mb-1.5 text-[13px] text-mute">{t.sizeLabel}</div>
          <div className="text-4xl font-semibold tracking-tight tabular-nums text-ink">
            {round(result.width)} × {round(result.height)} {result.unit}
          </div>
          {level && (
            <div className="mt-3">
              <Badge tone={level.tone}>{level.text}</Badge>
            </div>
          )}
          <div className="mt-5 flex items-center justify-between border-t border-hairline pt-3 text-sm">
            <span className="text-body">{t.megapixelsLabel}</span>
            <span className="font-medium tabular-nums text-ink">{round(result.megapixels)} MP</span>
          </div>
        </>
      ) : (
        <div className="text-sm text-mute">—</div>
      )}
    </div>
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
