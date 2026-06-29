// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  instantiate,
  INTENT_RELATIVE_COLORIMETRIC,
  cmsFLAGS_NOCACHE,
  cmsFLAGS_HIGHRESPRECALC,
  cmsFLAGS_NOOPTIMIZE,
  cmsFLAGS_BLACKPOINTCOMPENSATION,
  cmsInfoDescription,
} from 'lcms-wasm';
import {
  buildEngine,
  gamutClipDistance,
  hexToRgb,
  rgbToHex,
  type Lcms,
  type LcmsConstants,
} from '@/lib/color/cmyk';

const CONSTS: LcmsConstants = {
  INTENT_RELATIVE_COLORIMETRIC,
  cmsFLAGS_NOCACHE,
  cmsFLAGS_HIGHRESPRECALC,
  cmsFLAGS_NOOPTIMIZE,
  cmsFLAGS_BLACKPOINTCOMPENSATION,
  cmsInfoDescription,
};

describe('hex/rgb helpers', () => {
  it('parses 6- and 3-digit hex', () => {
    expect(hexToRgb('#1a2b3c')).toEqual([26, 43, 60]);
    expect(hexToRgb('fff')).toEqual([255, 255, 255]);
  });
  it('rejects invalid hex', () => {
    expect(hexToRgb('xyz')).toBeNull();
    expect(hexToRgb('#12')).toBeNull();
  });
  it('formats rgb back to hex and clamps', () => {
    expect(rgbToHex(26, 43, 60)).toBe('#1a2b3c');
    expect(rgbToHex(300, -5, 128)).toBe('#ff0080');
  });
});

describe('CMYK ICC engine (Ghostscript default_cmyk profile)', () => {
  async function engine() {
    const lcms = (await instantiate()) as unknown as Lcms;
    const bytes = new Uint8Array(readFileSync('public/profiles/default_cmyk.icc'));
    return buildEngine(lcms, CONSTS, bytes);
  }

  it('maps 0,0,0,0 to near-white and 0,0,0,100 to near-black', async () => {
    const e = await engine();
    const white = e.cmykToRgb(0, 0, 0, 0);
    const black = e.cmykToRgb(0, 0, 0, 100);
    expect(white[0]).toBeGreaterThan(230);
    expect(white[2]).toBeGreaterThan(230);
    expect(black[0]).toBeLessThan(90);
  });

  it('keeps cyan blue/green dominant and magenta red dominant', async () => {
    const e = await engine();
    const cyan = e.cmykToRgb(100, 0, 0, 0);
    expect(cyan[1]).toBeGreaterThan(cyan[0]); // G > R
    expect(cyan[2]).toBeGreaterThan(cyan[0]); // B > R
    const magenta = e.cmykToRgb(0, 100, 0, 0);
    expect(magenta[0]).toBeGreaterThan(magenta[1]); // R > G
  });

  it('round-trips RGB → CMYK → RGB within tolerance', async () => {
    const e = await engine();
    const [r0, g0, b0] = [40, 120, 200];
    const cmyk = e.rgbToCmyk(r0, g0, b0);
    const [r1, g1, b1] = e.cmykToRgb(cmyk[0], cmyk[1], cmyk[2], cmyk[3]);
    expect(Math.abs(r1 - r0)).toBeLessThan(25);
    expect(Math.abs(g1 - g0)).toBeLessThan(25);
    expect(Math.abs(b1 - b0)).toBeLessThan(25);
  });

  it('flags a saturated sRGB primary as out of gamut, a neutral grey as in gamut', async () => {
    const e = await engine();
    // Pure sRGB green sits well outside the small Ghostscript CMYK gamut.
    expect(gamutClipDistance(e, [0, 255, 0])).toBeGreaterThan(20);
    // A mid grey is reproducible and round-trips tightly.
    expect(gamutClipDistance(e, [128, 128, 128])).toBeLessThan(20);
  });

  it('soft-proofs a packed RGB buffer in one bulk pass', async () => {
    const e = await engine();
    // Two pixels: white, then saturated green.
    const rgb = new Uint8ClampedArray([255, 255, 255, 0, 255, 0]);
    const out = e.proofImage(rgb, 2);
    expect(out).toHaveLength(6);
    // White stays near white.
    expect(out[0]).toBeGreaterThan(230);
    expect(out[2]).toBeGreaterThan(230);
    // Green is clipped into gamut: still green-dominant but no longer pure 255.
    expect(out[4]).toBeGreaterThan(out[3]);
    expect(out[4]).toBeGreaterThan(out[5]);
  });
});
