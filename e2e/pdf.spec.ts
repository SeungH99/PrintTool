import { test, expect } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

// End-to-end: upload a real PDF and confirm the in-browser preflight pipeline
// (pdf-lib structure + pdf.js DPI) produces a report — the browser path that
// Node unit tests can't cover.
test('PDF preflight analyzes an uploaded file in the browser', async ({ page }) => {
  await page.goto('/ko/pdf');

  const doc = await PDFDocument.create();
  doc.addPage([595.28, 841.89]); // A4
  const bytes = await doc.save();

  await page.locator('input[type="file"]').setInputFiles({
    name: 'sample.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(bytes),
  });

  await expect(page.getByText('검사 결과', { exact: true })).toBeVisible({ timeout: 20000 });
  await expect(page.getByText('페이지 크기', { exact: true })).toBeVisible();
  await expect(page.getByText(/210\.0 × 297\.0 mm/)).toBeVisible();
});

test('image resolution is detected in the browser (pdf.js runs without a worker)', async ({
  page,
}) => {
  await page.goto('/ko/pdf');

  const doc = await PDFDocument.create();
  const p = doc.addPage([595.28, 841.89]);
  // 1×1 PNG; the exact DPI matters less than that it's detected at all — a missing
  // pdf.js workerSrc used to silently null it out and show "감지 제한".
  const png = await doc.embedPng(
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    ),
  );
  p.drawImage(png, { x: 100, y: 100, width: 50, height: 50 });
  const bytes = await doc.save();

  await page.locator('input[type="file"]').setInputFiles({
    name: 'image.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(bytes),
  });

  await expect(page.getByText('이미지 해상도', { exact: true })).toBeVisible({ timeout: 20000 });
  // DPI detected → a "<n> DPI" detail renders (not the "감지 제한" badge).
  await expect(page.getByText(/\d+ DPI/)).toBeVisible();
});
