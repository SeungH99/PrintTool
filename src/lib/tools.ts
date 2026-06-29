export const toolIds = [
  'pdf',
  'convert',
  'res',
  'spine',
  'weight',
  'fold',
  'label',
  'bleed',
  'size',
  'gsm',
  'booklet',
  'nup',
  'grommet',
  'color',
  'impose',
  'marks',
] as const;

export type ToolId = (typeof toolIds)[number];

export function isToolId(value: string): value is ToolId {
  return (toolIds as readonly string[]).includes(value);
}

/**
 * Display grouping for the growing tool set (home grid + header/mobile menus).
 * Order is the display order; every tool id must appear in exactly one category.
 */
export const TOOL_CATEGORIES = [
  { key: 'preflight', ids: ['pdf'] },
  { key: 'convert', ids: ['convert', 'color'] },
  { key: 'size', ids: ['res', 'size'] },
  { key: 'paper', ids: ['weight', 'gsm', 'spine'] },
  {
    key: 'production',
    ids: ['bleed', 'fold', 'label', 'booklet', 'nup', 'impose', 'marks', 'grommet'],
  },
] as const;

export type ToolCategoryKey = (typeof TOOL_CATEGORIES)[number]['key'];

/** Group a list of tools (e.g. dict.tools) into ordered, non-empty categories. */
export function groupTools<T extends { id: string }>(
  tools: readonly T[],
): { key: ToolCategoryKey; tools: T[] }[] {
  const byId = new Map(tools.map((t) => [t.id, t]));
  return TOOL_CATEGORIES.map((cat) => ({
    key: cat.key,
    tools: cat.ids.map((id) => byId.get(id)).filter((t): t is T => Boolean(t)),
  })).filter((g) => g.tools.length > 0);
}
