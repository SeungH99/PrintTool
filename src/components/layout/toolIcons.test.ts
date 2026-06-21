import { describe, it, expect } from 'vitest';
import { getDictionary } from '@/i18n/dictionaries';
import { TOOL_ICONS } from './toolIcons';

describe('TOOL_ICONS', () => {
  it('maps every tool id to a lucide icon', () => {
    for (const tool of getDictionary('ko').tools) {
      expect(TOOL_ICONS[tool.id], `missing icon for ${tool.id}`).toBeDefined();
    }
  });
});
