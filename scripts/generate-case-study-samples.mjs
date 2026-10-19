import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PDFDocument } from 'pdf-lib';

const outIndex = process.argv.indexOf('--out');
const OUT =
  outIndex >= 0
    ? pathToFileURL(`${resolve(process.argv[outIndex + 1])}/`)
    : new URL('../public/samples/', import.meta.url);
const MM_TO_PT = 72 / 25.4;
const FIXED_DATE = new Date('2026-10-18T00:00:00.000Z');
const mm = (value) => value * MM_TO_PT;

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.subarray(4, 8 + data.length)), 8 + data.length);
  return chunk;
}

// A small original pixel alphabet keeps the fixtures independent of OS fonts/canvas.
const GLYPHS = {
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 23, 17, 17, 15],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  J: [7, 2, 2, 2, 18, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [15, 16, 16, 14, 1, 1, 30],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 21, 10],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
  0: [14, 17, 19, 21, 25, 17, 14],
  1: [4, 12, 4, 4, 4, 4, 14],
  2: [14, 17, 1, 2, 4, 8, 31],
  3: [30, 1, 1, 14, 1, 1, 30],
  4: [2, 6, 10, 18, 31, 2, 2],
  5: [31, 16, 16, 30, 1, 1, 30],
  6: [14, 16, 16, 30, 17, 17, 14],
  7: [31, 1, 2, 4, 8, 8, 8],
  8: [14, 17, 17, 14, 17, 17, 14],
  9: [14, 17, 17, 15, 1, 1, 14],
  '-': [0, 0, 0, 31, 0, 0, 0],
  '.': [0, 0, 0, 0, 0, 12, 12],
  '/': [1, 2, 2, 4, 8, 8, 16],
  ':': [0, 12, 12, 0, 12, 12, 0],
  '=': [0, 0, 31, 0, 31, 0, 0],
};
const INK = [22, 42, 54];
const PAPER = [250, 247, 237];

function raster(width, height, background = PAPER) {
  const pixels = Buffer.alloc((width * 3 + 1) * height);
  const pixel = (x, y, color) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const offset = Math.floor(y) * (width * 3 + 1) + 1 + Math.floor(x) * 3;
    pixels.set(color, offset);
  };
  const rect = (x, y, w, h, color) => {
    for (let row = Math.max(0, Math.floor(y)); row < Math.min(height, y + h); row += 1)
      for (let column = Math.max(0, Math.floor(x)); column < Math.min(width, x + w); column += 1)
        pixel(column, row, color);
  };
  const text = (label, x, y, scale = 3, color = INK) => {
    for (const [index, character] of [...label].entries()) {
      const rows = GLYPHS[character];
      if (!rows) continue;
      rows.forEach((bits, row) => {
        for (let column = 0; column < 5; column += 1)
          if (bits & (1 << (4 - column)))
            rect(x + (index * 6 + column) * scale, y + row * scale, scale, scale, color);
      });
    }
  };
  rect(0, 0, width, height, background);
  return { width, height, pixels, pixel, rect, text };
}

function encodePng({ width, height, pixels }) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(pixels)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function createArtwork() {
  const image = raster(1200, 800);
  image.rect(0, 0, 1200, 22, INK);
  image.text('PRINTREADY / DETAIL STUDY', 64, 66, 5);
  image.text('ORIGINAL DIGITAL ARTWORK - NOT A PRINT PROOF', 64, 123, 2);
  // Continuous RGB ramps, geometric hills and a sun provide color and edge detail.
  for (let y = 185; y < 485; y += 1) {
    for (let x = 64; x < 1136; x += 1) {
      const wave = 350 + 54 * Math.sin(x / 85);
      const color =
        y > wave
          ? [26 + Math.floor((x - 64) / 12), 91 + Math.floor((y - 185) / 5), 93]
          : [
              65 + Math.floor((x - 64) / 6),
              170 + Math.floor((y - 185) / 6),
              211 - Math.floor((x - 64) / 12),
            ];
      image.pixel(x, y, (x - 880) ** 2 + (y - 265) ** 2 < 50 ** 2 ? [250, 179, 58] : color);
    }
  }
  image.text('01 FINE LINES', 64, 530, 3);
  image.text('02 SMALL TYPE', 430, 530, 3);
  image.text('03 RGB PATCHES', 800, 530, 3);
  for (let x = 80; x < 356; x += 1) image.rect(x, 585, 1, 90, x % 2 ? PAPER : INK);
  image.text('READ THE DETAILS', 430, 590, 2);
  image.text('READ THE DETAILS', 430, 625, 1);
  image.text('1200 X 800 PX', 430, 660, 2);
  [
    [230, 62, 73],
    [20, 161, 179],
    [43, 91, 191],
    [245, 179, 55],
    [123, 71, 157],
  ].forEach((color, index) => image.rect(800 + index * 65, 585, 55, 90, color));
  image.text('1 PX RULES / PIXELS DO NOT INCREASE WHEN PLACED SMALLER', 64, 740, 2);
  return image;
}

