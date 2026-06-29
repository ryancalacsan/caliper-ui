import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { MeasureFrame } from './MeasureFrame';
import { Heading } from '../Heading/Heading';
import { Mark } from '../Mark/Mark';

const meta = {
  title: 'Motifs/MeasureFrame',
  component: MeasureFrame,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The signature title-box motif: a dashed frame with registration ' +
          'crosshairs and a dimension line, all sized to the content. Wrap a ' +
          'headline for the "measured to the pixel" treatment. The frame and ' +
          'annotations are decorative; only the children are read by assistive ' +
          'tech.',
      },
    },
  },
  tags: ['autodocs'],
  args: { label: 'W — measured to the pixel' },
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof MeasureFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MeasureFrame {...args}>
      <Heading level={1} size="3xl" weight="black" style={{ maxWidth: '14ch' }}>
        A component system, <Mark>drawn to spec.</Mark>
      </Heading>
    </MeasureFrame>
  ),
  play: async ({ canvasElement }) => {
    // The heading is real content; the dimension line is decorative.
    await expect(
      within(canvasElement).getByRole('heading', { level: 1 }),
    ).toBeInTheDocument();
    const dim = canvasElement.querySelector('.dimension-line');
    await expect(dim).toHaveAttribute('aria-hidden', 'true');
  },
};
