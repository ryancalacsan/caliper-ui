import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { GridBackdrop } from './GridBackdrop';

const meta = {
  title: 'Motifs/GridBackdrop',
  component: GridBackdrop,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Paints the blueprint grid behind its content - the Spec Sheet backing ' +
          'texture. A wrapper, so content sits on top with no extra markup. ' +
          '`variant="dots"` swaps the ruled lines for a dot grid on the same ' +
          'rhythm and grid-line color.',
      },
    },
  },
  tags: ['autodocs'],
  args: { size: 'grid', variant: 'lines' },
  argTypes: {
    size: { control: 'inline-radio', options: ['grid', 'grid-fine'] },
    variant: { control: 'inline-radio', options: ['lines', 'dots'] },
  },
} satisfies Meta<typeof GridBackdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <GridBackdrop {...args} style={{ padding: 'var(--space-3xl)' }}>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
        }}
      >
        Content on the blueprint grid
      </p>
    </GridBackdrop>
  ),
  play: async ({ canvasElement }) => {
    const el = within(canvasElement).getByText('Content on the blueprint grid');
    const root = el.closest('.grid-backdrop');
    // The default is the line variant - unchanged from before the variant prop.
    await expect(root).toHaveClass('grid-backdrop--grid');
    await expect(root).toHaveClass('grid-backdrop--lines');
  },
};

/**
 * Both patterns at both cell sizes. `dots` reuses the same rhythm and grid-line
 * color as `lines`, so it flips per theme the same way.
 */
export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1px',
        backgroundColor: 'var(--color-border)',
      }}
    >
      {(
        [
          ['lines', 'grid'],
          ['lines', 'grid-fine'],
          ['dots', 'grid'],
          ['dots', 'grid-fine'],
        ] as const
      ).map(([variant, size]) => (
        <GridBackdrop
          key={`${variant}-${size}`}
          variant={variant}
          size={size}
          style={{ blockSize: '10rem', display: 'grid', placeItems: 'center' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            {variant} · {size}
          </span>
        </GridBackdrop>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('.grid-backdrop--dots'),
    ).toHaveLength(2);
  },
};
