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
  'proof',
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
  { key: 'convert', ids: ['convert', 'color', 'proof'] },
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

// Cross-category neighbours used to top up the related list (so single-tool
// categories like preflight still link out, and topical clusters read well).
const EXTRA_RELATED: Partial<Record<ToolId, ToolId[]>> = {
  pdf: ['bleed', 'color', 'marks'],
  res: ['size', 'pdf'],
  size: ['res', 'bleed'],
  color: ['proof', 'convert', 'pdf'],
  proof: ['color', 'convert', 'pdf'],
  convert: ['color', 'proof', 'pdf'],
  bleed: ['marks', 'impose', 'pdf'],
  marks: ['bleed', 'impose', 'pdf'],
  impose: ['nup', 'marks', 'bleed'],
  spine: ['booklet', 'weight'],
  booklet: ['spine', 'impose'],
};

/** The category a tool belongs to (for breadcrumbs / grouping). */
export function categoryOf(id: ToolId): ToolCategoryKey | undefined {
  return TOOL_CATEGORIES.find((c) => (c.ids as readonly string[]).includes(id))?.key;
}

/** Up to `max` related tool ids for internal linking: category siblings first, topped up by curated neighbours. */
export function relatedToolIds(id: ToolId, max = 4): ToolId[] {
  const cat = TOOL_CATEGORIES.find((c) => (c.ids as readonly string[]).includes(id));
  const siblings = cat ? cat.ids.filter((x) => x !== id) : [];
  const seen = new Set<string>([id]);
  const out: ToolId[] = [];
  for (const x of [...siblings, ...(EXTRA_RELATED[id] ?? [])]) {
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x as ToolId);
    if (out.length >= max) break;
  }
  return out;
}
