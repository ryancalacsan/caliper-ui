import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { within, expect } from 'storybook/test';
import { Stack } from './Stack';

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
  title: 'Layout/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Vertical flex layout with a token-driven `gap`. Reach for it instead ' +
          'of margins when you want consistent vertical rhythm between elements.',
      },
    },
  },
  tags: ['autodocs'],
  args: { gap: 'md' },
  argTypes: {
    gap: { control: 'select', options: GAPS },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around'],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
    </Stack>
  ),
};

/** `as` renders any element - here a real list, so the gap applies to `<li>`s. */
export const AsList: Story = {
  args: { as: 'ul', gap: 'sm' },
  render: (args) => (
    <Stack {...args} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <li>
        <Box>Item as li</Box>
      </li>
      <li>
        <Box>Item as li</Box>
      </li>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ul.stack');
    await expect(list).not.toBeNull();
    await expect(list).toHaveClass('stack--gap-sm');
    await expect(within(canvasElement).getAllByRole('listitem')).toHaveLength(
      2,
    );
  },
};
