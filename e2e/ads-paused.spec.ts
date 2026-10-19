import { expect, test } from '@playwright/test';
import { installGoogleConsentFixture, openCookieChoices } from './helpers/consent';

test.skip(process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'false', 'Requires the ads-paused build.');

test('site-wide pause blocks every ad request despite saved advertising permission', async ({
  page,
}) => {
  await installGoogleConsentFixture(page);
  await page.addInitScript(() => {
    localStorage.setItem('printready.consent', JSON.stringify({ ads: true, analytics: true }));
  });
  const adRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/pagead/js/adsbygoogle.js')) adRequests.push(request.url());
  });

  for (const path of ['/ko', '/ko/pdf', '/en/guides/print-file-prep']) {
    await page.goto(path);
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);
    await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);
    await expect(page.locator('ins.adsbygoogle')).toHaveCount(0);
    await expect(page.locator('meta[name="google-adsense-account"]')).toHaveAttribute(
      'content',
      'ca-pub-0000000000000000',
    );
  }
  expect(adRequests).toEqual([]);
});

test('accepting optional cookies while paused enables only Analytics, and the pause survives reload', async ({
  page,
}) => {
  await installGoogleConsentFixture(page);
  await page.goto('/en');
  await page
    .getByRole('region', { name: 'Cookie choices' })
    .getByRole('button', { name: 'Accept optional', exact: true })
    .click();
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);

  const choices = await openCookieChoices(page, 'en');
  await expect(choices.getByRole('checkbox', { name: 'Advertising', exact: true })).toBeDisabled();
  await expect(
    choices.getByRole('checkbox', { name: 'Advertising', exact: true }),
  ).not.toBeChecked();
  await expect(choices.getByRole('checkbox', { name: 'Analytics', exact: true })).toBeChecked();
  await expect(choices.getByText('Advertising is currently paused on this site.')).toBeVisible();
  await choices.getByRole('button', { name: 'Close', exact: true }).click();
  await page.reload();
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('printready.consent')!)),
  ).toEqual({ ads: false, analytics: true });
});
