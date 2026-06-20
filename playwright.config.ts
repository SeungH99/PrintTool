import { defineConfig, devices } from '@playwright/test';

// E2E specs live in ./e2e (Vitest unit tests live in ./tests and ./src).
// Requires a production build first: `npm run build` (webServer runs `npm run start`).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000/ko',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
