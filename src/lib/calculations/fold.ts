import type { FoldInput, FoldResult } from './types';
import { validateFold } from './validate';

interface PanelWidth {
  w: number;
  shorter: boolean;
}

/**
 * Panel widths for a folded piece. Geometry only (no heuristics): inward-folding
 * panels are narrowed by `innerMm` so the paper folds cleanly, and the panel
 * widths always sum back to the finished width.
 */
export function calculateFold(input: FoldInput): FoldResult {
  const v = validateFold(input);
  if (!v.ok) throw new RangeError(v.error);
  const { widthMm: W, type, innerMm } = input;
  let widths: PanelWidth[];

  switch (type) {
    case 'half':
      widths = [
        { w: W / 2, shorter: false },
        { w: W / 2, shorter: false },
      ];
      break;
    case 'zfold':
      widths = [
        { w: W / 3, shorter: false },
        { w: W / 3, shorter: false },
        { w: W / 3, shorter: false },
      ];
      break;
    case 'letter': {
      const inner = W / 3 - innerMm;
      const outer = (W - inner) / 2;
      widths = [
        { w: outer, shorter: false },
        { w: inner, shorter: true },
        { w: outer, shorter: false },
      ];
      break;
    }
    case 'roll': {
      const base = W / 4;
      widths = [
        { w: base + innerMm * 1.5, shorter: false },
        { w: base + innerMm * 0.5, shorter: false },
        { w: base - innerMm * 0.5, shorter: true },
        { w: base - innerMm * 1.5, shorter: true },
      ];
      break;
    }
    default: {
      const exhaustive: never = type;
      throw new Error(`unknown fold type: ${String(exhaustive)}`);
    }
  }

  return {
    panels: widths.map((x, i) => ({ index: i + 1, widthMm: x.w, shorter: x.shorter })),
  };
}
