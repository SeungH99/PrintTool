import {
  FileText,
  Image,
  BookOpen,
  Briefcase,
  Columns2,
  LayoutGrid,
  Repeat,
  Crop,
  Ruler,
  Scale,
  BookCopy,
  Grid3x3,
  CircleDot,
  Palette,
  type LucideIcon,
} from 'lucide-react';

/**
 * Tool id → lucide icon. Shared by the home tool cards and the header ToolsMenu
 * so both stay in sync with the design (mirrors the .dc.html per-tool glyphs).
 */
export const TOOL_ICONS: Record<string, LucideIcon> = {
  pdf: FileText,
  res: Image,
  spine: BookOpen,
  weight: Briefcase,
  fold: Columns2,
  label: LayoutGrid,
  convert: Repeat,
  bleed: Crop,
  size: Ruler,
  gsm: Scale,
  booklet: BookCopy,
  nup: Grid3x3,
  grommet: CircleDot,
  color: Palette,
};
