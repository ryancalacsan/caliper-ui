import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { SheetHeader } from './SheetHeader';

const meta = {
  title: 'Motifs/SheetHeader',
  component: SheetHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The Spec Sheet meta bar - the "CALIPER ... SHEET 01 / 04 ... LIGHT" ' +
          'strip. A mono, uppercase rule with left and right cells and an ' +
          'optional ruler between them.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    left: 'Caliper',
    right: 'Sheet 01 / 04',
    ruler: true,
  },
  argTypes: {
    left: { control: 'text' },
    right: { control: 'text' },
    ruler: { control: 'boolean' },
  },
} satisfies Meta<typeof SheetHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Caliper')).toBeInTheDocument();
    await expect(canvas.getByText('Sheet 01 / 04')).toBeInTheDocument();
  },
};

/** A single cell renders with no stray divider on its outer edges. */
export const BrandOnly: Story = {
  args: { left: 'Caliper', right: undefined, ruler: false },
  play: async ({ canvasElement }) => {
    const cells = canvasElement.querySelectorAll('.sheet-header__cell');
    await expect(cells).toHaveLength(1);
  },
};
