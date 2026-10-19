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

test('converted browser download is the exact file re-uploaded to PDF preflight', async ({
  page,
}, testInfo) => {
  await page.goto('/ko/convert');
  await page.locator('input[type="file"]').setInputFiles(sourceImage);
  await page.getByLabel('페이지 규격').selectOption('a4');
  await page.getByLabel('방향').selectOption('landscape');
  await page.getByRole('button', { name: '인쇄용 PDF로 변환' }).click();
  await expect(page.getByText('변환 완료', { exact: true })).toBeVisible({ timeout: 20000 });

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: 'PDF 다운로드' }).click(),
  ]);
  const convertedPdf = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(convertedPdf);
  expect(await download.failure()).toBeNull();

  await page.goto('/ko/pdf');
  await page.locator('input[type="file"]').setInputFiles(convertedPdf);
  await expect(page.getByText('검사 결과', { exact: true })).toBeVisible({ timeout: 20000 });

  const reportRow = (label: string) =>
    page.getByText(label, { exact: true }).locator('xpath=../..');
  await expect(reportRow('페이지 크기')).toContainText(/297\.0 × 210\.0 mm · 1 페이지/);
  await expect(reportRow('이미지 색상 분류')).toContainText('RGB / 비CMYK 검출');
  await expect(reportRow('이미지 해상도')).toContainText('102.6 DPI');
  await expect(reportRow('이미지 해상도')).toContainText('권장 DPI 미만');
  await expect(reportRow('재단선 (Trim Box)')).toContainText('박스 없음');
  await expect(reportRow('재단 여백 (Bleed Box)')).toContainText('박스 없음');
});
