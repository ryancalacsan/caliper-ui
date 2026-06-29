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
  args: { variant: 'solid', marks: 'tlbr' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'dashed'] },
    marks: { control: 'inline-radio', options: ['none', 'tlbr', 'all'] },
  },
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

const label = {
  margin: 0,
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-muted)',
  textAlign: 'center',
} as const;

export const Default: Story = {
  render: (args) => (
    <Frame {...args} style={{ padding: 'var(--space-2xl)', maxWidth: '30rem' }}>
      <p style={label}>Framed region</p>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Framed region'),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelector('.frame')).toBeInTheDocument();
  },
};

/** The registration corner options: none, the default tl/br, or all four. */
export const Marks: Story = {
  render: () => (
    <div
      style={{ display: 'grid', gap: 'var(--space-2xl)', maxWidth: '24rem' }}
    >
      {(['none', 'tlbr', 'all'] as const).map((m) => (
        <Frame key={m} marks={m} style={{ padding: 'var(--space-lg)' }}>
          <p style={label}>marks: {m}</p>
        </Frame>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    // marks="all" renders the two extra corner spans.
    const all = canvasElement.querySelectorAll(
      '.frame--marks-all .frame__corner',
    );
    await expect(all).toHaveLength(2);
  },
};

/** The dashed variant - the measurement-box treatment, with the crop corners. */
export const Variants: Story = {
  render: () => (
    <div
      style={{ display: 'grid', gap: 'var(--space-2xl)', maxWidth: '30rem' }}
    >
      <Frame variant="solid" style={{ padding: 'var(--space-xl)' }}>
        <p style={label}>solid</p>
      </Frame>
      <Frame variant="dashed" style={{ padding: 'var(--space-xl)' }}>
        <p style={label}>dashed</p>
      </Frame>
    </div>
  ),
};
