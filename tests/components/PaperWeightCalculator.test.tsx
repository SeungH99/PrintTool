import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaperWeightCalculator } from '@/components/calculators/PaperWeightCalculator';
import { ko } from '@/i18n/dictionaries/ko';

const props = { dict: ko, locale: 'ko', eyebrow: '평량', title: '종이 무게 계산', desc: '설명' };

describe('PaperWeightCalculator', () => {
  it('computes total and per-sheet weight for A4 defaults', () => {
    render(<PaperWeightCalculator {...props} />);
    // A4 100gsm x 500 -> total 3.12 kg, per sheet 6.24 g
    expect(screen.getByText('3.12 kg')).toBeInTheDocument();
    expect(screen.getByText('6.24 g')).toBeInTheDocument();
  });

  it('disables dimension inputs for a preset size', () => {
    render(<PaperWeightCalculator {...props} />);
    expect(screen.getByLabelText('가로 (mm)')).toBeDisabled();
  });
});
