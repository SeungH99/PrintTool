import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNav } from '@/components/layout/MobileNav';
import { ko } from '@/i18n/dictionaries/ko';

describe('MobileNav', () => {
  it('opens the drawer with the full tool list', () => {
    render(<MobileNav locale="ko" dict={ko} />);
    expect(screen.queryByText('인쇄용 PDF 변환')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('link', { name: '인쇄용 PDF 변환' })).toHaveAttribute(
      'href',
      '/ko/convert',
    );
  });

  it('closes the drawer after a tool is selected', () => {
    render(<MobileNav locale="ko" dict={ko} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    fireEvent.click(screen.getByRole('link', { name: '인쇄용 PDF 변환' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
