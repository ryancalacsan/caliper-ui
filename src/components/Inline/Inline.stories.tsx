import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect } from 'storybook/test';
import { Inline } from './Inline';

const GAPS = ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        padding: 'var(--space-2xs) var(--space-sm)',
        background: 'var(--color-primary-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

const meta = {
  title: 'Layout/Inline',
  component: Inline,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Horizontal flex layout with a token-driven `gap`. Wraps by default, ' +
          'so a row of chips or buttons flows to the next line instead of ' +
          'overflowing.',
      },
    },
  },
  tags: ['autodocs'],
  args: { gap: 'sm', wrap: true },
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
    wrap: { control: 'boolean' },
  },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Inline {...args}>
      {['Design', 'Tokens', 'Accessible', 'SCSS', 'BEM', 'Two themes'].map(
        (t) => (
          <Chip key={t}>{t}</Chip>
        ),
      )}
    </Inline>
  ),
};

/** With `wrap={false}` the row stays on one line and can overflow. */
export const NoWrap: Story = {
  args: { wrap: false },
  render: (args) => (
    <Inline {...args}>
      {['One', 'Two', 'Three', 'Four'].map((t) => (
        <Chip key={t}>{t}</Chip>
      ))}
    </Inline>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('.inline');
    await expect(row).toHaveClass('inline--nowrap');
  },
};
