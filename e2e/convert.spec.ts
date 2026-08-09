import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const sourceImage = fileURLToPath(
  new URL('../public/samples/printready-rgb-1200x800.png', import.meta.url),
);

// End-to-end: the browser-only convert path (file → canvas/pdf-lib → Blob URL →
// download) that Node unit tests on the pure cores can't exercise.
test('convert turns an uploaded image into a downloadable print PDF', async ({ page }) => {
  await page.goto('/ko/convert');

  await page.locator('input[type="file"]').setInputFiles(sourceImage);

  await expect(page.getByText('변환 설정', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '인쇄용 PDF로 변환' }).click();

  await expect(page.getByText('변환 완료', { exact: true })).toBeVisible({ timeout: 20000 });

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: 'PDF 다운로드' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('printready-rgb-1200x800-print.pdf');
});

test('convert accepts a WebP image (createImageBitmap decode path)', async ({ page }) => {
  await page.goto('/ko/convert');

  // 1×1 lossless WebP — exercises the WebP→createImageBitmap→canvas→PNG branch
  // that the PNG fixture above doesn't reach.
  const webp = Buffer.from('UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==', 'base64');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'art.webp',
    mimeType: 'image/webp',
    buffer: webp,
  });

  await expect(page.getByText('변환 설정', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '인쇄용 PDF로 변환' }).click();
  await expect(page.getByText('변환 완료', { exact: true })).toBeVisible({ timeout: 20000 });
});
