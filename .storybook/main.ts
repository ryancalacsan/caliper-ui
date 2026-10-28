import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    // GFM tables in MDX docs (e.g. the Design tokens page) need remark-gfm;
    // addon-docs does not enable it by default, so pipe tables render as raw text.
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
  // Serve the static build under a base path when one is provided (production
  // hosts Storybook at /storybook). Local `npm run storybook` stays at root.
  viteFinal: (viteConfig) => {
    if (process.env.STORYBOOK_BASE_PATH) {
      viteConfig.base = process.env.STORYBOOK_BASE_PATH;
    }
    return viteConfig;
  },
};
export default config;
