import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CookieSettingsButton } from '@/components/layout/CookieSettingsButton';

describe('CookieSettingsButton', () => {
  afterEach(() => {
    delete (window as typeof window & { googlefc?: unknown }).googlefc;
    delete (window as typeof window & { __tcfapi?: unknown }).__tcfapi;
  });

  function installGoogleCmp(gdprApplies: boolean) {
    const showRevocationMessage = vi.fn();
    const push = vi.fn((entry: { CONSENT_API_READY: () => void }) => entry.CONSENT_API_READY());
    (window as typeof window & { googlefc?: unknown }).googlefc = {
      callbackQueue: { push },
      showRevocationMessage,
    };
    (window as typeof window & { __tcfapi?: unknown }).__tcfapi = vi.fn(
      (
        _command: string,
        _version: number,
        callback: (data: { gdprApplies: boolean }, success: boolean) => void,
      ) => callback({ gdprApplies }, true),
    );
    return { push, showRevocationMessage };
  }

  function clickWithoutNavigation(link: HTMLElement) {
    let componentPreventedDefault = false;
    const stopNavigation = (event: MouseEvent) => {
      componentPreventedDefault = event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener('click', stopNavigation, { once: true });
    fireEvent.click(link);
    return componentPreventedDefault;
  }

  it('provides a real privacy-policy fallback when the regional CMP API is unavailable', () => {
    render(
      <CookieSettingsButton
        label="Cookie settings"
        privacyHref="/en/privacy#consent-and-cookie-settings"
      />,
    );

    expect(screen.getByRole('link', { name: 'Cookie settings' })).toHaveAttribute(
      'href',
      '/en/privacy#consent-and-cookie-settings',
    );
  });

  it('keeps the privacy fallback when the TCF API says GDPR does not apply', () => {
    const { push, showRevocationMessage } = installGoogleCmp(false);
    render(
      <CookieSettingsButton
        label="Cookie settings"
        privacyHref="/en/privacy#consent-and-cookie-settings"
      />,
    );

    const componentPreventedDefault = clickWithoutNavigation(
      screen.getByRole('link', { name: 'Cookie settings' }),
    );
    expect(push).toHaveBeenCalledOnce();
    expect(showRevocationMessage).not.toHaveBeenCalled();
    expect(componentPreventedDefault).toBe(false);
  });

  it('opens Google privacy options when the ready TCF API says GDPR applies', () => {
    const { push, showRevocationMessage } = installGoogleCmp(true);
    render(
      <CookieSettingsButton
        label="Cookie settings"
        privacyHref="/en/privacy#consent-and-cookie-settings"
      />,
    );

    const componentPreventedDefault = clickWithoutNavigation(
      screen.getByRole('link', { name: 'Cookie settings' }),
    );
    expect(push).toHaveBeenCalledOnce();
    expect(showRevocationMessage).toHaveBeenCalledOnce();
    expect(componentPreventedDefault).toBe(true);
  });
});
