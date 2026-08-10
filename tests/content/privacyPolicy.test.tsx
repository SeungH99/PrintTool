import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PrivacyPage from '@/app/[locale]/privacy/page';

describe('privacy policy', () => {
  it('renders the Korean policy with the required Google advertising disclosures', async () => {
    const result = await PrivacyPage({ params: Promise.resolve({ locale: 'ko' }) });
    render(result);

    const article = screen.getByRole('article');
    expect(
      within(article).getByRole('heading', { level: 1, name: '개인정보 처리방침' }),
    ).toBeVisible();
    expect(
      within(article).queryByRole('heading', { name: 'PRIVACY POLICY' }),
    ).not.toBeInTheDocument();

    const adsenseSection = within(article)
      .getByRole('heading', { level: 2, name: 'Google AdSense 및 광고 쿠키' })
      .closest('section');
    expect(adsenseSection).not.toBeNull();
    expect(adsenseSection).toHaveTextContent(/Google을 포함한 제3자 광고 제공업체.*쿠키/);
    expect(adsenseSection).toHaveTextContent(/이 사이트 또는 다른 웹사이트의 이전 방문/);
    expect(adsenseSection).toHaveTextContent(/웹 비콘.*IP 주소/);
    expect(
      within(adsenseSection as HTMLElement).getByRole('link', { name: 'Google 광고 설정' }),
    ).toHaveAttribute('href', 'https://adssettings.google.com/');
    expect(
      within(adsenseSection as HTMLElement).getByRole('link', {
        name: 'Google 파트너 사이트 데이터 사용 안내',
      }),
    ).toHaveAttribute('href', 'https://policies.google.com/technologies/partner-sites?hl=ko');
  });

  it('renders the English policy with the required Google advertising disclosures', async () => {
    const result = await PrivacyPage({ params: Promise.resolve({ locale: 'en' }) });
    render(result);

    const article = screen.getByRole('article');
    expect(
      within(article).getByRole('heading', { level: 1, name: 'Privacy Policy' }),
    ).toBeVisible();
    const adsenseSection = within(article)
      .getByRole('heading', { level: 2, name: 'Google AdSense and advertising cookies' })
      .closest('section');
    expect(adsenseSection).not.toBeNull();
    expect(adsenseSection).toHaveTextContent(/third-party vendors, including Google, use cookies/i);
    expect(adsenseSection).toHaveTextContent(/prior visits to this website or other websites/i);
    expect(adsenseSection).toHaveTextContent(/web beacons or IP addresses/i);
    expect(
      within(adsenseSection as HTMLElement).getByRole('link', { name: 'Google Ads Settings' }),
    ).toHaveAttribute('href', 'https://adssettings.google.com/');
    expect(
      within(adsenseSection as HTMLElement).getByRole('link', {
        name: 'How Google uses data on partner sites',
      }),
    ).toHaveAttribute('href', 'https://policies.google.com/technologies/partner-sites');
  });
});
