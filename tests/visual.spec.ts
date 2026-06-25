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
