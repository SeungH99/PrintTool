import {
  PDFDocument,
  PDFName,
  PDFDict,
  PDFArray,
  PDFRawStream,
  PDFNumber,
  type PDFObject,
  type PDFPageLeaf,
} from 'pdf-lib';
import { detectMinImageDpi } from './images';

const PT_PER_MM = 72 / 25.4;

export type FontsEmbedded = 'all' | 'some' | 'none' | 'unknown';

/** Aggregate image color space of the first page. `rgb` = at least one non-CMYK image. */
export type ColorMode = 'cmyk' | 'rgb' | 'none' | 'unknown';

export interface PdfAnalysis {
  pageCount: number;
  pageWidthMm: number;
  pageHeightMm: number;
  hasTrimBox: boolean;
  hasBleedBox: boolean;
  /** Best-effort embedding check of the first page's fonts. `unknown` when undetectable. */
  fontsEmbedded: FontsEmbedded;
  /** Lowest effective image DPI on the first page (via pdf.js), or null if none/undetectable. */
  minImageDpi: number | null;
  /** Image color space of the first page (read from /ColorSpace, not rendered pixels). */
  colorMode: ColorMode;
}

const FONT_FILE_KEYS = ['FontFile', 'FontFile2', 'FontFile3'];

function descriptorEmbedded(descriptor: PDFDict): boolean {
  return FONT_FILE_KEYS.some((key) => descriptor.get(PDFName.of(key)) !== undefined);
}

function fontEmbedded(font: PDFDict): boolean {
  // lookupMaybe returns undefined (instead of throwing) when the key is absent.
  const descriptor = font.lookupMaybe(PDFName.of('FontDescriptor'), PDFDict);
  if (descriptor) return descriptorEmbedded(descriptor);

  // Type0 composite fonts carry the descriptor on the descendant font.
  const descendants = font.lookupMaybe(PDFName.of('DescendantFonts'), PDFArray);
  if (descendants && descendants.size() > 0) {
    const child = descendants.lookupMaybe(0, PDFDict);
    const childDescriptor = child?.lookupMaybe(PDFName.of('FontDescriptor'), PDFDict);
    if (childDescriptor) return descriptorEmbedded(childDescriptor);
  }
  return false;
}

/**
 * Best-effort font-embedding check on the first page. Standard (base-14) fonts have
 * no embedded file and report `none`; returns `unknown` for empty/edge cases or any
 * parsing trouble (never guesses). Image DPI and color mode are intentionally not
 * inspected here — unreliable in-browser (report.ts marks them detection-limited).
 */
function inspectFonts(page: PDFPageLeaf): FontsEmbedded {
  try {
    const resources = page.lookupMaybe(PDFName.of('Resources'), PDFDict);
    const fonts = resources?.lookupMaybe(PDFName.of('Font'), PDFDict);
    if (!fonts) return 'unknown';

    let total = 0;
    let embedded = 0;
    for (const [key] of fonts.entries()) {
      const font = fonts.lookupMaybe(key, PDFDict);
      if (!font) continue;
      total += 1;
      if (fontEmbedded(font)) embedded += 1;
    }

    if (total === 0) return 'unknown';
    if (embedded === total) return 'all';
    if (embedded === 0) return 'none';
    return 'some';
  } catch {
    return 'unknown';
  }
}

type CsClass = 'cmyk' | 'rgb' | 'gray' | 'other';

function csFromName(name: string): CsClass {
  if (name.includes('CMYK')) return 'cmyk';
  if (name.includes('RGB')) return 'rgb';
  if (name.includes('Gray')) return 'gray';
  return 'other';
}

function classifyColorSpace(cs: PDFObject | undefined): CsClass {
  if (cs instanceof PDFName) return csFromName(cs.toString());
  if (cs instanceof PDFArray) {
    const familyObj = cs.lookup(0);
    const family = familyObj instanceof PDFName ? familyObj.toString() : '';
    if (family.includes('ICCBased')) {
      const icc = cs.lookup(1);
      const n =
        icc instanceof PDFRawStream
          ? icc.dict.lookupMaybe(PDFName.of('N'), PDFNumber)?.asNumber()
          : undefined;
      if (n === 4) return 'cmyk';
      if (n === 3) return 'rgb';
      if (n === 1) return 'gray';
      return 'other';
    }
    if (family.includes('CalRGB')) return 'rgb';
    if (family.includes('CalGray')) return 'gray';
    if (family.includes('Indexed')) return classifyColorSpace(cs.lookup(1));
    return csFromName(family);
  }
  return 'other';
}

/**
 * First-page image color space, read from each image XObject's /ColorSpace dict
 * (the source color space, not pdf.js-normalized pixels). `rgb` means at least one
 * non-CMYK image is present; `none` when there are no images. Best-effort.
 */
function inspectColorMode(page: PDFPageLeaf): ColorMode {
  try {
    const resources = page.lookupMaybe(PDFName.of('Resources'), PDFDict);
    const xobjects = resources?.lookupMaybe(PDFName.of('XObject'), PDFDict);
    if (!xobjects) return 'none';

    let images = 0;
    let classified = 0;
    let allCmyk = true;
    for (const [key] of xobjects.entries()) {
      const resolved = xobjects.lookup(key);
      if (!(resolved instanceof PDFRawStream)) continue;
      if (resolved.dict.lookupMaybe(PDFName.of('Subtype'), PDFName)?.toString() !== '/Image') continue;
      images += 1;
      const cs = resolved.dict.lookup(PDFName.of('ColorSpace'));
      if (!cs) continue;
      classified += 1;
      if (classifyColorSpace(cs) !== 'cmyk') allCmyk = false;
    }

    if (images === 0) return 'none';
    if (classified === 0) return 'unknown';
    return allCmyk ? 'cmyk' : 'rgb';
  } catch {
    return 'unknown';
  }
}

/**
 * Reliable, structure-only PDF analysis via pdf-lib: page count, first-page size,
 * TrimBox/BleedBox presence, and a best-effort font-embedding check. Throws if the
 * bytes are not a valid PDF.
 */
export async function analyzePdf(bytes: ArrayBuffer | Uint8Array): Promise<PdfAnalysis> {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const pageCount = doc.getPageCount();
  const first = doc.getPage(0);
  const { width, height } = first.getSize();

  const hasBox = (name: string): boolean => {
    try {
      return first.node.get(PDFName.of(name)) !== undefined;
    } catch {
      return false;
    }
  };

  // Finish all pdf-lib reads BEFORE pdf.js runs — pdf.js can detach the byte buffer.
  const hasTrimBox = hasBox('TrimBox');
  const hasBleedBox = hasBox('BleedBox');
  const fontsEmbedded = inspectFonts(first.node);
  const colorMode = inspectColorMode(first.node);

  let minImageDpi: number | null = null;
  try {
    minImageDpi = await detectMinImageDpi(bytes);
  } catch {
    minImageDpi = null;
  }

  return {
    pageCount,
    pageWidthMm: width / PT_PER_MM,
    pageHeightMm: height / PT_PER_MM,
    hasTrimBox,
    hasBleedBox,
    fontsEmbedded,
    minImageDpi,
    colorMode,
  };
}
