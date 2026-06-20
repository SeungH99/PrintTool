export const toolIds = ['pdf', 'convert', 'res', 'spine', 'weight', 'fold', 'label'] as const;

export type ToolId = (typeof toolIds)[number];

export function isToolId(value: string): value is ToolId {
  return (toolIds as readonly string[]).includes(value);
}
