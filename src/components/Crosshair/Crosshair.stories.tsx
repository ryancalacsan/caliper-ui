import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Crosshair } from './Crosshair';

const meta = {
  title: 'Motifs/Crosshair',
  component: Crosshair,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A registration `+` mark in the signal color - decorative flavor from ' +
          'the Spec Sheet language. Hidden from assistive tech; position it with ' +
          'the parent.',
      },
    },
  },
  tags: ['autodocs'],
  args: { size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Crosshair>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const mark = canvasElement.querySelector('.crosshair');
    await expect(mark).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <Crosshair size="sm" />
      <Crosshair size="md" />
      <Crosshair size="lg" />
    </div>
  ),
};
