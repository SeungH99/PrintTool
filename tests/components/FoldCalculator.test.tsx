import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FoldCalculator } from '@/components/calculators/FoldCalculator';
import { ko } from '@/i18n/dictionaries/ko';

const props = { dict: ko, locale: 'ko', eyebrow: '접지', title: '접지 규격 계산', desc: '설명' };

describe('FoldCalculator', () => {
  it('shows letter-fold panel widths for the defaults (297mm, 2mm inner)', () => {
    render(<FoldCalculator {...props} />);
    // outer 100, inner 97, outer 100
    expect(screen.getAllByText('100.0 mm')).toHaveLength(2);
    expect(screen.getByText('97.0 mm')).toBeInTheDocument();
  });

  it('shows an error when the inner adjustment collapses a panel', () => {
    render(<FoldCalculator {...props} />);
    fireEvent.change(screen.getByLabelText('안쪽 패널 보정 (mm)'), { target: { value: '200' } });
    expect(screen.getByText('안쪽 패널 보정값이 패널 너비보다 큽니다.')).toBeInTheDocument();
  });
});
