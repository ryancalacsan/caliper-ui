import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Link } from './Link';

const meta = {
  title: 'Chrome/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A text link in the accent color with a clear focus ring. `asChild` ' +
          'hands the styling to a framework `<Link>` while keeping the look.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    href: '#',
    underline: 'always',
    tone: 'accent',
    children: 'design tokens',
  },
  argTypes: {
    underline: {
      control: 'inline-radio',
      options: ['always', 'hover', 'none'],
    },
    tone: { control: 'inline-radio', options: ['accent', 'inherit'] },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <p style={{ margin: 0 }}>
      Built on <Link {...args} />, with two themes.
    </p>
  ),
};

/**
 * `tone="inherit"` + `underline="none"` renders the link plain - it takes the
 * surrounding color with no underline, for a structural link like a card title.
 */
export const Plain: Story = {
  args: { tone: 'inherit', underline: 'none' },
  render: (args) => (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--weight-bold)',
      }}
    >
      <Link {...args}>A project title that is a link</Link>
    </p>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link');
    await expect(link).toHaveClass('link--inherit');
    await expect(link).toHaveClass('link--none');
  },
};

/** `asChild` applies the styling to a custom element (here a plain anchor). */
export const AsChild: Story = {
  render: () => (
    <Link asChild>
      <a href="#docs" data-custom="yes">
        Read the docs
      </a>
    </Link>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Read the docs',
    });
    await expect(link).toHaveClass('link');
    await expect(link).toHaveAttribute('data-custom', 'yes');
  },
};
