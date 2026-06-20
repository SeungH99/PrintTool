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
