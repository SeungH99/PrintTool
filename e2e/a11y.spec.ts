import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Automated accessibility scan (axe-core) on representative pages. Catches WCAG
// violations (contrast, names, roles, landmarks) and guards against regressions.
const paths = ['/ko', '/en', '/ko/res', '/ko/pdf', '/ko/convert', '/ko/privacy'];

for (const path of paths) {
  test(`a11y: ${path} has no detectable axe violations`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
  });
}
