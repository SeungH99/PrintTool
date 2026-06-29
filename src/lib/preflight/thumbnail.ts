/**
 * Render the first page of a PDF to a PNG data URL via pdf.js, scaled to fit
 * within `maxPx` on its longest side. Browser-only (needs a <canvas>); returns
 * null if rendering can't complete. Kept separate from the structural analysis
 * so a render failure never blocks the preflight report.
 */
export async function renderFirstPage(
  bytes: ArrayBuffer | Uint8Array,
  maxPx: number,
): Promise<string | null> {
  // Copy: pdf.js may detach the passed buffer, which is shared with pdf-lib in the caller.
  const data = new Uint8Array(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
  const pdfjs = (await import('pdfjs-dist/legacy/build/pdf.mjs')) as typeof import('pdfjs-dist');
  const { getDocument, GlobalWorkerOptions } = pdfjs;
  // Mirror images.ts: only set the bundled worker URL in a real browser.
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
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(maxPx / base.width, maxPx / base.height);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL('image/png');
  } finally {
    await loadingTask.destroy();
  }
}
