import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { imageToPdf } from '@/lib/convert/imageToPdf';
import { makePng } from '../helpers/makePng';

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
