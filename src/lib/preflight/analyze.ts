import { PDFDocument, PDFName } from 'pdf-lib';

const PT_PER_MM = 72 / 25.4;

export interface PdfAnalysis {
  pageCount: number;
  pageWidthMm: number;
  pageHeightMm: number;
  hasTrimBox: boolean;
  hasBleedBox: boolean;
}

/**
 * Reliable, structure-only PDF analysis via pdf-lib: page count, first-page size,
 * and whether TrimBox/BleedBox are present. Image DPI, color mode and font
 * embedding are NOT inspected here (see report.ts — marked as detection-limited).
 * Throws if the bytes are not a valid PDF.
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

  return {
    pageCount,
    pageWidthMm: width / PT_PER_MM,
    pageHeightMm: height / PT_PER_MM,
    hasTrimBox: hasBox('TrimBox'),
    hasBleedBox: hasBox('BleedBox'),
  };
}
