import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResolutionCalculator } from '@/components/calculators/ResolutionCalculator';
import { ko } from '@/i18n/dictionaries/ko';

const props = {
  dict: ko,
  locale: 'ko',
  eyebrow: '해상도',
  title: '이미지 인쇄 크기 계산',
  desc: '설명',
};

describe('ResolutionCalculator', () => {
  it('shows the default print size and a high-quality badge', () => {
    render(<ResolutionCalculator {...props} />);
    // 3000 x 2400 @ 300 DPI in cm -> 25.4 x 20.3 cm
    expect(screen.getByText(/25\.4 × 20\.3 cm/)).toBeInTheDocument();
    expect(screen.getByText('고품질')).toBeInTheDocument();
  });

  it('downgrades the quality label when DPI drops below 150', () => {
    render(<ResolutionCalculator {...props} />);
    fireEvent.change(screen.getByLabelText('목표 해상도 (DPI)'), { target: { value: '100' } });
    expect(screen.getByText('해상도 부족')).toBeInTheDocument();
  });

  it('shows an error and hides the result on non-positive input', () => {
    render(<ResolutionCalculator {...props} />);
    fireEvent.change(screen.getByLabelText('가로 (픽셀)'), { target: { value: '0' } });
    expect(screen.getByText('모든 값은 0보다 큰 숫자여야 합니다.')).toBeInTheDocument();
  });
});
