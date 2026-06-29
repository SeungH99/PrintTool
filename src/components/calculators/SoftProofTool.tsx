'use client';

import { useEffect, useRef, useState } from 'react';
import { loadLcms, engineFor, type LoadedLcms } from '@/lib/color/loadEngine';
import type { ColorEngine } from '@/lib/color/cmyk';
import type { CalculatorProps } from './types';
import { CalculatorHeader } from './CalculatorHeader';
import { ToggleField } from '@/components/ui/ToggleField';
import { Badge } from '@/components/ui/Badge';
import { Dropzone } from './Dropzone';
import { buttonClass } from '@/components/ui/buttonClass';
import { round } from './number';
import { trackEvent } from '@/lib/analytics';

type Phase = 'empty' | 'processing' | 'done' | 'error';

const MAX_PX = 1000;
const GAMUT_THRESHOLD = 20;

interface ProofResult {
  w: number;
  h: number;
  original: ImageData;
  proof: ImageData;
  mask: Uint8Array;
  outPct: number;
}

/** Round-trip every pixel through the CMYK profile and flag out-of-gamut ones. */
function proofImageData(original: ImageData, engine: ColorEngine): ProofResult {
  const { width: w, height: h, data } = original;
  const n = w * h;
  const rgb = new Uint8ClampedArray(n * 3);
  for (let i = 0; i < n; i += 1) {
    rgb[i * 3] = data[i * 4];
    rgb[i * 3 + 1] = data[i * 4 + 1];
    rgb[i * 3 + 2] = data[i * 4 + 2];
  }
  const proofed = engine.proofImage(rgb, n);

  const proof = new ImageData(w, h);
  const mask = new Uint8Array(n);
  let out = 0;
  for (let i = 0; i < n; i += 1) {
    const pr = proofed[i * 3];
    const pg = proofed[i * 3 + 1];
    const pb = proofed[i * 3 + 2];
    proof.data[i * 4] = pr;
    proof.data[i * 4 + 1] = pg;
    proof.data[i * 4 + 2] = pb;
    proof.data[i * 4 + 3] = data[i * 4 + 3];
    const dist = Math.hypot(rgb[i * 3] - pr, rgb[i * 3 + 1] - pg, rgb[i * 3 + 2] - pb);
    if (dist > GAMUT_THRESHOLD) {
      mask[i] = 1;
      out += 1;
    }
  }
  return { w, h, original, proof, mask, outPct: (out / n) * 100 };
}

/** Decode + downscale an image file to an ImageData no larger than MAX_PX on its long side. */
async function toImageData(file: File): Promise<ImageData> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_PX / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return ctx.getImageData(0, 0, w, h);
}

