import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LabelCalculator } from '@/components/calculators/LabelCalculator';
import { ko } from '@/i18n/dictionaries/ko';

const props = { dict: ko, locale: 'ko', eyebrow: '판수율', title: '라벨 배치 계산', desc: '설명' };

describe('LabelCalculator', () => {
  it('computes labels-per-sheet and the grid for the defaults', () => {
    render(<LabelCalculator {...props} />);
    // 210x297 sheet, 63.5x38.1 labels, 7mm margin, 2.5mm gap -> 3 cols x 7 rows = 21
    expect(screen.getByText('21 개')).toBeInTheDocument();
    expect(screen.getByText('7 × 3')).toBeInTheDocument();
  });

  it('shows a rotated badge when rotation helps', () => {
    render(<LabelCalculator {...props} />);
    fireEvent.change(screen.getByLabelText('라벨 가로 (mm)'), { target: { value: '38.1' } });
    fireEvent.change(screen.getByLabelText('라벨 세로 (mm)'), { target: { value: '63.5' } });
    fireEvent.click(screen.getByLabelText('라벨 회전 허용'));
    expect(screen.getByText('회전 배치 적용됨')).toBeInTheDocument();
  });

  it('shows an error when margins exceed the sheet', () => {
    render(<LabelCalculator {...props} />);
    fireEvent.change(screen.getByLabelText('용지 여백 (mm)'), { target: { value: '200' } });
    expect(screen.getByText('여백이 용지 크기보다 큽니다.')).toBeInTheDocument();
  });
});
