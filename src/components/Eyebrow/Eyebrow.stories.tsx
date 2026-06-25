import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Eyebrow } from './Eyebrow';
import { Heading } from '../Heading/Heading';

const meta = {
  title: 'Typography/Eyebrow',
  component: Eyebrow,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A mono, uppercase kicker label - the small letter-spaced line above a ' +
          'heading. The Spec Sheet voice for section markers and metadata.',
      },
    },
  },
  tags: ['autodocs'],
  args: { tone: 'muted', children: 'Accessible component system' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['muted', 'accent'] },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: { tone: 'accent', children: 'New in 0.3' },
  play: async ({ canvasElement }) => {
    const el = within(canvasElement).getByText('New in 0.3');
    await expect(el).toHaveClass('eyebrow--accent');
  },
};

/** The usual pairing: eyebrow above a heading. */
export const WithHeading: Story = {
  render: () => (
    <div>
      <Eyebrow tone="accent">Sheet 03 / 04</Eyebrow>
      <Heading level={2} size="3xl" style={{ marginTop: 'var(--space-xs)' }}>
        Typography
      </Heading>
    </div>
  ),
};
