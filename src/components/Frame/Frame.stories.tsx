import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Frame } from './Frame';

const meta = {
  title: 'Motifs/Frame',
  component: Frame,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A crop-mark frame: a bordered box with signal registration corners. ' +
          'The outer shell of the Spec Sheet look - wrap a region to give it the ' +
          'drawn, dimensioned feel.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Frame style={{ padding: 'var(--space-2xl)', maxWidth: '30rem' }}>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}
      >
        Framed region
      </p>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Framed region'),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelector('.frame')).toBeInTheDocument();
  },
};
