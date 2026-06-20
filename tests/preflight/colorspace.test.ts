import { describe, it, expect } from 'vitest';
import { PDFDocument, PDFName } from 'pdf-lib';
import { classifyColorSpace } from '@/lib/preflight/analyze';

async function context() {
  return (await PDFDocument.create()).context;
}

describe('classifyColorSpace', () => {
  it('classifies device color spaces by name', () => {
    expect(classifyColorSpace(PDFName.of('DeviceCMYK'))).toBe('cmyk');
    expect(classifyColorSpace(PDFName.of('DeviceRGB'))).toBe('rgb');
    expect(classifyColorSpace(PDFName.of('DeviceGray'))).toBe('gray');
  });

  it('classifies Separation / DeviceN by their alternate color space', async () => {
    const ctx = await context();
    const separation = ctx.obj([
      PDFName.of('Separation'),
      PDFName.of('Spot1'),
      PDFName.of('DeviceCMYK'),
    ]);
    expect(classifyColorSpace(separation)).toBe('cmyk');

    const deviceN = ctx.obj([
      PDFName.of('DeviceN'),
      ctx.obj(['Cyan', 'Magenta']),
      PDFName.of('DeviceRGB'),
    ]);
    expect(classifyColorSpace(deviceN)).toBe('rgb');
  });

  it('classifies Indexed by its base color space', async () => {
    const ctx = await context();
    const indexed = ctx.obj([PDFName.of('Indexed'), PDFName.of('DeviceRGB'), 1, '']);
    expect(classifyColorSpace(indexed)).toBe('rgb');
  });
});
