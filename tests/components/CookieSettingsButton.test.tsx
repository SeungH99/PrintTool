import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieSettingsButton } from '@/components/layout/CookieSettingsButton';
import { ConsentPreferences } from '@/components/ads/ConsentPreferences';
import { CONSENT_STORAGE_KEY } from '@/lib/consent/consent';

function controls(locale: 'en' | 'ko' = 'en') {
  return render(
    <>
      <CookieSettingsButton
        label={locale === 'en' ? 'Cookie settings' : '쿠키 설정'}
        privacyHref={`/${locale}/privacy#consent-and-cookie-settings`}
      />
      <ConsentPreferences locale={locale} />
    </>,
  );
}

describe('working local cookie controls', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'true');
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT', 'ca-pub-test');
  });
  afterEach(() => {
    for (const key of ['googlefc', '__tcfapi']) Reflect.deleteProperty(window, key);
    Reflect.deleteProperty(navigator, 'globalPrivacyControl');
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('provides equal reject, accept and customize actions without blocking the page', () => {
    controls();
    const notice = screen.getByRole('region', { name: 'Cookie choices' });
    expect(within(notice).getByRole('button', { name: 'Reject optional' })).toBeVisible();
    expect(within(notice).getByRole('button', { name: 'Accept optional' })).toBeVisible();
    expect(within(notice).getByRole('button', { name: 'Customize' })).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps the advertising choice disabled while allowing Analytics during the site pause', () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'false');
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ads: true, analytics: false }));
    controls();
    fireEvent.click(screen.getByRole('button', { name: 'Cookie settings' }));
    const dialog = screen.getByRole('dialog', { name: 'Cookie choices' });
    const advertising = within(dialog).getByRole('checkbox', { name: 'Advertising' });
    expect(advertising).toBeDisabled();
    expect(advertising).not.toBeChecked();
    expect(within(dialog).getByText('Advertising is currently paused on this site.')).toBeVisible();

    fireEvent.click(within(dialog).getByRole('checkbox', { name: 'Analytics' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Save choices' }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toEqual({
      ads: false,
      analytics: true,
    });
  });

  it('persists rejection, stays dismissed after remount, and reopens from the footer', () => {
    const first = controls();
    fireEvent.click(screen.getByRole('button', { name: 'Reject optional' }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toEqual({
      ads: false,
      analytics: false,
    });
    expect(screen.queryByRole('region', { name: 'Cookie choices' })).not.toBeInTheDocument();
    first.unmount();
    controls();
    expect(screen.queryByRole('region', { name: 'Cookie choices' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cookie settings' }));
    const dialog = screen.getByRole('dialog', { name: 'Cookie choices' });
    expect(within(dialog).getByRole('checkbox', { name: 'Analytics' })).not.toBeChecked();
    expect(within(dialog).getByRole('checkbox', { name: 'Advertising' })).not.toBeChecked();
  });

  it('saves Analytics independently from Advertising', () => {
    controls();
    fireEvent.click(screen.getByRole('button', { name: 'Customize' }));
    const dialog = screen.getByRole('dialog', { name: 'Cookie choices' });
    fireEvent.click(within(dialog).getByRole('checkbox', { name: 'Analytics' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Save choices' }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toEqual({
      ads: false,
      analytics: true,
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('accepts both optional categories only on explicit action', () => {
    controls();
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Accept optional' }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toEqual({
      ads: true,
      analytics: true,
    });
  });

  it('uses Korean accessible controls without relying on English dictionaries', () => {
    controls('ko');
    fireEvent.click(screen.getByRole('button', { name: '직접 선택' }));
    const dialog = screen.getByRole('dialog', { name: '쿠키 선택' });
    fireEvent.click(within(dialog).getByRole('checkbox', { name: '분석' }));
    fireEvent.click(within(dialog).getByRole('button', { name: '선택 저장' }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toEqual({
      ads: false,
      analytics: true,
    });
  });

  it('closes on Escape and returns focus to the settings button', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, '{"ads":false,"analytics":false}');
    controls();
    const button = screen.getByRole('button', { name: 'Cookie settings' });
    button.focus();
    fireEvent.click(button);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('keeps focus within the customized dialog', () => {
    controls();
    fireEvent.click(screen.getByRole('button', { name: 'Customize' }));
    const dialog = screen.getByRole('dialog');
    const buttons = within(dialog).getAllByRole('button');
    const last = within(dialog).getByRole('link', { name: 'Privacy policy' });
    last.focus();
    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(buttons[0]).toHaveFocus();
  });

  it('does not claim that a choice was saved when storage is unavailable', () => {
    controls();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reject optional' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/could not save/i);
    expect(screen.getByRole('region', { name: 'Cookie choices' })).toBeVisible();
  });

  it('explains the GPC override and prevents local opt-in controls', () => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true });
    controls();
    expect(screen.getByText(/Global Privacy Control.*off/i)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Customize' }));
    expect(screen.getByRole('checkbox', { name: 'Analytics' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Advertising' })).toBeDisabled();
  });

  it('offers a Google regional controls action without replacing it with local grants', () => {
    const showRevocationMessage = vi.fn();
    Object.assign(window, {
      googlefc: {
        callbackQueue: {
          push: (entry: Record<string, () => void>) =>
            Object.values(entry).forEach((callback) => callback()),
        },
        showRevocationMessage,
        getGoogleConsentModeValues: () => ({
          adStoragePurposeConsentStatus: 2,
          adUserDataPurposeConsentStatus: 2,
          adPersonalizationPurposeConsentStatus: 2,
          analyticsStoragePurposeConsentStatus: 2,
        }),
      },
      __tcfapi: (
        command: string,
        _version: number,
        callback: (data: unknown, success: boolean) => void,
      ) => {
        if (command === 'addEventListener') callback({ gdprApplies: true }, true);
      },
    });
    controls();
    fireEvent.click(screen.getByRole('button', { name: 'Customize' }));
    fireEvent.click(screen.getByRole('button', { name: 'Google regional choices' }));
    expect(showRevocationMessage).toHaveBeenCalledOnce();
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });

  it('honestly reports pending/unavailable Google consent instead of claiming optional tags are active', () => {
    vi.useFakeTimers();
    controls();
    fireEvent.click(screen.getByRole('button', { name: 'Customize' }));
    expect(screen.getByRole('dialog')).toHaveTextContent(/stay off while Google checks/i);
    act(() => vi.advanceTimersByTime(8000));
    expect(screen.getByRole('dialog')).toHaveTextContent(/not ready.*remain off/i);
    vi.useRealTimers();
  });
});
