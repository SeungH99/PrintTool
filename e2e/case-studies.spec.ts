import { expect, test, type Page } from '@playwright/test';

const slugs = [
  'print-file-prep',
  'resolution-and-dpi',
  'cmyk-vs-rgb',
  'bleed-and-trim',
  'saddle-stitch-booklet',
] as const;

const toolIds = [
  'pdf',
  'convert',
  'res',
  'spine',
  'weight',
  'fold',
  'label',
  'bleed',
  'size',
  'gsm',
  'booklet',
  'nup',
  'grommet',
  'color',
  'impose',
  'marks',
  'proof',
] as const;

function collectSiteErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => {
    const text = message.text();
    const thirdPartyAdFrameReport =
      text.includes("Framing 'https://ep2.adtrafficquality.google/'") &&
      text.includes('report-only Content Security Policy');
    if (/data-nscript/i.test(text) || (message.type() === 'error' && !thirdPartyAdFrameReport)) {
      errors.push(text);
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

for (const locale of ['ko', 'en'] as const) {
  for (const slug of slugs) {
    test(`${locale} ${slug} publishes reproducible evidence`, async ({ page }) => {
      const siteErrors = collectSiteErrors(page);
      const response = await page.goto(`/${locale}/guides/${slug}`);

      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('table')).toBeVisible();
      await expect(
        page.getByText(locale === 'ko' ? '검증 정보' : 'Verification details', { exact: true }),
      ).toBeVisible();

      const downloadLink = page.getByRole('link', { name: /다운로드|download/i }).first();
      const href = await downloadLink.getAttribute('href');
      const downloadName = await downloadLink.getAttribute('download');
      if (!href || !downloadName) throw new Error('missing sample download metadata');

      const sampleResponse = await page.request.get(href);
      expect(sampleResponse.ok()).toBe(true);

      const [download] = await Promise.all([page.waitForEvent('download'), downloadLink.click()]);
      expect(download.suggestedFilename()).toBe(downloadName);

      await expect(page.locator('script[src*="adsbygoogle.js"][data-nscript]')).toHaveCount(0);
      expect(siteErrors).toEqual([]);
    });
  }
}

test('local mobile smoke exposes four user-facing categories and all 17 tools', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/ko');
  await page.getByRole('button', { name: 'Menu' }).click();

  const menu = page.getByRole('dialog');
  // The home combines 검수 and 변환 into one user-facing category; the mobile
  // drawer renders those two labels separately while exposing the same four groups.
  for (const category of ['검수', '변환', '규격·해상도', '용지', '제작·터잡기']) {
    await expect(menu.getByText(category, { exact: true })).toBeVisible();
  }
  for (const toolId of toolIds) {
    await expect(menu.locator(`a[href="/ko/${toolId}"]`).first()).toBeVisible();
  }
});

test('local desktop smoke opens a featured evidence route without redirect', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en');
  await expect(page.locator('[data-testid="tool-category"]')).toHaveCount(4);
  await page
    .getByRole('link', { name: /From image to PDF preflight: a reproducible workflow/i })
    .click();
  await expect(page).toHaveURL('/en/guides/print-file-prep');
  await expect(page.locator('h1')).toHaveText(
    'From image to PDF preflight: a reproducible workflow',
  );
});
