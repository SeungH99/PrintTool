import { test, expect } from '@playwright/test';

test('redirects the root to the default locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ko$/);
});

test('renders the KO home and switches to EN', async ({ page }) => {
  await page.goto('/ko');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('인쇄소에 보내기 전');
  await expect(
    page.getByRole('heading', { name: /변환.*검사.*해결|convert.*check.*resolve/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /이미지에서 PDF 검사까지|From image to PDF preflight/i }),
  ).toBeVisible();
  await expect(page.locator('[data-testid="tool-category"]')).toHaveCount(4);

  await page.getByRole('button', { name: '언어 선택' }).click();
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('print shop');
  await expect(
    page.getByRole('heading', { name: /변환.*검사.*해결|convert.*check.*resolve/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /이미지에서 PDF 검사까지|From image to PDF preflight/i }),
  ).toBeVisible();
  await expect(page.locator('[data-testid="tool-category"]')).toHaveCount(4);
});

test('groups verified workflows before sourced references', async ({ page }) => {
  await page.goto('/ko/guides');

  const verified = page.getByRole('region', { name: '실전 검증 가이드' });
  const references = page.getByRole('region', { name: '출처 기반 참고 자료' });
  await expect(verified.getByRole('link')).toHaveCount(5);
  await expect(references.getByRole('link')).toHaveCount(2);
  await expect(verified.getByRole('link').first()).toHaveAttribute(
    'href',
    '/ko/guides/print-file-prep',
  );

  await page.goto('/en/guides');
  await expect(page.getByRole('region', { name: 'Verified workflows' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Sourced references' })).toBeVisible();
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
  await page.getByLabel('가로 (픽셀)').fill('0');
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
  await page.getByRole('button', { name: '도구 메뉴' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('link', { name: '인쇄용 PDF 변환' }).click();
  await expect(page).toHaveURL(/\/ko\/convert$/);
});

test('serves a web manifest without generic FAQ structured data on home', async ({ page }) => {
  const m = await page.goto('/manifest.webmanifest');
  expect(m?.status()).toBe(200);
  await page.goto('/ko');
  await expect(page.getByRole('heading', { name: '자주 묻는 질문' })).toHaveCount(0);
  const homeStructuredData = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(homeStructuredData.some((value) => value.includes('"FAQPage"'))).toBe(false);
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
