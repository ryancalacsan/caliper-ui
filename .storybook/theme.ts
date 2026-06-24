import { create } from 'storybook/theming';

// Brands the Storybook chrome in the Spec Sheet aesthetic: paper, ink, and the
// signal accent. Values mirror the light theme tokens in
// src/tokens/_colors.scss. Burnt orange is used where the accent sits on paper
// (it clears contrast there; the vivid signal does not).
export default create({
  base: 'light',

  brandTitle: 'Bespoke — design system',
  brandTarget: '_self',

  colorPrimary: '#b83400',
  colorSecondary: '#b83400',

  // Paper surfaces
  appBg: '#f3f1ea',
  appContentBg: '#faf8f2',
  appPreviewBg: '#f3f1ea',
  appBorderColor: '#c7c2b2',
  appBorderRadius: 2,

  // Ink text
  textColor: '#16140f',
  textInverseColor: '#faf8f2',
  textMutedColor: '#565144',

  // Toolbar
  barBg: '#f3f1ea',
  barTextColor: '#565144',
  barSelectedColor: '#b83400',
  barHoverColor: '#b83400',

  // Inputs
  inputBg: '#fffdf7',
  inputBorder: '#322f26',
  inputTextColor: '#16140f',
  inputBorderRadius: 2,

  fontBase:
    '"Hanken Grotesk Variable", system-ui, -apple-system, sans-serif',
  fontCode: '"Geist Mono Variable", ui-monospace, monospace',
});
