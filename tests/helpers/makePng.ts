import { deflateSync } from 'node:zlib';

// Minimal solid-color RGB PNG builder with a known pixel size. Shared by the
// convert unit tests and the convert e2e spec so the fixture can't drift apart.
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

/** Build a solid red RGB PNG of the given pixel size. */
export function makePng(w: number, h: number): Uint8Array {
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
