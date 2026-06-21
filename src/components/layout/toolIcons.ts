import {
  FileText,
  Image,
  BookOpen,
  Briefcase,
  Columns2,
  LayoutGrid,
  Repeat,
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
};
