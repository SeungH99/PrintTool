/**
 * Image DPI detection via pdf.js. Walks the first page's operator list, tracking the
 * CTM (transform stack), and computes effective DPI for each painted image as
 * `imagePx * 72 / displayedPt`. Returns the lowest DPI found, or null when there are
 * no images / it can't be determined. Color mode (CMYK vs RGB) is intentionally not
 * derived here — pdf.js normalizes image data, so it can't be told apart reliably.
 */
export type Matrix = [number, number, number, number, number, number];

/** Concatenate `next` (a `cm` matrix) onto `current`, PDF-style. */
export function composeMatrix(current: Matrix, next: Matrix): Matrix {
  return [
    next[0] * current[0] + next[1] * current[2],
    next[0] * current[1] + next[1] * current[3],
    next[2] * current[0] + next[3] * current[2],
    next[2] * current[1] + next[3] * current[3],
    next[4] * current[0] + next[5] * current[2] + current[4],
    next[4] * current[1] + next[5] * current[3] + current[5],
  ];
}

/** Effective DPI of an image given its pixel size and the CTM it is painted under. */
export function imageDpi(widthPx: number, heightPx: number, ctm: Matrix): number {
  const widthPt = Math.hypot(ctm[0], ctm[1]);
  const heightPt = Math.hypot(ctm[2], ctm[3]);
  const dpiX = widthPt > 0 ? (widthPx * 72) / widthPt : Infinity;
  const dpiY = heightPt > 0 ? (heightPx * 72) / heightPt : Infinity;
  return Math.min(dpiX, dpiY);
}

export async function detectMinImageDpi(bytes: ArrayBuffer | Uint8Array): Promise<number | null> {
  // Copy: pdf.js may transfer/detach the buffer, which would corrupt a shared
  // Uint8Array still in use by pdf-lib (font/color inspection) in the caller.
  const data = new Uint8Array(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
  const pdfjs = (await import('pdfjs-dist/legacy/build/pdf.mjs')) as typeof import('pdfjs-dist');
  const { getDocument, OPS, GlobalWorkerOptions } = pdfjs;
  // Set the bundled worker URL only in a real browser (where `Worker` exists). Next
  // emits the asset from this `new URL(..., import.meta.url)`. In Node (tests) there
  // is no Worker, so pdf.js runs its main-thread fake worker — and assigning an http:
  // workerSrc (vite resolves import.meta.url to http) breaks that fallback with
  // "Only URLs with a scheme in: file and data are supported by the default ESM loader".
  if (typeof Worker !== 'undefined') {
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString();
  }

  const loadingTask = getDocument({ data });
  const doc = await loadingTask.promise;
  try {
    const page = await doc.getPage(1);
    const opList = await page.getOperatorList();

    let ctm: Matrix = [1, 0, 0, 1, 0, 0];
    const stack: Matrix[] = [];
    let minDpi: number | null = null;

    for (let i = 0; i < opList.fnArray.length; i += 1) {
      const fn = opList.fnArray[i];
      const args = opList.argsArray[i] as unknown[];

      if (fn === OPS.save) {
        stack.push(ctm);
      } else if (fn === OPS.restore) {
        ctm = stack.pop() ?? ctm;
      } else if (fn === OPS.transform) {
        ctm = composeMatrix(ctm, args as Matrix);
      } else if (fn === OPS.paintImageXObject) {
        // pdf.js passes the intrinsic image size as args [id, widthPx, heightPx];
        // no need to await the (deferred) decoded image object.
        const widthPx = args[1] as number;
        const heightPx = args[2] as number;
        if (
          typeof widthPx === 'number' &&
          typeof heightPx === 'number' &&
          widthPx > 0 &&
          heightPx > 0
        ) {
          const dpi = imageDpi(widthPx, heightPx, ctm);
          if (Number.isFinite(dpi) && dpi > 0) {
            minDpi = minDpi === null ? dpi : Math.min(minDpi, dpi);
          }
        }
      }
    }

    return minDpi;
  } finally {
    await loadingTask.destroy();
  }
}
