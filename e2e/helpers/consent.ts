import { expect, type Page } from '@playwright/test';

/** Model only Google's external readiness/consent boundary; all site UI and loaders stay real. */
export async function installGoogleConsentFixture(
  page: Page,
  { regulated = false, granted = true } = {},
) {
  await page.route('https://fundingchoicesmessages.google.com/**', async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `(() => {
        const fc = window.googlefc = window.googlefc || {};
        const waiting = fc.callbackQueue || [];
        fc.ConsentModePurposeStatusEnum = {
          CONSENT_MODE_PURPOSE_STATUS_UNKNOWN: 0,
          CONSENT_MODE_PURPOSE_STATUS_GRANTED: 1,
          CONSENT_MODE_PURPOSE_STATUS_DENIED: 2,
          CONSENT_MODE_PURPOSE_STATUS_NOT_APPLICABLE: 3,
          CONSENT_MODE_PURPOSE_STATUS_NOT_CONFIGURED: 4
        };
        fc.getGoogleConsentModeValues = () => ({
          adStoragePurposeConsentStatus: ${regulated ? (granted ? 1 : 2) : 3},
          adUserDataPurposeConsentStatus: ${regulated ? (granted ? 1 : 2) : 3},
          adPersonalizationPurposeConsentStatus: ${regulated ? (granted ? 1 : 2) : 3},
          analyticsStoragePurposeConsentStatus: ${regulated ? (granted ? 1 : 2) : 3}
        });
        window.__tcfapi = (command, version, callback) => {
          if (command === 'addEventListener') callback({
            gdprApplies: ${regulated}, listenerId: 1, eventStatus: 'tcloaded'
          }, true);
          else if (command === 'removeEventListener') callback({}, true);
        };
        const ready = (entry) => {
          entry.CONSENT_API_READY?.();
          entry.CONSENT_DATA_READY?.();
          entry.CONSENT_MODE_DATA_READY?.();
        };
        fc.callbackQueue = { push(entry) { ready(entry); return 1; } };
        for (const entry of waiting) ready(entry);
      })();`,
    });
  });
  await page.route('https://pagead2.googlesyndication.com/**', async (route) => {
    await route.fulfill({ contentType: 'application/javascript', body: '' });
  });
  await page.route('https://www.googletagmanager.com/**', async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `(() => {
        const layer = window.dataLayer = window.dataLayer || [];
        const received = window.__printreadyTestGoogleCommands = [];
        const consume = (message) => {
          if (Object.prototype.toString.call(message) === '[object Arguments]') {
            received.push(Array.from(message));
          }
        };
        layer.forEach(consume);
        const push = layer.push.bind(layer);
        layer.push = (...messages) => {
          messages.forEach(consume);
          return push(...messages);
        };
      })();`,
    });
  });
}

export async function openCookieChoices(page: Page, locale: 'ko' | 'en' = 'ko') {
  const dialog = page.getByRole('dialog', {
    name: locale === 'ko' ? '쿠키 선택' : 'Cookie choices',
  });
  const settings = page.getByRole('button', {
    name: locale === 'ko' ? '쿠키 설정' : 'Cookie settings',
    exact: true,
  });
  await expect(settings).toBeVisible();
  if (!(await dialog.isVisible())) await settings.click();
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function acceptOptionalCookies(page: Page, locale: 'ko' | 'en' = 'ko') {
  const notice = page.getByRole('region', {
    name: locale === 'ko' ? '쿠키 선택' : 'Cookie choices',
  });
  await expect(
    page.getByRole('button', {
      name: locale === 'ko' ? '쿠키 설정' : 'Cookie settings',
      exact: true,
    }),
  ).toBeVisible();
  if (await notice.isVisible()) {
    await notice
      .getByRole('button', {
        name: locale === 'ko' ? '선택 항목 허용' : 'Accept optional',
        exact: true,
      })
      .click();
    await expect(notice).not.toBeVisible();
    return;
  }
  const dialog = await openCookieChoices(page, locale);
  await dialog
    .getByRole('checkbox', { name: locale === 'ko' ? '분석' : 'Analytics', exact: true })
    .check();
  await dialog
    .getByRole('checkbox', { name: locale === 'ko' ? '광고' : 'Advertising', exact: true })
    .check();
  await dialog
    .getByRole('button', { name: locale === 'ko' ? '선택 저장' : 'Save choices', exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
}
