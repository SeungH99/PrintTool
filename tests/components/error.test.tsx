import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({ usePathname: () => '/ko' }));

import LocaleError from '@/app/[locale]/error';

describe('locale error boundary', () => {
  it('renders the error message and retries via reset()', () => {
    const reset = vi.fn();
    render(<LocaleError error={new Error('boom')} reset={reset} />);
    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
