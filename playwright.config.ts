import { defineConfig, devices } from '@playwright/test';

const TEST_ADSENSE_CLIENT = 'ca-pub-0000000000000000';

// E2E specs live in ./e2e (Vitest unit tests live in ./tests and ./src).
// The web server creates an isolated production build with the test AdSense client.
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
    command: 'npm run build && npm run start',
    env: {
      NEXT_PUBLIC_ADSENSE_CLIENT: TEST_ADSENSE_CLIENT,
      NEXT_PUBLIC_ADSENSE_ENABLED: process.env.NEXT_PUBLIC_ADSENSE_ENABLED ?? 'true',
      NEXT_PUBLIC_GA_ID: 'G-PRINTREADYTEST',
    },
    url: 'http://localhost:3000/ko',
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
