import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Container } from './Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A centered, max-width column with a horizontal gutter. The outer ' +
          'wrapper that stops page content from running edge to edge on wide ' +
          'screens.',
      },
    },
  },
  tags: ['autodocs'],
  args: { size: 'lg', gutter: true },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    gutter: { control: 'boolean' },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <div
        style={{
          padding: 'var(--space-xl)',
          background: 'var(--color-primary-bg)',
          border: '1px dashed var(--color-border-strong)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}
      >
        Centered column &middot; size: {args.size}
      </div>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('.container');
    await expect(el).toHaveClass('container--lg');
  },
};
