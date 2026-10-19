import { expect, test } from '@playwright/test';
import {
  acceptOptionalCookies,
  installGoogleConsentFixture,
  openCookieChoices,
} from './helpers/consent';

const optionalTags = 'script[src*="adsbygoogle.js"], script[src*="googletagmanager.com/gtag/js"]';

test('bilingual evidence pages fit 320px and 375px mobile viewports', async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812 });
    for (const locale of ['ko', 'en']) {
      for (const slug of ['print-file-prep', 'bleed-and-trim']) {
        await page.goto(`/${locale}/guides/${slug}`);
        await expect(page.locator('h1')).toBeVisible();
        const viewport = await page.evaluate(() => ({
          actual: document.documentElement.scrollWidth,
          available: window.innerWidth,
        }));
        expect(viewport.actual).toBeLessThanOrEqual(viewport.available);
      }
    }
  }
});

test('the corrected file downloaded from the case actually reaches 304.8 DPI', async ({ page }) => {
  await page.goto('/ko/guides/print-file-prep');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('a[href="/samples/printready-rgb-100mm-corrected.pdf"]').click(),
  ]);
  expect(await download.failure()).toBeNull();
  const file = await download.path();
  expect(file).not.toBeNull();
  await page.goto('/ko/pdf');
  await page.locator('input[type="file"]').setInputFiles(file!);
  await expect(page.getByText('검사 결과', { exact: true })).toBeVisible({ timeout: 25000 });
  const resolution = page.getByText('이미지 해상도', { exact: true }).locator('xpath=../..');
  await expect(resolution).toContainText('304.8 DPI');
  await expect(resolution).not.toContainText('미설정');
  await expect(page.getByText(/100\.0 × 66\.7 mm/)).toBeVisible();
});

test('visitors can reject, reopen, and choose only Analytics across reloads', async ({ page }) => {
  await installGoogleConsentFixture(page);
  await page.goto('/en');
  await page.waitForLoadState('networkidle');
  await expect(page.locator(optionalTags)).toHaveCount(0);

  await page
    .getByRole('region', { name: 'Cookie choices' })
    .getByRole('button', { name: 'Reject optional', exact: true })
    .click();
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.locator(optionalTags)).toHaveCount(0);

  const reopened = await openCookieChoices(page, 'en');
  await reopened.getByRole('checkbox', { name: 'Analytics', exact: true }).check();
  await reopened.getByRole('checkbox', { name: 'Advertising', exact: true }).uncheck();
  await reopened.getByRole('button', { name: 'Save choices', exact: true }).click();
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const commands =
          (window as Window & { __printreadyTestGoogleCommands?: unknown[][] })
            .__printreadyTestGoogleCommands ?? [];
        return commands.filter((command) => command[0] === 'config').map((command) => command[1]);
      }),
    )
    .toContain('G-PRINTREADYTEST');
  await page.reload();
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);

  const revoke = await openCookieChoices(page, 'en');
  await revoke.getByRole('checkbox', { name: 'Analytics', exact: true }).uncheck();
  await revoke.getByRole('checkbox', { name: 'Advertising', exact: true }).uncheck();
  await revoke.getByRole('button', { name: 'Save choices', exact: true }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator(optionalTags)).toHaveCount(0);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.locator(optionalTags)).toHaveCount(0);
});

for (const granted of [false, true]) {
  test(`regional Google ${granted ? 'acceptance allows' : 'rejection blocks'} locally accepted tags`, async ({
    page,
  }) => {
    await installGoogleConsentFixture(page, { regulated: true, granted });
    await page.goto('/ko');
    await acceptOptionalCookies(page);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(optionalTags)).toHaveCount(granted ? 2 : 0);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator(optionalTags)).toHaveCount(granted ? 2 : 0);
  });
}

test('GPC keeps both optional integrations off even with saved acceptance', async ({ page }) => {
  await installGoogleConsentFixture(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true });
    localStorage.setItem('printready.consent', JSON.stringify({ ads: true, analytics: true }));
  });
  await page.goto('/ko/pdf');
  await page.waitForLoadState('networkidle');
  await expect(page.locator(optionalTags)).toHaveCount(0);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.locator(optionalTags)).toHaveCount(0);
});

test('error and policy screens never request ads despite an accepted preference', async ({
  page,
}) => {
  await installGoogleConsentFixture(page);
  await page.addInitScript(() => {
    localStorage.setItem('printready.consent', JSON.stringify({ ads: true, analytics: true }));
  });
  const adRequests: string[] = [];
  const pageErrors: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/pagead/js/adsbygoogle.js')) adRequests.push(request.url());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  for (const [path, status] of [
    ['/ko/not-a-real-tool', 404],
    ['/en/guides/not-a-real-guide', 404],
    ['/ko/contact', 200],
    ['/en/terms', 200],
    ['/ko/privacy', 200],
  ] as const) {
    const response = await page.goto(path);
    await page.waitForLoadState('networkidle');
    expect(response?.status()).toBe(status);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator(optionalTags)).toHaveCount(0);
  }
  expect(adRequests).toEqual([]);
  expect(pageErrors).toEqual([]);
});
