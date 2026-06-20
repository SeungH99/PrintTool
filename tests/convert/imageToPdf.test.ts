import { describe, it, expect } from 'vitest';
import { deflateSync } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';
import { imageToPdf } from '@/lib/convert/imageToPdf';

// --- minimal solid-color RGB PNG builder (known pixel size) ---
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
    raw.push(0);
    for (let x = 0; x < w; x += 1) raw.push(200, 30, 30);
  }
  const idat = chunk('IDAT', [...deflateSync(Uint8Array.from(raw))]);
  const iend = chunk('IEND', []);
  return Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, ...ihdr, ...idat, ...iend]);
}

const MM = 72 / 25.4;

describe('imageToPdf', () => {
  it('wraps a tall PNG into a single A4 portrait page', async () => {
    const bytes = await imageToPdf(makePng(300, 600), 'image/png', { pageSize: 'a4' });
    expect(bytes[0]).toBe(0x25); // "%"
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
    const page = doc.getPage(0);
    expect(page.getWidth()).toBeCloseTo(210 * MM, 0);
    expect(page.getHeight()).toBeCloseTo(297 * MM, 0);
  });

  it('auto-rotates to landscape for a wide image', async () => {
    const bytes = await imageToPdf(makePng(600, 300), 'image/png', { pageSize: 'a4' });
    const page = (await PDFDocument.load(bytes)).getPage(0);
    expect(page.getWidth()).toBeCloseTo(297 * MM, 0);
    expect(page.getWidth()).toBeGreaterThan(page.getHeight());
  });

  it('matches the image size for pageSize "fit"', async () => {
    const bytes = await imageToPdf(makePng(400, 250), 'image/png', { pageSize: 'fit' });
    const page = (await PDFDocument.load(bytes)).getPage(0);
    expect(page.getWidth()).toBeCloseTo(400, 0);
    expect(page.getHeight()).toBeCloseTo(250, 0);
  });

  it('rejects unsupported image types', async () => {
    await expect(imageToPdf(new Uint8Array([1, 2, 3]), 'image/gif')).rejects.toThrow();
  });
});
