import { test, expect } from '@playwright/test';

test('redirects the root to the default locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ko$/);
});

test('renders the KO home and switches to EN', async ({ page }) => {
  await page.goto('/ko');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('인쇄소에 보내기 전');

  await page.getByRole('link', { name: 'EN' }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('print shop');
});

test('resolution calculator computes size and downgrades on low DPI', async ({ page }) => {
  await page.goto('/ko/res');
  await expect(page.getByText(/25\.4 × 20\.3 cm/)).toBeVisible();
  await expect(page.getByText('고품질', { exact: true })).toBeVisible();

  await page.getByLabel('목표 해상도 (DPI)').fill('100');
  await expect(page.getByText('해상도 부족', { exact: true })).toBeVisible();
});

test('a real tool route resolves (spine)', async ({ page }) => {
  const res = await page.goto('/ko/spine');
  expect(res?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('책등');
});

test('unknown tool returns 404', async ({ page }) => {
  const res = await page.goto('/ko/zzz');
  expect(res?.status()).toBe(404);
});

test('header tools menu opens and navigates to a tool', async ({ page }) => {
  await page.goto('/ko');
  const header = page.getByRole('banner'); // scope to the header (home also has tool cards)
  await header.getByRole('button', { name: /도구/ }).click();
  await header.getByRole('link', { name: /인쇄용 PDF 변환/ }).click();
  await expect(page).toHaveURL(/\/ko\/convert$/);
});

test('a calculator shows an error message on invalid input', async ({ page }) => {
  await page.goto('/ko/res');
  await page.getByLabel('가로 (픽셀)').fill('-5');
  await expect(page.getByText('모든 값은 0보다 큰 숫자여야 합니다.')).toBeVisible();
});
