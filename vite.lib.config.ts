import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-preserve-directives';

// Library build, kept entirely separate from the app/Storybook build (which
// owns `dist/` and is what Vercel deploys). Output goes to `lib/`.
//
// Notes:
// - React is external (a peerDependency); the consumer's copy is used.
// - preserveModules keeps each component its own file, so the per-component
//   "use client" directives survive (Button stays server-renderable, the
//   interactive components are client). rollup-preserve-directives keeps the
//   directive banners.
// - This emits lib/caliper.css with the tokens, reset, and component styles, but
//   lib mode prunes the @fontsource @font-face rules; scripts/build-fonts.mjs
//   inlines the webfonts and prepends them afterward.
export default defineConfig({
  plugins: [
    react(),
    preserveDirectives(),
    dts({
      // The root tsconfig is references-only (files: []), so point dts at the
      // app config that actually includes src.
      tsconfigPath: 'tsconfig.app.json',
      include: ['src'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.*',
        'src/App.tsx',
        'src/main.tsx',
        'src/foundations/**',
        'tests/**',
      ],
      outDir: 'lib',
      entryRoot: 'src',
    }),
  ],
  build: {
    outDir: 'lib',
    // Cleaned by the build:lib script instead - emptyOutDir races with the dts
    // plugin and wipes the declarations it writes mid-build.
    emptyOutDir: false,
    copyPublicDir: false,
    cssCodeSplit: false,
    sourcemap: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom/client',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith('.css')
            ? 'caliper.css'
            : 'assets/[name][extname]',
      },
    },
  },
});
