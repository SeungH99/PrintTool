import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MobileNav } from '@/components/layout/MobileNav';
import { ko } from '@/i18n/dictionaries/ko';

describe('MobileNav', () => {
  it('portals the fixed dialog outside the backdrop-filter header', () => {
    render(
      <div data-testid="header-shell">
        <MobileNav locale="ko" dict={ko} />
      </div>,
    );
    fireEvent.click(screen.getByRole('button', { name: ko.nav.menu }));

    const headerShell = screen.getByTestId('header-shell');
    const dialog = screen.getByRole('dialog', { name: ko.nav.menu });
    expect(headerShell).not.toContainElement(dialog);
    expect(dialog.parentElement).toBe(document.body);
  });

  it('groups every tool once under four user-facing headings', () => {
    render(<MobileNav locale="ko" dict={ko} />);
    fireEvent.click(screen.getByRole('button', { name: '도구 메뉴' }));

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
    fireEvent.click(screen.getByRole('button', { name: '도구 메뉴' }));
    expect(screen.getByRole('link', { name: '인쇄용 PDF 변환' })).toHaveAttribute(
      'href',
      '/ko/convert',
    );
  });

  it('closes the drawer after a tool is selected', () => {
    render(<MobileNav locale="ko" dict={ko} />);
    fireEvent.click(screen.getByRole('button', { name: '도구 메뉴' }));
    const link = screen.getByRole('link', { name: '인쇄용 PDF 변환' });
    link.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(link);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('names the dialog, traps focus, closes on Escape, and restores the trigger', () => {
    render(<MobileNav locale="ko" dict={ko} />);
    const trigger = screen.getByRole('button', { name: '도구 메뉴' });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: '도구 메뉴' });
    const close = within(dialog).getByRole('button', { name: '메뉴 닫기' });
    expect(close).toHaveFocus();

    const focusable = within(dialog).getAllByRole('link');
    focusable.at(-1)?.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();

    close.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(focusable.at(-1)).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
