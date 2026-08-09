import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const preflightSample = fileURLToPath(
  new URL('../public/samples/printready-a4-rgb-low-resolution.pdf', import.meta.url),
);

// End-to-end: upload a real PDF and confirm the in-browser preflight pipeline
// (pdf-lib structure + pdf.js DPI) produces a report — the browser path that
// Node unit tests can't cover.
test('PDF preflight reports the committed A4 landscape RGB sample risks', async ({ page }) => {
  await page.goto('/ko/pdf');

  await page.locator('input[type="file"]').setInputFiles(preflightSample);

  await expect(page.getByText('검사 결과', { exact: true })).toBeVisible({ timeout: 20000 });
  await expect(page.getByText('페이지 크기', { exact: true })).toBeVisible();
  await expect(page.getByText(/297\.0 × 210\.0 mm · 1 페이지/)).toBeVisible();

  const reportRow = (label: string) =>
    page.getByText(label, { exact: true }).locator('xpath=../..');

  await expect(reportRow('색상 모드')).toContainText(/rgb/i);
  await expect(reportRow('색상 모드')).toContainText('미설정');
  await expect(reportRow('이미지 해상도')).toContainText('102.6 DPI');
  await expect(reportRow('이미지 해상도')).toContainText('미설정');
  await expect(reportRow('재단선 (Trim Box)')).toContainText('미설정');
  await expect(reportRow('재단 여백 (Bleed Box)')).toContainText('미설정');
});
