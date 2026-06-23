import type { Preview } from '@storybook/react-vite'
// Load the typefaces + token layer + reset so every story renders on the real
// foundation.
import '../src/styles/fonts'
import '../src/styles/global.scss'
import { withTheme } from './withTheme'

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo'  - surface a11y violations in the addon panel (visible, not gated)
      // 'error' - fail the test run on violations
      // 'off'   - skip checks
      test: 'todo',
    },
  },
}

export default preview
