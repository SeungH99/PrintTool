'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CalculatorProps } from './types';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { NumberField } from '@/components/ui/NumberField';
import { buildEngine, hexToRgb, rgbToHex, type ColorEngine, type Lcms } from '@/lib/color/cmyk';
import { round, toNum } from './number';

type LcmsModule = {
  instantiate: (opts?: { locateFile?: (f: string) => string }) => Promise<unknown>;
  INTENT_RELATIVE_COLORIMETRIC: number;
  cmsFLAGS_NOCACHE: number;
  cmsFLAGS_HIGHRESPRECALC: number;
  cmsFLAGS_NOOPTIMIZE: number;
  cmsFLAGS_BLACKPOINTCOMPENSATION: number;
  cmsInfoDescription: number;
};

function HexField({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-[13px] font-medium text-ink">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^#0-9a-fA-F]/g, '').slice(0, 7))}
        onBlur={onBlur}
        placeholder="#1a73e8"
        aria-label={label}
        className="h-10 w-full rounded-sm border border-hairline bg-elevated px-3 font-mono text-sm uppercase text-ink outline-none transition focus:border-link focus:ring-2 focus:ring-link/20"
      />
    </div>
  );
}

export function ColorConverter({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.color;
  const [engine, setEngine] = useState<ColorEngine | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [profileName, setProfileName] = useState('');
  const [c, setC] = useState('100');
  const [m, setM] = useState('50');
  const [y, setY] = useState('25');
  const [k, setK] = useState('25');
  // null = not editing → field mirrors the CMYK-derived hex; string = user's in-progress edit.
  const [hexEdit, setHexEdit] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Self-hosted Little-CMS (public/lcms/*). webpackIgnore keeps the Emscripten
        // glue out of the bundle so it loads its own .wasm at runtime via import.meta.url.
        const src = '/lcms/lcms.js';
        const mod = (await import(/* webpackIgnore: true */ src)) as LcmsModule;
        const lcms = (await mod.instantiate({
          locateFile: (f) => `/lcms/${f}`,
        })) as unknown as Lcms;
        const res = await fetch('/profiles/default_cmyk.icc');
        if (!res.ok) throw new Error('profile fetch failed');
        const bytes = new Uint8Array(await res.arrayBuffer());
        const eng = buildEngine(
          lcms,
          {
            INTENT_RELATIVE_COLORIMETRIC: mod.INTENT_RELATIVE_COLORIMETRIC,
            cmsFLAGS_NOCACHE: mod.cmsFLAGS_NOCACHE,
            cmsFLAGS_HIGHRESPRECALC: mod.cmsFLAGS_HIGHRESPRECALC,
            cmsFLAGS_NOOPTIMIZE: mod.cmsFLAGS_NOOPTIMIZE,
            cmsFLAGS_BLACKPOINTCOMPENSATION: mod.cmsFLAGS_BLACKPOINTCOMPENSATION,
            cmsInfoDescription: mod.cmsInfoDescription,
          },
          bytes,
        );
        if (alive) {
          setEngine(eng);
          setProfileName(eng.profileName);
          setStatus('ready');
        }
      } catch {
        if (alive) setStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const rgb = useMemo(
    () => (engine ? engine.cmykToRgb(toNum(c), toNum(m), toNum(y), toNum(k)) : null),
    [engine, c, m, y, k],
  );
  const hexOut = rgb ? rgbToHex(rgb[0], rgb[1], rgb[2]) : '—';

  function applyHex(v: string) {
    setHexEdit(v);
    const parsed = hexToRgb(v);
    if (parsed && engine) {
      const cmyk = engine.rgbToCmyk(parsed[0], parsed[1], parsed[2]);
      setC(String(cmyk[0]));
      setM(String(cmyk[1]));
      setY(String(cmyk[2]));
      setK(String(cmyk[3]));
    }
  }

  const inputs = (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <NumberField label="C" value={c} onChange={setC} suffix="%" />
        <NumberField label="M" value={m} onChange={setM} suffix="%" />
        <NumberField label="Y" value={y} onChange={setY} suffix="%" />
        <NumberField label="K" value={k} onChange={setK} suffix="%" />
      </div>
      <HexField
        label={t.hex}
        value={hexEdit ?? (status === 'ready' ? hexOut : '')}
        onChange={applyHex}
        onBlur={() => setHexEdit(null)}
      />
    </div>
  );

  const swatch = (
    <div
      className="h-24 w-full rounded-md border border-hairline"
      style={{ backgroundColor: rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : 'transparent' }}
      aria-hidden="true"
    />
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={status === 'error' ? t.errorLoad : undefined}
      primaryLabel={t.hexLabel}
      primaryValue={status === 'ready' ? hexOut : status === 'loading' ? t.loading : '—'}
      diagram={status === 'ready' ? swatch : undefined}
      rows={
        status === 'ready' && rgb
          ? [
              { label: t.rgbLabel, value: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}` },
              {
                label: t.cmykLabel,
                value: `${round(toNum(c), 0)}, ${round(toNum(m), 0)}, ${round(toNum(y), 0)}, ${round(toNum(k), 0)}`,
              },
            ]
          : undefined
      }
      note={status === 'ready' && profileName ? `${t.note} (${profileName})` : t.note}
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
