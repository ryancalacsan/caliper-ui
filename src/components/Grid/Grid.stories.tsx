import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect } from 'storybook/test';
import { Grid } from './Grid';

const GAPS = ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

function Cell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--space-md)',
        background: 'var(--color-primary-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text)',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

const cells = Array.from({ length: 6 }, (_, i) => i + 1);

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CSS grid with a token-driven `gap`. Pass `columns` for a fixed grid, ' +
          'or `minItemWidth` for a responsive auto-fitting one with no media ' +
          'queries.',
      },
    },
  },
  tags: ['autodocs'],
  args: { gap: 'md', columns: 3 },
  argTypes: {
    gap: { control: 'select', options: GAPS },
    columns: { control: { type: 'number', min: 1, max: 6 } },
    minItemWidth: { control: 'text' },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FixedColumns: Story = {
  args: { columns: 3 },
  render: (args) => (
    <Grid {...args}>
      {cells.map((n) => (
        <Cell key={n}>{n}</Cell>
      ))}
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('.grid');
    await expect(grid).toHaveClass('grid--fixed');
    await expect(grid).toHaveStyle({ '--grid-columns': '3' });
  },
};

/** Responsive: as many ~12rem columns as fit, no media queries. */
export const Responsive: Story = {
  args: { columns: undefined, minItemWidth: '12rem' },
  render: (args) => (
    <Grid {...args}>
      {cells.map((n) => (
        <Cell key={n}>{n}</Cell>
      ))}
    </Grid>
  ),
};
