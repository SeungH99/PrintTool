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
  default: ({ id }: { id?: string }) => <span data-testid={id ?? 'external-script'} />,
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
});
