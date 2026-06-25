import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Section } from './Section';

const GAPS = ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

const meta = {
  title: 'Layout/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A landmark region with vertical padding from the spacing scale. ' +
          'Bands a page into sections with consistent breathing room. Renders a ' +
          '`<section>` by default.',
      },
    },
  },
  tags: ['autodocs'],
  args: { space: '2xl', 'aria-label': 'Example section' },
  argTypes: {
    space: { control: 'select', options: GAPS },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Section
      {...args}
      style={{ background: 'var(--color-surface)', textAlign: 'center' }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
        }}
      >
        Section padded {String(args.space)} top and bottom
      </p>
    </Section>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Example section',
    });
    await expect(region.tagName).toBe('SECTION');
    await expect(region).toHaveClass('section--space-2xl');
  },
};
