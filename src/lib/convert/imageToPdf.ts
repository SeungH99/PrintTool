import { PDFDocument } from 'pdf-lib';

export type PageSizeId = 'a4' | 'letter' | 'fit';
export type Orientation = 'auto' | 'portrait' | 'landscape';

export interface ImageToPdfOptions {
  /** Target page size. 'fit' makes the page exactly the image size (1px → 1pt). */
  pageSize?: PageSizeId;
  /** Uniform page margin in millimetres (ignored for 'fit'). */
  marginMm?: number;
  orientation?: Orientation;
}

const MM_TO_PT = 72 / 25.4;

const PAGE_PT: Record<Exclude<PageSizeId, 'fit'>, { w: number; h: number }> = {
  a4: { w: 210 * MM_TO_PT, h: 297 * MM_TO_PT },
  letter: { w: 8.5 * 72, h: 11 * 72 },
};

/**
 * Wrap a raster image (PNG/JPEG) into a print-ready PDF, fitting it to the
 * chosen page size. Pure: takes bytes, returns bytes. Output colour stays RGB —
 * true CMYK conversion is not possible client-side (documented limitation).
 */
export async function imageToPdf(
  imageBytes: Uint8Array,
  mime: string,
  options: ImageToPdfOptions = {},
): Promise<Uint8Array> {
  const { pageSize = 'a4', marginMm = 0, orientation = 'auto' } = options;

  const pdf = await PDFDocument.create();
  const image =
    mime === 'image/png'
      ? await pdf.embedPng(imageBytes)
      : mime === 'image/jpeg' || mime === 'image/jpg'
        ? await pdf.embedJpg(imageBytes)
        : null;
  if (!image) throw new Error(`Unsupported image type: ${mime}`);

  const { width: iw, height: ih } = image.size();

  if (pageSize === 'fit') {
    const page = pdf.addPage([iw, ih]);
    page.drawImage(image, { x: 0, y: 0, width: iw, height: ih });
    return pdf.save();
  }

  let { w: pw, h: ph } = PAGE_PT[pageSize];
  const landscape = orientation === 'landscape' || (orientation === 'auto' && iw > ih);
  if (landscape) [pw, ph] = [ph, pw];

  const margin = marginMm * MM_TO_PT;
  const scale = Math.min((pw - margin * 2) / iw, (ph - margin * 2) / ih);
  const dw = iw * scale;
  const dh = ih * scale;

  const page = pdf.addPage([pw, ph]);
  page.drawImage(image, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
  return pdf.save();
}
