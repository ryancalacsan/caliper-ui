import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression config. Each test loads a single story through Storybook's
 * iframe and compares a screenshot against a committed baseline, in both the
 * light and dark themes.
 *
 * Reduced motion is forced on so the spinner and transitions hold still, which
 * keeps the screenshots deterministic (and exercises the reduced-motion path).
 * Baselines are platform-specific: the file names carry the OS, so a run on a
 * different OS regenerates rather than fails. In CI, generate them with the
 * official Playwright container so they match.
 */
export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate:
    'tests/__screenshots__/{arg}-{projectName}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:6006',
    reducedMotion: 'reduce',
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      // Allow a hair of antialiasing noise without masking real changes.
      maxDiffPixelRatio: 0.01,
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run storybook -- --ci --quiet',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