function createBleedArtwork(bleed) {
  // 12 px/mm = 304.8 DPI. The PDF embeds exactly this preview bitmap.
  const inset = bleed ? 36 : 0;
  const image = raster(2520 + inset * 2, 3564 + inset * 2, INK);
  const { width, height } = image;
  image.rect(0, height * 0.56, width, height * 0.44, [214, 103, 61]);
  for (let y = 0; y < height; y += 1) {
    const x = Math.floor(width * 0.68 + Math.sin(y / 180) * width * 0.12);
    image.rect(x, y, width - x, 1, [33, 125 + Math.floor(y / 100), 143]);
  }
  image.text('PRINTREADY', inset + 180, inset + 240, 22, PAPER);
  image.text('EDGE STUDY', inset + 180, inset + 490, 14, PAPER);
  image.text('210 X 297 MM TRIM', inset + 180, inset + 720, 8, PAPER);
  image.rect(inset + 180, inset + 1160, 1720, 1220, PAPER);
  image.text('KEEP TEXT', inset + 280, inset + 1340, 18);
  image.text('INSIDE TRIM', inset + 280, inset + 1570, 16);
  image.text('EXTEND BACKGROUNDS', inset + 280, inset + 1920, 8);
  image.text('BEYOND THE CUT', inset + 280, inset + 2070, 8);
  image.text('DIGITAL TEACHING SAMPLE', inset + 180, inset + 3200, 8, PAPER);
  return image;
}

function createBookletPlan() {
  const image = raster(1200, 700);
  image.text('6 READER PAGES / 8 POSITIONS', 50, 48, 5);
  image.text('PLAN BLANKS BEFORE EXPORT - NOT PRESS IMPOSITION', 50, 105, 2);
  for (let index = 0; index < 8; index += 1) {
    const x = 50 + (index % 4) * 285;
    const y = 180 + Math.floor(index / 4) * 230;
    image.rect(x, y, 245, 190, index >= 6 ? [228, 225, 213] : [33, 125, 143]);
    image.text(String(index + 1), x + 26, y + 25, 9, index >= 6 ? INK : PAPER);
    image.text(
      index >= 6 ? 'BLANK' : index === 0 ? 'COVER' : 'CONTENT',
      x + 26,
      y + 132,
      3,
      index >= 6 ? INK : PAPER,
    );
  }
  image.text('2 SHEETS X 4 PAGES = 8 POSITIONS', 50, 650, 3);
  return image;
}

async function savePdf(name, configure) {
  const doc = await PDFDocument.create();
  doc.setCreationDate(FIXED_DATE);
  doc.setModificationDate(FIXED_DATE);
  await configure(doc);
  await writeFile(new URL(name, OUT), await doc.save({ useObjectStreams: false }));
}

await mkdir(OUT, { recursive: true });

const artwork = createArtwork();
const png = encodePng(artwork);
await writeFile(new URL('printready-rgb-1200x800.png', OUT), png);

const a4Preview = raster(1200, 848, [255, 255, 255]);
artwork.pixels.copy(a4Preview.pixels, 24 * (1200 * 3 + 1));
await writeFile(new URL('printready-a4-rgb-preview.png', OUT), encodePng(a4Preview));
await writeFile(new URL('printready-booklet-plan.png', OUT), encodePng(createBookletPlan()));

await savePdf('printready-a4-rgb-low-resolution.pdf', async (doc) => {
  const page = doc.addPage([mm(297), mm(210)]);
  const image = await doc.embedPng(png);
  const width = page.getWidth();
  const height = (image.height * width) / image.width;
  page.drawImage(image, { x: 0, y: (page.getHeight() - height) / 2, width, height });
});

await savePdf('printready-rgb-100mm-corrected.pdf', async (doc) => {
  const page = doc.addPage([mm(100), mm(200 / 3)]);
  const image = await doc.embedPng(png);
  page.drawImage(image, { x: 0, y: 0, width: mm(100), height: mm(200 / 3) });
});

for (const bleed of [false, true]) {
  const name = `printready-a4-${bleed ? '3mm-bleed' : 'no-bleed'}`;
  const pixels = encodePng(createBleedArtwork(bleed));
  await writeFile(new URL(`${name}-preview.png`, OUT), pixels);
  await savePdf(`${name}.pdf`, async (doc) => {
    const width = bleed ? 216 : 210;
    const height = bleed ? 303 : 297;
    const page = doc.addPage([mm(width), mm(height)]);
    const image = await doc.embedPng(pixels);
    page.drawImage(image, { x: 0, y: 0, width: mm(width), height: mm(height) });
    if (bleed) {
      page.setTrimBox(mm(3), mm(3), mm(210), mm(297));
      page.setBleedBox(0, 0, mm(216), mm(303));
    }
  });
}

await writeFile(
  new URL('booklet-scenarios.json', OUT),
  `${JSON.stringify(
    [
      { pages: 6, paddedPages: 8, blanks: 2, sheets: 2 },
      { pages: 8, paddedPages: 8, blanks: 0, sheets: 2 },
      { pages: 12, paddedPages: 12, blanks: 0, sheets: 3 },
    ],
    null,
    2,
  )}\n`,
);
