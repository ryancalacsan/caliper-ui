import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect } from 'storybook/test';
import { Spacer } from './Spacer';

const GAPS = ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

function Box({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--space-sm) var(--space-md)',
        background: 'var(--color-primary-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text)',
      }}
    >
      {children}
    </div>
  );
}

const meta = {
  title: 'Layout/Spacer',
  component: Spacer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A decorative spacing element for the rare case a gap on the parent ' +
          'will not do. Hidden from assistive tech. Prefer a `Stack`/`Inline` ' +
          'gap where you can.',
      },
    },
  },
  tags: ['autodocs'],
  args: { size: 'lg', axis: 'block' },
  argTypes: {
    size: { control: 'select', options: GAPS },
    axis: { control: 'inline-radio', options: ['block', 'inline'] },
  },
} satisfies Meta<typeof Spacer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Block: Story = {
  args: { axis: 'block', size: 'xl' },
  render: (args) => (
    <div>
      <Box>Above</Box>
      <Spacer {...args} />
      <Box>Below</Box>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const spacer = canvasElement.querySelector('.spacer');
    await expect(spacer).toHaveClass('spacer--block-xl');
    await expect(spacer).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Inline: Story = {
  args: { axis: 'inline', size: 'lg' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Box>Left</Box>
      <Spacer {...args} />
      <Box>Right</Box>
    </div>
  ),
};
