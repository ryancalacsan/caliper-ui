import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Text } from './Text';

const meta = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Body text. Maps friendly `size`, `tone`, `weight`, and `align` props ' +
          'onto the type and color tokens, so copy stays consistent without raw ' +
          'font sizes.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    size: 'base',
    tone: 'default',
    children:
      'A small, accessible component library. Hand-written SCSS, design tokens ' +
      'as the single source of truth, every measurement deliberate.',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'base', 'md', 'lg'],
    },
    tone: { control: 'inline-radio', options: ['default', 'muted', 'subtle'] },
    weight: {
      control: 'inline-radio',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Lead: Story = {
  args: {
    size: 'md',
    tone: 'muted',
    children: 'A larger, muted lead paragraph.',
  },
  play: async ({ canvasElement }) => {
    const el = within(canvasElement).getByText(/lead paragraph/);
    await expect(el).toHaveClass('text--md');
    await expect(el).toHaveClass('text--muted');
  },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
      <Text tone="default">Default text color</Text>
      <Text tone="muted">Muted text color</Text>
      <Text tone="subtle">Subtle text color</Text>
    </div>
  ),
};
