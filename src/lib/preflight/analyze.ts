import { PDFDocument, PDFName, PDFDict, PDFArray, type PDFPageLeaf } from 'pdf-lib';
import { detectMinImageDpi } from './images';

const PT_PER_MM = 72 / 25.4;

export type FontsEmbedded = 'all' | 'some' | 'none' | 'unknown';

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
    hasTrimBox: hasBox('TrimBox'),
    hasBleedBox: hasBox('BleedBox'),
    fontsEmbedded: inspectFonts(first.node),
    minImageDpi,
  };
}
