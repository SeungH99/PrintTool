import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConsentScripts } from '@/components/ads/ConsentScripts';

const mocks = vi.hoisted(() => ({
  ensureAdSenseScript: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock('@/lib/ads/loadAdSense', () => ({
  ensureAdSenseScript: mocks.ensureAdSenseScript,
}));

vi.mock('next/navigation', () => ({
  usePathname: mocks.usePathname,
}));

vi.mock('next/script', () => ({
  default: ({ id, src, strategy }: { id?: string; src?: string; strategy?: string }) => (
    <span data-testid={id ?? 'external-script'} data-src={src} data-strategy={strategy} />
  ),
}));

describe('ConsentScripts', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT', 'ca-pub-test');
    vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-TEST');
    mocks.ensureAdSenseScript.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not host consent-requiring Google tags on privacy-policy pages', () => {
    mocks.usePathname.mockReturnValue('/ko/privacy');

    render(<ConsentScripts />);

    expect(mocks.ensureAdSenseScript).not.toHaveBeenCalled();
    expect(screen.queryByTestId('consent-mode-default')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ga-loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ga-init')).not.toBeInTheDocument();
  });

  it('keeps consent mode and configured tags on ordinary content pages', () => {
    mocks.usePathname.mockReturnValue('/ko/pdf');

    render(<ConsentScripts />);

    expect(mocks.ensureAdSenseScript).toHaveBeenCalledWith('ca-pub-test');
    expect(screen.getByTestId('consent-mode-default')).toBeInTheDocument();
    expect(screen.getByTestId('ga-loader')).toBeInTheDocument();
    expect(screen.getByTestId('ga-init')).toBeInTheDocument();
  });

  it('loads consent mode and Analytics when only GA is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT', '');
    vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-ONLY');
    mocks.usePathname.mockReturnValue('/en');

    render(<ConsentScripts />);

    expect(mocks.ensureAdSenseScript).not.toHaveBeenCalled();
    expect(screen.getByTestId('consent-mode-default')).toBeInTheDocument();
    expect(screen.getByTestId('ga-loader')).toHaveAttribute(
      'data-src',
      'https://www.googletagmanager.com/gtag/js?id=G-ONLY',
    );
    expect(screen.getByTestId('ga-loader')).toHaveAttribute('data-strategy', 'afterInteractive');
    expect(screen.getByTestId('ga-init')).toBeInTheDocument();
  });

  it('renders no Google tags when neither integration is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT', '');
    vi.stubEnv('NEXT_PUBLIC_GA_ID', '');
    mocks.usePathname.mockReturnValue('/en');

    render(<ConsentScripts />);

    expect(mocks.ensureAdSenseScript).not.toHaveBeenCalled();
    expect(screen.queryByTestId('consent-mode-default')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ga-loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ga-init')).not.toBeInTheDocument();
  });
});
