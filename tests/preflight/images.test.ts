import { describe, it, expect } from 'vitest';
import { deflateSync } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';
import { composeMatrix, imageDpi, detectMinImageDpi } from '@/lib/preflight/images';
import { analyzePdf } from '@/lib/preflight/analyze';

// --- minimal solid-color RGB PNG builder (for a known pixel size) ---
let CRC: number[] | null = null;
function crc32(bytes: Uint8Array): number {
  if (!CRC) {
    CRC = [];
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      CRC[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) crc = CRC[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
const u32 = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
function chunk(type: string, data: number[]): number[] {
  const body = [...[...type].map((c) => c.charCodeAt(0)), ...data];
  return [...u32(data.length), ...body, ...u32(crc32(Uint8Array.from(body)))];
}
function makePng(w: number, h: number): Uint8Array {
  const ihdr = chunk('IHDR', [...u32(w), ...u32(h), 8, 2, 0, 0, 0]);
  const raw: number[] = [];
  for (let y = 0; y < h; y += 1) {
    raw.push(0); // filter: none
    for (let x = 0; x < w; x += 1) raw.push(200, 30, 30);
  }
  const idat = chunk('IDAT', [...deflateSync(Uint8Array.from(raw))]);
  const iend = chunk('IEND', []);
  return Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, ...ihdr, ...idat, ...iend]);
}

describe('imageDpi (pure)', () => {
  it('derives DPI from the CTM scale', () => {
    // 300px drawn over 72pt (= 1 inch) -> 300 DPI
    expect(imageDpi(300, 300, [72, 0, 0, 72, 0, 0])).toBeCloseTo(300, 5);
    expect(imageDpi(150, 150, [72, 0, 0, 72, 0, 0])).toBeCloseTo(150, 5);
  });
});

describe('composeMatrix (pure)', () => {
  it('concatenates two scale matrices', () => {
    expect(composeMatrix([2, 0, 0, 2, 0, 0], [3, 0, 0, 3, 0, 0])).toEqual([6, 0, 0, 6, 0, 0]);
  });
});

describe('detectMinImageDpi', () => {
  it('reads the DPI of an embedded image', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([600, 600]);
    const img = await doc.embedPng(makePng(300, 300));
    page.drawImage(img, { x: 0, y: 0, width: 72, height: 72 }); // 300px / 1in = 300 DPI
    const dpi = await detectMinImageDpi(await doc.save());
    expect(dpi).not.toBeNull();
    expect(dpi as number).toBeCloseTo(300, 0);
  });

  it('returns null when there are no images', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([600, 600]);
    expect(await detectMinImageDpi(await doc.save())).toBeNull();
  });
});

describe('color mode (analyzePdf)', () => {
  it('detects an embedded RGB image as rgb', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([200, 200]);
    const img = await doc.embedPng(makePng(50, 50));
    page.drawImage(img, { x: 0, y: 0, width: 50, height: 50 });
    const a = await analyzePdf(await doc.save());
    expect(a.colorMode).toBe('rgb');
  });
});
