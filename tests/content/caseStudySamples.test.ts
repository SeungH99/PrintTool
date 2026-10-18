// @vitest-environment node
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { PDFArray, PDFDict, PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { analyzePdf } from '@/lib/preflight/analyze';
import { imageToPdf } from '@/lib/convert/imageToPdf';

const sample = (name: string) => new URL('../../public/samples/' + name, import.meta.url);

function pngPixels(bytes: Buffer) {
  const chunks: Buffer[] = [];
  for (let offset = 8; offset < bytes.length; ) {
    const length = bytes.readUInt32BE(offset);
    if (bytes.toString('ascii', offset + 4, offset + 8) === 'IDAT')
      chunks.push(bytes.subarray(offset + 8, offset + 8 + length));
    offset += length + 12;
  }
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    pixels: inflateSync(Buffer.concat(chunks)),
  };
}

async function firstImage(name: string) {
  const document = await PDFDocument.load(await readFile(sample(name)));
  const resources = document.getPage(0).node.lookup(PDFName.of('Resources'), PDFDict);
  const images = resources.lookupMaybe(PDFName.of('XObject'), PDFDict);
  const stream = images
    ?.entries()
    .map(([, value]) => document.context.lookup(value))
    .find((value) => value instanceof PDFRawStream);
  return stream instanceof PDFRawStream ? stream : undefined;
}

