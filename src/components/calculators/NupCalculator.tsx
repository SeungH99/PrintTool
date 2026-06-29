'use client';

import { useMemo, useState } from 'react';
import { calculateNup, validateNup } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { Badge } from '@/components/ui/Badge';
import { round, toNum } from './number';

const SHEETS: Record<string, [number, number]> = {
  '4x6전지 (788×1091)': [788, 1091],
  '국전지 (636×939)': [636, 939],
  'SRA3 (320×450)': [320, 450],
  'A3 (297×420)': [297, 420],
  'A4 (210×297)': [210, 297],
};

/** Common finished-piece sizes (mm), keyed by an i18n id. */
const PIECES: Record<string, [number, number]> = {
  card: [90, 50],
  postcard: [100, 148],
  a6: [105, 148],
  a5: [148, 210],
  a4: [210, 297],
};

/** A cols×rows grid of cells scaled to the sheet aspect. */
function NupGrid({ cols, rows, aspect }: { cols: number; rows: number; aspect: number }) {
  if (cols < 1 || rows < 1) return null;
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
        className="grid gap-[2px] rounded-[2px] border border-hairline bg-canvas p-[3px]"
        style={{
          width: `${w}px`,
          height: `${h}px`,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
        aria-hidden="true"
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} className="rounded-[1px] border border-hairline bg-elevated" />
        ))}
      </div>
    </div>
  );
}

export function NupCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.nup;
  const sheetKeys = Object.keys(SHEETS);
  const [sheet, setSheet] = useState(sheetKeys[0]);
  const [sheetW, setSheetW] = useState('788');
  const [sheetH, setSheetH] = useState('1091');
  const [piece, setPiece] = useState('card');
  const [pieceW, setPieceW] = useState('90');
  const [pieceH, setPieceH] = useState('50');
  const [gap, setGap] = useState('0');
  const isCustomSheet = sheet === 'custom';
  const isCustomPiece = piece === 'custom';

  function onSheet(value: string) {
    setSheet(value);
    const preset = SHEETS[value];
    if (preset) {
      setSheetW(String(preset[0]));
      setSheetH(String(preset[1]));
    }
  }

  function onPiece(value: string) {
    setPiece(value);
    const preset = PIECES[value];
    if (preset) {
      setPieceW(String(preset[0]));
      setPieceH(String(preset[1]));
    }
  }

  const { result, errorMsg } = useMemo(() => {
    const input = {
      sheetWmm: toNum(sheetW),
      sheetHmm: toNum(sheetH),
      pieceWmm: toNum(pieceW),
      pieceHmm: toNum(pieceH),
      gapMm: toNum(gap),
    };
    const v = validateNup(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculateNup(input), errorMsg: null };
  }, [sheetW, sheetH, pieceW, pieceH, gap, dict]);

  const sheetOptions = [
    ...sheetKeys.map((k) => ({ value: k, label: k })),
    { value: 'custom', label: t.custom },
  ];
  const pieceOptions = [
    ...Object.keys(PIECES).map((k) => ({ value: k, label: t.pieces[k as keyof typeof t.pieces] })),
    { value: 'custom', label: t.custom },
  ];

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <SelectField label={t.sheet} value={sheet} options={sheetOptions} onChange={onSheet} />
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
      <div className="sm:col-span-2">
        <SelectField label={t.pieceLabel} value={piece} options={pieceOptions} onChange={onPiece} />
      </div>
      <NumberField
        label={t.pieceW}
        value={pieceW}
        onChange={setPieceW}
        suffix="mm"
        disabled={!isCustomPiece}
      />
      <NumberField
        label={t.pieceH}
        value={pieceH}
        onChange={setPieceH}
        suffix="mm"
        disabled={!isCustomPiece}
      />
      <NumberField label={t.gap} value={gap} onChange={setGap} suffix="mm" helper={t.gapHelper} />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? undefined}
      primaryLabel={t.perSheetLabel}
      primaryValue={result ? `${result.perSheet} ${t.unit}`.trim() : '—'}
      badge={result?.rotated ? <Badge>{t.rotatedBadge}</Badge> : undefined}
      diagram={
        result && result.perSheet > 0 ? (
          <NupGrid cols={result.cols} rows={result.rows} aspect={toNum(sheetW) / toNum(sheetH)} />
        ) : undefined
      }
      rows={
        result
          ? [
              { label: t.gridLabel, value: `${result.cols} × ${result.rows}` },
              { label: t.wasteLabel, value: `${round(result.wastePct)} %` },
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
