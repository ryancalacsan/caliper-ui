import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DimensionLine } from './DimensionLine';

const meta = {
  title: 'Motifs/DimensionLine',
  component: DimensionLine,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A dimension line - the "measured to the pixel" annotation, with end ' +
          'ticks and a centered label. Decorative; hidden from assistive tech.',
      },
    },
  },
  tags: ['autodocs'],
  args: { label: 'W — measured to the pixel', orientation: 'horizontal' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    label: { control: 'text' },
  },
} satisfies Meta<typeof DimensionLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ padding: 'var(--space-xl) 0', maxWidth: '28rem' }}>
      <DimensionLine {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const line = canvasElement.querySelector('.dimension-line');
    await expect(line).toHaveAttribute('aria-hidden', 'true');
    await expect(line).toHaveClass('dimension-line--horizontal');
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical', label: 'H' },
  render: (args) => (
    <div style={{ height: '12rem', paddingInline: 'var(--space-xl)' }}>
      <DimensionLine {...args} />
    </div>
  ),
};
