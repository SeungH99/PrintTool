import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';

const OUT = new URL('../public/samples/', import.meta.url);
const MM_TO_PT = 72 / 25.4;
const FIXED_DATE = new Date('2026-08-09T00:00:00.000Z');
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

function createRgbPng() {
  const width = 1200;
  const height = 800;
  const pixels = Buffer.alloc((width * 3 + 1) * height);
  for (let row = 0; row < height; row += 1) {
    const start = row * (width * 3 + 1);
    pixels[start] = 0;
    for (let column = start + 1; column < start + 1 + width * 3; column += 3) {
      pixels[column] = 25;
      pixels[column + 1] = 102;
      pixels[column + 2] = 172;
    }
  }

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

async function savePdf(name, configure) {
  const doc = await PDFDocument.create();
  doc.setCreationDate(FIXED_DATE);
  doc.setModificationDate(FIXED_DATE);
  await configure(doc);
  await writeFile(new URL(name, OUT), await doc.save({ useObjectStreams: false }));
}

await mkdir(OUT, { recursive: true });

const png = createRgbPng();
await writeFile(new URL('printready-rgb-1200x800.png', OUT), png);

await savePdf('printready-a4-rgb-low-resolution.pdf', async (doc) => {
  const page = doc.addPage([mm(297), mm(210)]);
  const image = await doc.embedPng(png);
  const width = page.getWidth();
  page.drawImage(image, { x: 0, y: 0, width, height: (image.height * width) / image.width });
});

await savePdf('printready-a4-no-bleed.pdf', (doc) => {
  doc.addPage([mm(210), mm(297)]);
});

await savePdf('printready-a4-3mm-bleed.pdf', (doc) => {
  const page = doc.addPage([mm(216), mm(303)]);
  page.setTrimBox(mm(3), mm(3), mm(210), mm(297));
  page.setBleedBox(0, 0, mm(216), mm(303));
});

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
