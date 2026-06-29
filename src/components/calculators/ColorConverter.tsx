'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CalculatorProps } from './types';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { NumberField } from '@/components/ui/NumberField';
import { Badge } from '@/components/ui/Badge';
import { CopyButton } from '@/components/ui/CopyButton';
import {
  buildEngine,
  gamutClipDistance,
  hexToRgb,
  rgbToHex,
  type ColorEngine,
  type Lcms,
  type RGB,
} from '@/lib/color/cmyk';
import { round, toNum } from './number';

interface ColorT {
  gamutBadge: string;
  copy: string;
}

/** Enlarged swatch + copyable HEX/RGB/CMYK values, with an out-of-gamut badge. */
function ColorResult({
  rgb,
  hex,
  cmyk,
  outOfGamut,
  t,
}: {
  rgb: RGB;
  hex: string;
  cmyk: string;
  outOfGamut: boolean;
  t: ColorT;
}) {
  const rows = [
    { key: 'HEX', value: hex },
    { key: 'RGB', value: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}` },
    { key: 'CMYK', value: cmyk },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative h-32 w-full rounded-md border border-hairline"
        style={{ backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` }}
      >
        {outOfGamut && (
          <span className="absolute right-2 top-2">
            <Badge tone="warning">{t.gamutBadge}</Badge>
          </span>
        )}
      </div>
      <div className="flex flex-col">
        {rows.map((r) => (
          <div
            key={r.key}
            className="flex items-center gap-3 border-t border-hairline py-2.5 first:border-t-0"
          >
            <span className="w-12 flex-none text-[13px] text-mute">{r.key}</span>
            <span className="flex-1 truncate text-right font-mono text-sm tabular-nums text-ink">
              {r.value}
            </span>
            <CopyButton value={r.value} label={`${r.key} ${t.copy}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

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
  // True when a typed hex falls outside the CMYK profile gamut (round-trip clips it).
  const [outOfGamut, setOutOfGamut] = useState(false);

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

  // Editing the CMYK channels directly makes ink the source of truth — always in gamut.
  function onCmyk(set: (v: string) => void) {
    return (v: string) => {
      set(v);
      setOutOfGamut(false);
    };
  }

  function applyHex(v: string) {
    setHexEdit(v);
    const parsed = hexToRgb(v);
    if (parsed && engine) {
      const cmyk = engine.rgbToCmyk(parsed[0], parsed[1], parsed[2]);
      setC(String(cmyk[0]));
      setM(String(cmyk[1]));
      setY(String(cmyk[2]));
      setK(String(cmyk[3]));
      // A large round-trip shift means the screen colour was clipped to the print gamut.
      setOutOfGamut(gamutClipDistance(engine, parsed) > 20);
    }
  }

  const inputs = (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <NumberField label="C" value={c} onChange={onCmyk(setC)} suffix="%" />
        <NumberField label="M" value={m} onChange={onCmyk(setM)} suffix="%" />
        <NumberField label="Y" value={y} onChange={onCmyk(setY)} suffix="%" />
        <NumberField label="K" value={k} onChange={onCmyk(setK)} suffix="%" />
      </div>
      <HexField
        label={t.hex}
        value={hexEdit ?? (status === 'ready' ? hexOut : '')}
        onChange={applyHex}
        onBlur={() => setHexEdit(null)}
      />
    </div>
  );

  const cmykStr = `${round(toNum(c), 0)}, ${round(toNum(m), 0)}, ${round(toNum(y), 0)}, ${round(toNum(k), 0)}`;

  let alertMsg: string | undefined;
  if (status === 'error') alertMsg = t.errorLoad;
  else if (status === 'ready' && outOfGamut) alertMsg = t.gamutWarn;

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={alertMsg}
      primaryValue={status === 'loading' ? t.loading : undefined}
      diagram={
        status === 'ready' && rgb ? (
          <ColorResult rgb={rgb} hex={hexOut} cmyk={cmykStr} outOfGamut={outOfGamut} t={t} />
        ) : undefined
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
