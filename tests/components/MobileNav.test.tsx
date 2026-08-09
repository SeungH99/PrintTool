import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNav } from '@/components/layout/MobileNav';
import { ko } from '@/i18n/dictionaries/ko';

describe('MobileNav', () => {
  it('groups every tool once under four user-facing headings', () => {
    render(<MobileNav locale="ko" dict={ko} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(['검수 · 변환', '규격·해상도', '용지', '제작·터잡기']);
    for (const tool of ko.tools) {
      expect(screen.getAllByRole('link', { name: tool.title })).toHaveLength(1);
      expect(document.querySelectorAll(`a[href="/ko/${tool.id}"]`)).toHaveLength(1);
    }
  });

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
