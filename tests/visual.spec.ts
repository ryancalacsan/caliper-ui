import { test, expect } from '@playwright/test';

/**
 * One representative story per component, snapshotted in both themes. The story
 * is loaded through Storybook's iframe with the theme set via the URL global,
 * so the same render path the toolbar uses also drives the test.
 */
const stories = [
  { id: 'components-button--gallery', name: 'button-gallery' },
  { id: 'components-textfield--error-state', name: 'textfield-error' },
  { id: 'components-checkbox--select-all-group', name: 'checkbox-select-all' },
  {
    id: 'components-radiogroup--with-per-option-help',
    name: 'radiogroup-help',
  },
  { id: 'components-select--with-selected-value', name: 'select-value' },
  { id: 'components-tabs--default', name: 'tabs-default' },
  { id: 'components-tooltip--placements', name: 'tooltip-placements' },
  // Layout primitives
  { id: 'layout-stack--default', name: 'layout-stack' },
  { id: 'layout-grid--fixed-columns', name: 'layout-grid' },
  { id: 'layout-divider--vertical', name: 'layout-divider' },
  // Typography
  { id: 'typography-heading--scale', name: 'typography-heading' },
  { id: 'typography-prose--default', name: 'typography-prose' },
  { id: 'typography-mark--in-heading', name: 'typography-mark' },
  // Content & data display
  { id: 'content-card--composed', name: 'content-card' },
  { id: 'content-callout--tones', name: 'content-callout' },
  { id: 'content-badge--tones', name: 'content-badge' },
  { id: 'content-badge--shapes', name: 'content-badge-shapes' },
  { id: 'content-stat--strip', name: 'content-stat' },
  { id: 'content-statgroup--strip', name: 'content-statgroup' },
  { id: 'content-card--fill-grid', name: 'content-card-fill' },
  { id: 'content-card--horizontal', name: 'content-card-horizontal' },
  // Spec Sheet motifs
  { id: 'motifs-crosshair--sizes', name: 'motifs-crosshair' },
  { id: 'motifs-frame--default', name: 'motifs-frame' },
  { id: 'motifs-gridbackdrop--default', name: 'motifs-gridbackdrop' },
  { id: 'motifs-sheetheader--default', name: 'motifs-sheetheader' },
  { id: 'motifs-dimensionline--horizontal', name: 'motifs-dimensionline' },
  { id: 'motifs-measureframe--default', name: 'motifs-measureframe' },
  { id: 'motifs-frame--marks', name: 'motifs-frame-marks' },
  // Navigation & chrome
  { id: 'chrome-appheader--default', name: 'chrome-appheader' },
  { id: 'chrome-navlink--nav', name: 'chrome-navlink' },
  { id: 'chrome-link--default', name: 'chrome-link' },
  { id: 'chrome-link--plain', name: 'chrome-link-plain' },
];

const themes = ['light', 'dark'] as const;

for (const story of stories) {
  for (const theme of themes) {
    test(`${story.name} (${theme})`, async ({ page }) => {
      await page.goto(
        `/iframe.html?id=${story.id}&globals=theme:${theme}&viewMode=story`,
      );

      // Wait for the story to mount and the theme decorator to apply.
      await page.locator('#storybook-root').waitFor({ state: 'visible' });
      await page.waitForFunction(
        (t) => document.documentElement.dataset.theme === t,
        theme,
      );
      // Avoid font-swap flicker in the snapshot.
      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveScreenshot(`${story.name}-${theme}.png`, {
        fullPage: true,
      });
    });
  }
}
