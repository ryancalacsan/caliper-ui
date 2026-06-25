import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Divider } from './Divider';

const meta = {
  title: 'Layout/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A separator rule. Horizontal renders a real `<hr>`; vertical renders ' +
          'a `separator` with the correct orientation for assistive tech. The ' +
          '`strong` tone uses the Spec Sheet rule color.',
      },
    },
  },
  tags: ['autodocs'],
  args: { orientation: 'horizontal', tone: 'subtle' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    tone: { control: 'inline-radio', options: ['subtle', 'strong'] },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-muted)',
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <div>
      <p style={{ ...labelStyle, marginTop: 0 }}>Above the rule</p>
      <Divider {...args} />
      <p style={{ ...labelStyle, marginBottom: 0 }}>Below the rule</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rule = within(canvasElement).getByRole('separator');
    await expect(rule.tagName).toBe('HR');
  },
};

/** Vertical rules sit between inline items and announce their orientation. */
export const Vertical: Story = {
  args: { orientation: 'vertical', tone: 'strong' },
  render: (args) => (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}
    >
      <span style={labelStyle}>Docs</span>
      <Divider {...args} />
      <span style={labelStyle}>API</span>
      <Divider {...args} />
      <span style={labelStyle}>Changelog</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rules = within(canvasElement).getAllByRole('separator');
    await expect(rules[0]).toHaveAttribute('aria-orientation', 'vertical');
  },
};
