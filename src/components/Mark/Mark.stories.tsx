import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mark } from './Mark';
import { Heading } from '../Heading/Heading';

const meta = {
  title: 'Typography/Mark',
  component: Mark,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A highlighter underline accent - the orange bar drawn behind a word ' +
          'or two. Purely visual: the text keeps its own color, and the bar ' +
          'clones across line breaks.',
      },
    },
  },
  tags: ['autodocs'],
  args: { tone: 'signal', thickness: 'md', children: 'drawn to spec.' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['signal', 'accent'] },
    thickness: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Mark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <p style={{ margin: 0, fontSize: 'var(--text-xl)' }}>
      A component system, <Mark {...args} />
    </p>
  ),
};

/** Inside a Heading, and wrapping across two lines. */
export const InHeading: Story = {
  render: () => (
    <Heading level={2} size="4xl" weight="black" style={{ maxWidth: '14ch' }}>
      A component system, <Mark>drawn to spec.</Mark>
    </Heading>
  ),
};
