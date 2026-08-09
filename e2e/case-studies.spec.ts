import { expect, test, type Page } from '@playwright/test';

const TEST_ADSENSE_CLIENT = 'ca-pub-0000000000000000';

const slugs = [
  'print-file-prep',
  'resolution-and-dpi',
  'cmyk-vs-rgb',
  'bleed-and-trim',
  'saddle-stitch-booklet',
] as const;

const sampleCounts = {
  'print-file-prep': 2,
  'resolution-and-dpi': 1,
  'cmyk-vs-rgb': 1,
  'bleed-and-trim': 2,
  'saddle-stitch-booklet': 1,
} as const;

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
      await page.route('https://pagead2.googlesyndication.com/**', async (route) => {
        await route.fulfill({ contentType: 'application/javascript', body: '' });
      });
      const response = await page.goto(`/${locale}/guides/${slug}`);

      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('table')).toBeVisible();
      await expect(
        page.getByText(locale === 'ko' ? '검증 정보' : 'Verification details', { exact: true }),
      ).toBeVisible();

      const downloadLinks = page.getByRole('link', { name: /다운로드|download/i });
      const downloadCount = await downloadLinks.count();
      expect(downloadCount).toBe(sampleCounts[slug]);
      for (let index = 0; index < downloadCount; index += 1) {
        const downloadLink = downloadLinks.nth(index);
        const href = await downloadLink.getAttribute('href');
        const downloadName = await downloadLink.getAttribute('download');
        if (!href || !downloadName) throw new Error('missing sample download metadata');

        const sampleResponse = await page.request.get(href);
        expect(sampleResponse.ok()).toBe(true);

        const [download] = await Promise.all([page.waitForEvent('download'), downloadLink.click()]);
        expect(download.suggestedFilename()).toBe(downloadName);
        expect(await download.failure()).toBeNull();
        expect(await download.path()).not.toBeNull();
      }

      await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(1);
      const adSenseScript = page.locator('script[data-printready-adsense][src*="adsbygoogle.js"]');
      await expect(adSenseScript).toHaveCount(1);
      expect(
        await adSenseScript.evaluate((script: HTMLScriptElement) => ({
          async: script.async,
          client: new URL(script.src).searchParams.get('client'),
          crossOrigin: script.crossOrigin,
          dataNscript: script.getAttribute('data-nscript'),
        })),
      ).toEqual({
        async: true,
        client: TEST_ADSENSE_CLIENT,
        crossOrigin: 'anonymous',
        dataNscript: null,
      });
      expect(siteErrors).toEqual([]);
    });
  }
}

test('local mobile smoke exposes four localized categories and all 17 tools', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const locales = [
    {
      locale: 'ko',
      headings: ['검수 · 변환', '규격·해상도', '용지', '제작·터잡기'],
    },
    {
      locale: 'en',
      headings: ['Preflight · Convert', 'Size & resolution', 'Paper', 'Production'],
    },
  ] as const;

  for (const { locale, headings } of locales) {
    await page.goto(`/${locale}`);
    await page.getByRole('button', { name: 'Menu' }).click();

    const toolGroups = page.getByTestId('mobile-tool-groups');
    await expect(toolGroups.getByRole('heading')).toHaveText([...headings]);
    for (const toolId of toolIds) {
      await expect(page.getByRole('dialog').locator(`a[href="/${locale}/${toolId}"]`)).toHaveCount(
        1,
      );
    }
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
