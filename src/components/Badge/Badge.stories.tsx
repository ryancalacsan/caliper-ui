import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Badge } from './Badge';

const meta = {
  title: 'Content/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small outline pill for status or category labels, in the mono ' +
          'voice. Every tone clears AA on the surfaces it sits on.',
      },
    },
  },
  tags: ['autodocs'],
  args: { tone: 'neutral', children: 'Stable' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'accent', 'success', 'danger'],
    },
    shape: { control: 'inline-radio', options: ['pill', 'square'] },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `square` takes the sharp radius, to match the rest of the Spec Sheet system. */
export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge shape="pill">Pill</Badge>
      <Badge shape="square">Square</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Square')).toHaveClass(
      'badge--square',
    );
  },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="accent">New</Badge>
      <Badge tone="success">Passing</Badge>
      <Badge tone="danger">Deprecated</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const accent = within(canvasElement).getByText('New');
    await expect(accent).toHaveClass('badge--accent');
  },
};
