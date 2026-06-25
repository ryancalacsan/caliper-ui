import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { GridBackdrop } from './GridBackdrop';

const meta = {
  title: 'Motifs/GridBackdrop',
  component: GridBackdrop,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Paints the blueprint grid behind its content - the Spec Sheet backing ' +
          'texture. A wrapper, so content sits on top with no extra markup.',
      },
    },
  },
  tags: ['autodocs'],
  args: { size: 'grid' },
  argTypes: {
    size: { control: 'inline-radio', options: ['grid', 'grid-fine'] },
  },
} satisfies Meta<typeof GridBackdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <GridBackdrop {...args} style={{ padding: 'var(--space-3xl)' }}>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
        }}
      >
        Content on the blueprint grid
      </p>
    </GridBackdrop>
  ),
  play: async ({ canvasElement }) => {
    const el = within(canvasElement).getByText('Content on the blueprint grid');
    await expect(el.closest('.grid-backdrop')).toHaveClass(
      'grid-backdrop--grid',
    );
  },
};