describe('case-study samples', () => {
  it('matches the converter centered placement with 6 mm whitespace above and below', async () => {
    const source = await readFile(sample('printready-rgb-1200x800.png'));
    const converted = await imageToPdf(source, 'image/png', {
      pageSize: 'a4',
      orientation: 'landscape',
    });
    for (const bytes of [
      converted,
      await readFile(sample('printready-a4-rgb-low-resolution.pdf')),
    ]) {
      const document = await PDFDocument.load(bytes);
      const contents = document.getPage(0).node.lookup(PDFName.of('Contents'), PDFArray);
      const operators = Array.from({ length: contents.size() }, (_, index) =>
        inflateSync(contents.lookup(index, PDFRawStream).getContents()).toString(),
      ).join('\n');
      const transforms = [...operators.matchAll(/([\d.eE+\- ]+) cm/g)].map((match) =>
        match[1].trim().split(/\s+/).map(Number),
      );
      // 1200:800 at 297 mm is 198 mm high: (210 - 198) / 2 = 6 mm = 17.007874 pt.
      expect(transforms.some((matrix) => Math.abs(matrix[5] - 17.007874) < 0.001)).toBe(true);
    }
    const preview = pngPixels(await readFile(sample('printready-a4-rgb-preview.png')));
    const at = (row: number) => [
      ...preview.pixels.subarray(row * (1200 * 3 + 1) + 1, row * (1200 * 3 + 1) + 4),
    ];
    expect(at(0)).toEqual([255, 255, 255]);
    expect(at(24)).toEqual([22, 42, 54]);
    expect(at(824)).toEqual([255, 255, 255]);
  });

  it('provides multicolor detail and fine-line artwork rather than a flat color rectangle', async () => {
    const { width, height, pixels } = pngPixels(
      await readFile(sample('printready-rgb-1200x800.png')),
    );
    expect([width, height]).toEqual([1200, 800]);
    const colors = new Set<string>();
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const offset = y * (width * 3 + 1) + 1 + x * 3;
        colors.add(pixels.subarray(offset, offset + 3).toString('hex'));
      }
    }
    expect(colors.size).toBeGreaterThan(128);
    // The detail panel must retain alternating dark/light one-pixel rules.
    const row = 610 * (width * 3 + 1) + 1;
    const red = Array.from({ length: 100 }, (_, x) => pixels[row + (80 + x) * 3]);
    expect(
      red.filter((value, index) => index > 0 && Math.abs(value - red[index - 1]) > 100).length,
    ).toBeGreaterThan(40);
  });

  it('changes the actual PDF placement to 100 mm without manufacturing extra pixels', async () => {
    const result = await analyzePdf(await readFile(sample('printready-rgb-100mm-corrected.pdf')));
    expect(result.pageWidthMm).toBeCloseTo(100, 2);
    expect(result.pageHeightMm).toBeCloseTo(66.6667, 2);
    expect(result.minImageDpi).toBeCloseTo(304.8, 1);
    expect(result.colorMode).toBe('rgb');
    const before = await firstImage('printready-a4-rgb-low-resolution.pdf');
    const after = await firstImage('printready-rgb-100mm-corrected.pdf');
    expect(after?.dict.get(PDFName.of('Width'))?.toString()).toBe('1200');
    expect(after?.getContents()).toEqual(before?.getContents());
  });

  it('includes visible artwork in both bleed PDFs and paints beyond the corrected trim boundary', async () => {
    const none = await firstImage('printready-a4-no-bleed.pdf');
    const bleed = await firstImage('printready-a4-3mm-bleed.pdf');
    expect(none).toBeDefined();
    expect(bleed).toBeDefined();
    if (!bleed) return;
    const pixels = inflateSync(bleed.getContents());
    // RGB pixels in the outer corner are artwork, not the white of an empty PDF page.
    expect([...pixels.subarray(0, 3)]).not.toEqual([255, 255, 255]);
    expect(new Set(pixels).size).toBeGreaterThan(32);
  });
  it('keeps the converted A4 RGB sample reproducible', async () => {
    const result = await analyzePdf(await readFile(sample('printready-a4-rgb-low-resolution.pdf')));
    expect(result.pageWidthMm).toBeCloseTo(297, 0);
    expect(result.pageHeightMm).toBeCloseTo(210, 0);
    expect(result.colorMode).toBe('rgb');
    expect(result.minImageDpi).toBeCloseTo(102.63, 0);
    expect(result.hasTrimBox).toBe(false);
    expect(result.hasBleedBox).toBe(false);
  });

  it('distinguishes missing boxes from a 3 mm bleed document', async () => {
    const none = await analyzePdf(await readFile(sample('printready-a4-no-bleed.pdf')));
    const bleed = await analyzePdf(await readFile(sample('printready-a4-3mm-bleed.pdf')));
    expect({ trim: none.hasTrimBox, bleed: none.hasBleedBox }).toEqual({
      trim: false,
      bleed: false,
    });
    expect({ trim: bleed.hasTrimBox, bleed: bleed.hasBleedBox }).toEqual({
      trim: true,
      bleed: true,
    });
    expect(bleed.pageWidthMm).toBeCloseTo(216, 0);
    expect(bleed.pageHeightMm).toBeCloseTo(303, 0);
  });

  it('publishes exact booklet scenarios', async () => {
    const json = await readFile(sample('booklet-scenarios.json'), 'utf8');
    const data = JSON.parse(json);
    expect(data).toEqual([
      { pages: 6, paddedPages: 8, blanks: 2, sheets: 2 },
      { pages: 8, paddedPages: 8, blanks: 0, sheets: 2 },
      { pages: 12, paddedPages: 12, blanks: 0, sheets: 3 },
    ]);
    expect(json).toBe(`${JSON.stringify(data, null, 2)}\n`);
  });

  it('regenerates every published sample byte-for-byte in an isolated directory', async () => {
    const output = await mkdtemp(join(tmpdir(), 'printready-samples-'));
    try {
      const script = new URL('../../scripts/generate-case-study-samples.mjs', import.meta.url);
      execFileSync(process.execPath, [fileURLToPath(script), '--out', output]);
      const names = await readdir(output);
      expect(names).toContain('printready-rgb-100mm-corrected.pdf');
      const first = await Promise.all(names.map((name) => readFile(join(output, name))));
      execFileSync(process.execPath, [fileURLToPath(script), '--out', output]);
      for (const [index, name] of names.entries()) {
        expect(await readFile(join(output, name))).toEqual(first[index]);
        expect(await readFile(sample(name))).toEqual(first[index]);
      }
    } finally {
      await rm(output, { recursive: true, force: true });
    }
  }, 30_000);
});
