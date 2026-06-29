declare module 'lcms-wasm' {
  /** The subset of the instantiated Little-CMS object this project uses. */
  export interface LcmsInstance {
    cmsOpenProfileFromMem(data: Uint8Array, len: number): number;
    cmsCreate_sRGBProfile(): number;
    cmsGetProfileInfoASCII(p: number, info: number, lang: string, country: string): string;
    cmsGetColorSpaceASCII(p: number): string;
    cmsFormatterForColorspaceOfProfile(p: number, bytesPerChannel: number, isFloat: boolean): number;
    cmsCreateTransform(
      inputProfile: number,
      inputFormat: number,
      outputProfile: number,
      outputFormat: number,
      intent: number,
      flags: number,
    ): number;
    cmsDoTransform(
      transform: number,
      data: Uint8ClampedArray | Float32Array,
      nPixels: number,
    ): Uint8ClampedArray;
    cmsCloseProfile(p: number): void;
    cmsDeleteTransform(t: number): void;
  }

  export function instantiate(opts?: {
    locateFile?: (name: string) => string;
  }): Promise<LcmsInstance>;

  export const INTENT_RELATIVE_COLORIMETRIC: number;
  export const cmsFLAGS_NOCACHE: number;
  export const cmsFLAGS_HIGHRESPRECALC: number;
  export const cmsFLAGS_NOOPTIMIZE: number;
  export const cmsFLAGS_BLACKPOINTCOMPENSATION: number;
  export const cmsInfoDescription: number;
}
