import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Heading } from './Heading';

const SIZES = ['md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A display heading. `level` sets the semantic tag (h1-h6) for the ' +
          'document outline; `size` sets the visual scale independently, so an ' +
          'h2 can read small or an h3 large when the layout calls for it.',
      },
    },
  },
  tags: ['autodocs'],
  args: { level: 2, children: 'Drawn to spec' },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: SIZES },
    weight: {
      control: 'inline-radio',
      options: ['semibold', 'bold', 'black'],
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `level` drives the tag; `size` is independent. Here an h3 rendered large. */
export const SizeDecoupledFromLevel: Story = {
  args: { level: 3, size: '4xl', weight: 'black', children: 'Big h3' },
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole('heading', { level: 3 });
    await expect(heading.tagName).toBe('H3');
    await expect(heading).toHaveClass('heading--4xl');
  },
};

/** The full scale, top to bottom. */
export const Scale: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
      {(['6xl', '4xl', '3xl', '2xl', 'xl', 'lg', 'md'] as const).map((s) => (
        <Heading key={s} level={2} size={s}>
          {s} heading
        </Heading>
      ))}
    </div>
  ),
};
