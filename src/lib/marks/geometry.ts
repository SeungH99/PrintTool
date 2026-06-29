import { MM_TO_PT } from '@/lib/convert/page-geometry';

export interface MarksOptions {
  /** Distance the marks sit outside the trim before they start, in mm (bleed allowance). */
  bleedMm: number;
  /** Extra gap between the bleed edge and the mark, in mm. */
  offsetMm: number;
  /** Length of each crop mark, in mm. */
  lengthMm: number;
  /** Draw corner crop/trim marks. */
  crop: boolean;
  /** Draw registration targets at the edge midpoints. */
  registration: boolean;
}

export interface MarkLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface MarkCircle {
  cx: number;
  cy: number;
  r: number;
}

export interface MarksGeometry {
  /** Margin added on every side of the trim to hold the marks, in points. */
  marginPt: number;
  /** Straight segments (crop marks + registration crosshairs), in page points. */
  lines: MarkLine[];
  /** Registration target circles, in page points. */
  circles: MarkCircle[];
}

const REG_RADIUS_MM = 3;

/**
 * Printer-mark geometry for a trim box that occupies 0..pw × 0..ph in the page's
 * own coordinate space. Marks are emitted in that same space (extending into
 * negative / beyond-trim coordinates), so the caller draws them directly on the
 * page after enlarging its MediaBox — which keeps marks aligned through any
 * page /Rotate without extra math. Pure: no pdf-lib, no React; unit-tested.
 */
export function computeMarks(pwPt: number, phPt: number, opts: MarksOptions): MarksGeometry {
  const out = (opts.bleedMm + opts.offsetMm) * MM_TO_PT;
  const len = opts.lengthMm * MM_TO_PT;
  const regR = REG_RADIUS_MM * MM_TO_PT;
  const marginPt = Math.max(out + len, opts.registration ? regR * 2.4 : 0);

  const lines: MarkLine[] = [];
  const circles: MarkCircle[] = [];

  if (opts.crop) {
    // Two marks per corner: one tracks the vertical trim edge, one the horizontal.
    const corners: { x: number; y: number; sx: number; sy: number }[] = [
      { x: 0, y: 0, sx: -1, sy: -1 },
      { x: pwPt, y: 0, sx: 1, sy: -1 },
      { x: 0, y: phPt, sx: -1, sy: 1 },
      { x: pwPt, y: phPt, sx: 1, sy: 1 },
    ];
    for (const c of corners) {
      // Vertical mark at the trim x, extending outward in y.
      lines.push({ x1: c.x, y1: c.y + c.sy * out, x2: c.x, y2: c.y + c.sy * (out + len) });
      // Horizontal mark at the trim y, extending outward in x.
      lines.push({ x1: c.x + c.sx * out, y1: c.y, x2: c.x + c.sx * (out + len), y2: c.y });
    }
  }

  if (opts.registration) {
    const cl = regR * 1.4;
    const centers: { cx: number; cy: number }[] = [
      { cx: pwPt / 2, cy: -marginPt / 2 },
      { cx: pwPt / 2, cy: phPt + marginPt / 2 },
      { cx: -marginPt / 2, cy: phPt / 2 },
      { cx: pwPt + marginPt / 2, cy: phPt / 2 },
    ];
    for (const c of centers) {
      circles.push({ cx: c.cx, cy: c.cy, r: regR });
      lines.push({ x1: c.cx - cl, y1: c.cy, x2: c.cx + cl, y2: c.cy });
      lines.push({ x1: c.cx, y1: c.cy - cl, x2: c.cx, y2: c.cy + cl });
    }
  }

  return { marginPt, lines, circles };
}
