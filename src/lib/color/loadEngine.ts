import { buildEngine, type ColorEngine, type Lcms, type LcmsConstants } from './cmyk';

type LcmsModule = {
  instantiate: (opts?: { locateFile?: (f: string) => string }) => Promise<unknown>;
  INTENT_RELATIVE_COLORIMETRIC: number;
  cmsFLAGS_NOCACHE: number;
  cmsFLAGS_HIGHRESPRECALC: number;
  cmsFLAGS_NOOPTIMIZE: number;
  cmsFLAGS_BLACKPOINTCOMPENSATION: number;
  cmsInfoDescription: number;
};

export interface LoadedLcms {
  lcms: Lcms;
  constants: LcmsConstants;
  /** The bundled CMYK profile, used when the caller doesn't supply its own. */
  defaultProfile: Uint8Array;
}

/**
 * Load the self-hosted Little-CMS WASM module plus the bundled CMYK profile.
 * webpackIgnore keeps the Emscripten glue out of the bundle so it fetches its
 * own .wasm at runtime. Browser-only. Returns the pieces buildEngine needs so a
 * caller can build an engine from the default profile or an uploaded one.
 */
export async function loadLcms(): Promise<LoadedLcms> {
  const src = '/lcms/lcms.js';
  const mod = (await import(/* webpackIgnore: true */ src)) as LcmsModule;
  const lcms = (await mod.instantiate({ locateFile: (f) => `/lcms/${f}` })) as unknown as Lcms;
  const res = await fetch('/profiles/default_cmyk.icc');
  if (!res.ok) throw new Error('profile fetch failed');
  const defaultProfile = new Uint8Array(await res.arrayBuffer());
  return {
    lcms,
    constants: {
      INTENT_RELATIVE_COLORIMETRIC: mod.INTENT_RELATIVE_COLORIMETRIC,
      cmsFLAGS_NOCACHE: mod.cmsFLAGS_NOCACHE,
      cmsFLAGS_HIGHRESPRECALC: mod.cmsFLAGS_HIGHRESPRECALC,
      cmsFLAGS_NOOPTIMIZE: mod.cmsFLAGS_NOOPTIMIZE,
      cmsFLAGS_BLACKPOINTCOMPENSATION: mod.cmsFLAGS_BLACKPOINTCOMPENSATION,
      cmsInfoDescription: mod.cmsInfoDescription,
    },
    defaultProfile,
  };
}

/** Build a CMYK⇄sRGB engine from the bundled profile, or an uploaded one when given. */
export function engineFor(loaded: LoadedLcms, profileBytes?: Uint8Array): ColorEngine {
  return buildEngine(loaded.lcms, loaded.constants, profileBytes ?? loaded.defaultProfile);
}
