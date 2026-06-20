import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpineCalculator } from '@/components/calculators/SpineCalculator';
import { ko } from '@/i18n/dictionaries/ko';

const props = { dict: ko, locale: 'ko', eyebrow: '제본', title: '책등 두께 계산', desc: '설명' };

describe('SpineCalculator', () => {
  it('shows the estimated spine for perfect-binding defaults', () => {
    render(<SpineCalculator {...props} />);
    // 200pp, interior 100, cover 250 -> 13.23 mm
    expect(screen.getByText('13.23 mm')).toBeInTheDocument();
  });

  it('warns when the page count is not a multiple of 4', () => {
    render(<SpineCalculator {...props} />);
    fireEvent.change(screen.getByLabelText('페이지 수'), { target: { value: '201' } });
    expect(screen.getByRole('alert')).toHaveTextContent(ko.calc.spine.warn);
  });
});
