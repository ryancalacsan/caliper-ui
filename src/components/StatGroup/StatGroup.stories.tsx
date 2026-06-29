import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { StatGroup } from './StatGroup';
import { Stat } from '../Stat/Stat';

const meta = {
  title: 'Content/StatGroup',
  component: StatGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Lays out a row of `Stat`s - the "08 / 02 / AA" readout strip - with ' +
          'optional dividers between them. Wraps to a new line when the row runs ' +
          'out of room.',
      },
    },
  },
  tags: ['autodocs'],
  args: { dividers: true },
  argTypes: {
    dividers: { control: 'boolean' },
  },
} satisfies Meta<typeof StatGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Strip: Story = {
  render: (args) => (
    <StatGroup {...args}>
      <Stat label="Components" value="38" />
      <Stat label="Themes" value="02" />
      <Stat label="Contrast" value="AA" accent />
    </StatGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('.stat-group');
    await expect(group).toHaveClass('stat-group--dividers');
    await expect(
      within(canvasElement).getByText('Components'),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('.stat')).toHaveLength(3);
  },
};