export function SoftProofTool({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.proof;
  const [loaded, setLoaded] = useState<LoadedLcms | null>(null);
  const [engine, setEngine] = useState<ColorEngine | null>(null);
  const [engineStatus, setEngineStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [profileName, setProfileName] = useState('');
  const [phase, setPhase] = useState<Phase>('empty');
  const [result, setResult] = useState<ProofResult | null>(null);
  const [highlight, setHighlight] = useState(false);

  const origRef = useRef<HTMLCanvasElement>(null);
  const proofRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const l = await loadLcms();
        const eng = engineFor(l);
        if (alive) {
          setLoaded(l);
          setEngine(eng);
          setProfileName(eng.profileName);
          setEngineStatus('ready');
        }
      } catch {
        if (alive) setEngineStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Paint both canvases; the proof gets a magenta wash over out-of-gamut pixels when toggled.
  useEffect(() => {
    if (!result) return;
    const oc = origRef.current;
    const pc = proofRef.current;
    if (oc) {
      oc.width = result.w;
      oc.height = result.h;
      oc.getContext('2d')!.putImageData(result.original, 0, 0);
    }
    if (pc) {
      pc.width = result.w;
      pc.height = result.h;
      const ctx = pc.getContext('2d')!;
      ctx.putImageData(result.proof, 0, 0);
      if (highlight) {
        const overlay = ctx.getImageData(0, 0, result.w, result.h);
        for (let i = 0; i < result.mask.length; i += 1) {
          if (result.mask[i]) {
            overlay.data[i * 4] = 255;
            overlay.data[i * 4 + 1] = 0;
            overlay.data[i * 4 + 2] = 255;
          }
        }
        ctx.putImageData(overlay, 0, 0);
      }
    }
  }, [result, highlight]);

  async function selectImage(f: File) {
    if (!engine) return;
    setPhase('processing');
    try {
      if (f.size > 50 * 1024 * 1024) throw new Error('File too large');
      const data = await toImageData(f);
      setResult(proofImageData(data, engine));
      setPhase('done');
      trackEvent('tool_complete', { tool: 'proof' });
    } catch {
      setPhase('error');
    }
  }

  async function uploadProfile(f: File) {
    if (!loaded) return;
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const eng = engineFor(loaded, bytes);
      setEngine(eng);
      setProfileName(eng.profileName);
      // Re-proof the current image with the new profile.
      if (result) setResult(proofImageData(result.original, eng));
    } catch {
      setEngineStatus('error');
    }
  }

  function reset() {
    setResult(null);
    setHighlight(false);
    setPhase('empty');
  }

  function download() {
    if (!result) return;
    const canvas = document.createElement('canvas');
    canvas.width = result.w;
    canvas.height = result.h;
    canvas.getContext('2d')!.putImageData(result.proof, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'soft-proof.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <>
      <CalculatorHeader
        eyebrow={eyebrow}
        title={title}
        desc={desc}
        backHref={`/${locale}`}
        backLabel={dict.calc.back}
      />

      <section className="mx-auto grid max-w-page gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-5">
          {engineStatus === 'error' && (
            <div
              role="alert"
              className="rounded-md border border-[#f6dca8] bg-warning-soft px-4 py-3.5 text-[13px] text-[#ab570a]"
            >
              {t.errorLoad}
            </div>
          )}

          {engineStatus === 'loading' && (
            <div className="flex items-center gap-3 rounded-lg border border-hairline bg-elevated p-6">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-hairline border-t-ink" />
              <span className="text-sm font-medium text-ink">{t.loading}</span>
            </div>
          )}

          {engineStatus === 'ready' && (phase === 'empty' || phase === 'error') && (
            <Dropzone
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              isError={phase === 'error'}
              onFile={(f) => void selectImage(f)}
              labels={t}
            />
          )}

          {phase === 'processing' && (
            <div className="flex items-center gap-3 rounded-lg border border-hairline bg-elevated p-6">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-hairline border-t-ink" />
              <span className="text-sm font-medium text-ink">{t.processing}</span>
            </div>
          )}

          {phase === 'done' && result && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hairline bg-elevated p-5">
                <div>
                  <div className="text-[13px] text-mute">{t.gamutLabel}</div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl font-semibold tabular-nums text-ink">
                      {round(result.outPct, 1)}%
                    </span>
                    {result.outPct < 0.5 && <Badge tone="success">{t.inGamut}</Badge>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="text-[13px] text-mute transition-colors hover:text-ink"
                >
                  {t.reset}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <figure className="m-0 flex flex-col gap-2">
                  <figcaption className="font-mono text-[11px] uppercase tracking-wide text-faint">
                    {t.originalLabel}
                  </figcaption>
                  <canvas
                    ref={origRef}
                    role="img"
                    aria-label={t.originalLabel}
                    className="h-auto w-full rounded-md border border-hairline bg-canvas"
                  />
                </figure>
                <figure className="m-0 flex flex-col gap-2">
                  <figcaption className="font-mono text-[11px] uppercase tracking-wide text-faint">
                    {t.proofLabel}
                  </figcaption>
                  <canvas
                    ref={proofRef}
                    role="img"
                    aria-label={t.proofLabel}
                    className="h-auto w-full rounded-md border border-hairline bg-canvas"
                  />
                </figure>
              </div>

              <div className="rounded-lg border border-hairline bg-elevated p-5">
                <ToggleField
                  label={t.highlight}
                  checked={highlight}
                  onChange={setHighlight}
                  helper={t.highlightHelper}
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <label className={`${buttonClass({ variant: 'secondary', shape: 'pill' })} cursor-pointer`}>
                    {t.uploadIcc}
                    <input
                      type="file"
                      accept=".icc,.icm"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void uploadProfile(f);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={download}
                    className={buttonClass({ variant: 'primary', shape: 'pill' })}
                  >
                    {t.download}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className="rounded-md border border-[#f6dca8] bg-warning-soft px-4 py-3 text-xs leading-relaxed text-[#ab570a]">
            {t.simNote}
          </p>
          <div className="rounded-lg border border-hairline bg-elevated p-5">
            <div className="mb-3 text-sm font-semibold text-ink">{t.guideTitle}</div>
            <ul className="m-0 flex list-disc flex-col gap-2 pl-4 text-[13px] leading-relaxed text-body">
              {t.guide.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs leading-relaxed text-mute">
            {profileName ? `${t.disclaimer} (${profileName})` : t.disclaimer}
          </p>
        </div>
      </section>
    </>
  );
}
