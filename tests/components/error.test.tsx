import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({ usePathname: () => '/ko' }));
const mocks = vi.hoisted(() => ({ hardReload: vi.fn() }));
vi.mock('@/lib/consent/pageReload', () => ({ hardReload: mocks.hardReload }));

import LocaleError from '@/app/[locale]/error';
import GlobalError from '@/app/global-error';

describe('locale error boundary', () => {
  it('renders the error message and retries via reset()', () => {
    const reset = vi.fn();
    render(<LocaleError error={new Error('boom')} reset={reset} />);
    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(reset).toHaveBeenCalledOnce();
  });
});

describe('global crash boundary after the locale layout unmounts', () => {
  beforeEach(() => {
    mocks.hardReload.mockReset();
    vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-TEST');
  });
  afterEach(() => {
    cleanup();
    for (const key of [
      '__printreadyAdsLoaded',
      '__printreadyAnalyticsLoaded',
      '__printreadyAnalyticsAllowed',
      '__printreadyShutdownPending',
      'ga-disable-G-TEST',
      'gtag',
    ])
      Reflect.deleteProperty(window, key);
    vi.unstubAllEnvs();
    if (!document.body) document.documentElement.innerHTML = '<head></head><body></body>';
  });

  it('denies inherited optional runtimes and reloads even after their loader elements are gone', () => {
    const commands: unknown[][] = [];
    Object.assign(window, {
      __printreadyAdsLoaded: true,
      __printreadyAnalyticsLoaded: true,
      __printreadyAnalyticsAllowed: true,
      gtag: (...args: unknown[]) => commands.push(args),
    });
    render(<GlobalError error={new Error('root crash')} reset={vi.fn()} />, {
      container: document,
    });
    expect(commands).toContainEqual([
      'consent',
      'update',
      {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      },
    ]);
    expect(
      (window as typeof window & { __printreadyAnalyticsAllowed: boolean })
        .__printreadyAnalyticsAllowed,
    ).toBe(false);
    expect((window as typeof window & { 'ga-disable-G-TEST': boolean })['ga-disable-G-TEST']).toBe(
      true,
    );
    expect(mocks.hardReload).toHaveBeenCalledOnce();
  });

  it('does not loop by reloading a fresh crash document with no prior optional runtime', () => {
    render(<GlobalError error={new Error('root crash')} reset={vi.fn()} />, {
      container: document,
    });
    expect(mocks.hardReload).not.toHaveBeenCalled();
    expect(
      document.querySelectorAll(
        'script[src*="adsbygoogle.js"],script[src*="gtag/js"],ins.adsbygoogle',
      ),
    ).toHaveLength(0);
  });

  it('only reloads once if a global error remounts before the browser finishes the reload', () => {
    Object.assign(window, { __printreadyAdsLoaded: true });
    render(<GlobalError error={new Error('root crash')} reset={vi.fn()} />, {
      container: document,
    });
    cleanup();
    if (!document.body) document.documentElement.innerHTML = '<head></head><body></body>';
    render(<GlobalError error={new Error('root crash')} reset={vi.fn()} />, {
      container: document,
    });
    expect(mocks.hardReload).toHaveBeenCalledOnce();
  });
});
