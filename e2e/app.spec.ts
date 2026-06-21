import { test, expect } from '@playwright/test';

test('redirects the root to the default locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ko$/);
});

test('renders the KO home and switches to EN', async ({ page }) => {
  await page.goto('/ko');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('인쇄소에 보내기 전');

  await page.getByRole('button', { name: '언어 선택' }).click();
  await page.getByRole('link', { name: 'English' }).click();
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

test('page responses carry baseline security headers', async ({ page }) => {
  const res = await page.goto('/ko');
  const h = res?.headers() ?? {};
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['strict-transport-security']).toContain('max-age=');
  expect(h['permissions-policy']).toContain('camera=()');
  expect(h['content-security-policy-report-only']).toContain("default-src 'self'");
});

test('mobile nav drawer opens and navigates to a tool', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/ko');
  await page.getByRole('button', { name: 'Menu' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('link', { name: '인쇄용 PDF 변환' }).click();
  await expect(page).toHaveURL(/\/ko\/convert$/);
});

test('serves a web manifest and JSON-LD structured data', async ({ page }) => {
  const m = await page.goto('/manifest.webmanifest');
  expect(m?.status()).toBe(200);
  await page.goto('/ko');
  expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
  await page.goto('/ko/spine');
  expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
});

test('exposes an OG image', async ({ page }) => {
  await page.goto('/ko');
  expect(await page.locator('meta[property="og:image"]').count()).toBeGreaterThan(0);
});

test('the OG image is served directly, not locale-redirected', async ({ page }) => {
  const res = await page.goto('/opengraph-image');
  expect(res?.status()).toBe(200);
  expect(res?.headers()['content-type']).toContain('image/png');
});

test('serves security.txt', async ({ page }) => {
  const res = await page.goto('/.well-known/security.txt');
  expect(res?.status()).toBe(200);
});

test('ads.txt carries the publisher line', async ({ page }) => {
  const res = await page.request.get('/ads.txt');
  expect(res.status()).toBe(200);
  expect(await res.text()).toMatch(/google\.com,\s*pub-7142354312657545,\s*DIRECT/);
});

test('privacy page renders the policy with a cookies section', async ({ page }) => {
  const res = await page.goto('/ko/privacy');
  expect(res?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'PRIVACY POLICY', level: 1 })).toBeVisible();
  await expect(page.locator('#cookies')).toBeVisible();
});
