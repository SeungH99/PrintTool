import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolsMenu } from '@/components/layout/ToolsMenu';

const groups = [
  {
    label: '검수·변환',
    tools: [
      { id: 'pdf', title: 'PDF 인쇄 파일 검사', desc: 'pdf 설명', tag: '프리플라이트' },
      { id: 'convert', title: '인쇄용 PDF 변환', desc: 'convert 설명', tag: '변환' },
    ],
  },
];

describe('ToolsMenu', () => {
  it('keeps the tool list collapsed until opened', () => {
    render(<ToolsMenu locale="ko" label="도구" groups={groups} />);
    expect(screen.getByRole('button', { name: /도구/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('인쇄용 PDF 변환')).not.toBeInTheDocument();
  });

  it('reveals every tool as a locale-aware link when opened', () => {
    render(<ToolsMenu locale="ko" label="도구" groups={groups} />);
    fireEvent.click(screen.getByRole('button', { name: /도구/ }));
    expect(screen.getByRole('button', { name: /도구/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /인쇄용 PDF 변환/ })).toHaveAttribute(
      'href',
      '/ko/convert',
    );
    expect(screen.getByRole('link', { name: /PDF 인쇄 파일 검사/ })).toHaveAttribute(
      'href',
      '/ko/pdf',
    );
  });

  it('collapses again after a tool is chosen', () => {
    render(<ToolsMenu locale="ko" label="도구" groups={groups} />);
    fireEvent.click(screen.getByRole('button', { name: /도구/ }));
    fireEvent.click(screen.getByRole('link', { name: /인쇄용 PDF 변환/ }));
    expect(screen.getByRole('button', { name: /도구/ })).toHaveAttribute('aria-expanded', 'false');
  });
});
