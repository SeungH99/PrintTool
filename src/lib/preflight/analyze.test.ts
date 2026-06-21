import { describe, it, expect } from 'vitest';
import { PDFContext, PDFName, PDFArray, PDFNumber, PDFRawStream, PDFDict } from 'pdf-lib';
import { classifyColorSpace, aggregateColorMode, type ColorMode } from './analyze';

const ctx = PDFContext.create();

function arr(...items: unknown[]): PDFArray {
  const a = PDFArray.withContext(ctx);
  for (const item of items) a.push(item as never);
  return a;
}

/** ICCBased color space = [/ICCBased, stream], where the stream's /N is the component count. */
function iccStream(n: number): PDFRawStream {
  const dict = PDFDict.withContext(ctx);
  dict.set(PDFName.of('N'), PDFNumber.of(n));
  return PDFRawStream.of(dict, new Uint8Array());
}

describe('classifyColorSpace', () => {
  it('DeviceCMYK → cmyk', () => expect(classifyColorSpace(PDFName.of('DeviceCMYK'))).toBe('cmyk'));
  it('DeviceRGB → rgb', () => expect(classifyColorSpace(PDFName.of('DeviceRGB'))).toBe('rgb'));
  it('DeviceGray → gray', () => expect(classifyColorSpace(PDFName.of('DeviceGray'))).toBe('gray'));
  it('unknown name → other', () => expect(classifyColorSpace(PDFName.of('Pattern'))).toBe('other'));

  it('ICCBased N=4 → cmyk', () =>
    expect(classifyColorSpace(arr(PDFName.of('ICCBased'), iccStream(4)))).toBe('cmyk'));
  it('ICCBased N=3 → rgb', () =>
    expect(classifyColorSpace(arr(PDFName.of('ICCBased'), iccStream(3)))).toBe('rgb'));
  it('ICCBased N=1 → gray', () =>
    expect(classifyColorSpace(arr(PDFName.of('ICCBased'), iccStream(1)))).toBe('gray'));

  it('CalRGB → rgb', () => expect(classifyColorSpace(arr(PDFName.of('CalRGB')))).toBe('rgb'));
  it('CalGray → gray', () => expect(classifyColorSpace(arr(PDFName.of('CalGray')))).toBe('gray'));

  it('Indexed resolves its base space', () =>
    expect(classifyColorSpace(arr(PDFName.of('Indexed'), PDFName.of('DeviceCMYK')))).toBe('cmyk'));
  it('Separation classifies by alternate space (index 2)', () =>
    expect(
      classifyColorSpace(
        arr(PDFName.of('Separation'), PDFName.of('Spot'), PDFName.of('DeviceRGB')),
      ),
    ).toBe('rgb'));
  it('DeviceN classifies by alternate space', () =>
    expect(classifyColorSpace(arr(PDFName.of('DeviceN'), arr(), PDFName.of('DeviceCMYK')))).toBe(
      'cmyk',
    ));

  it('undefined → other', () => expect(classifyColorSpace(undefined)).toBe('other'));
});

describe('aggregateColorMode', () => {
  const m = (...xs: ColorMode[]): ColorMode[] => xs;

  it('any RGB page → rgb (print risk flagged)', () =>
    expect(aggregateColorMode(m('cmyk', 'rgb', 'none'))).toBe('rgb'));
  it('all imaged pages CMYK → cmyk', () =>
    expect(aggregateColorMode(m('cmyk', 'none', 'cmyk'))).toBe('cmyk'));
  it('no images on any page → none', () =>
    expect(aggregateColorMode(m('none', 'none'))).toBe('none'));
  it('only undetectable, no rgb/cmyk → unknown', () =>
    expect(aggregateColorMode(m('unknown', 'none'))).toBe('unknown'));
  it('cmyk wins over unknown', () => expect(aggregateColorMode(m('unknown', 'cmyk'))).toBe('cmyk'));
  it('empty → none', () => expect(aggregateColorMode([])).toBe('none'));
});
