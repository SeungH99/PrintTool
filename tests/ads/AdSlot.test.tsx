import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdSlot } from '@/components/ads/AdSlot';
import { CONSENT_STORAGE_KEY } from '@/lib/consent/consent';

describe('AdSlot global advertising switch', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT', 'ca-pub-test');
    localStorage.setItem(CONSENT_STORAGE_KEY, '{"ads":true,"analytics":false}');
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    Reflect.deleteProperty(window, 'adsbygoogle');
    vi.unstubAllEnvs();
  });

  it.each([undefined, 'false', '', 'TRUE', '1', ' true '])(
    'renders nothing or queues no ad with saved acceptance when disabled (value: %s)',
    (value) => {
      vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', value);
      const { container } = render(<AdSlot label="Advertisement" note="Ad placeholder" />);

      expect(container).toBeEmptyDOMElement();
      expect(Reflect.get(window, 'adsbygoogle')).toBeUndefined();
    },
  );

  it('does not push to an inherited ad queue while disabled', () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'false');
    const queue: unknown[] = [];
    Object.assign(window, { adsbygoogle: queue });

    render(<AdSlot label="Advertisement" note="Ad placeholder" />);

    expect(queue).toEqual([]);
  });

  it('renders an ad and queues it when explicitly enabled with saved acceptance', () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'true');

    const { container } = render(<AdSlot label="Advertisement" note="Ad placeholder" />);

    expect(container.querySelector('ins.adsbygoogle')).toHaveAttribute(
      'data-ad-client',
      'ca-pub-test',
    );
    expect(Reflect.get(window, 'adsbygoogle')).toEqual([{}]);
  });

  it('does not render a placeholder while disabled even without saved acceptance', () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'false');
    localStorage.clear();

    const { container } = render(<AdSlot label="Advertisement" note="Ad placeholder" />);

    expect(container).toBeEmptyDOMElement();
    expect(Reflect.get(window, 'adsbygoogle')).toBeUndefined();
  });
});
