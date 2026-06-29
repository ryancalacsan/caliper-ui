import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Card } from './Card';
import { AspectRatio } from '../AspectRatio/AspectRatio';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Eyebrow } from '../Eyebrow/Eyebrow';
import { Grid } from '../Grid/Grid';
import { Heading } from '../Heading/Heading';
import { Inline } from '../Inline/Inline';
import { Link } from '../Link/Link';
import { Text } from '../Text/Text';

const meta = {
  title: 'Content/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A bordered surface with optional media, header, body, and footer ' +
          'regions. A neutral container that project cards and case-study blocks ' +
          'compose from - here built entirely out of other Caliper primitives.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
  render: () => (
    <div style={{ maxWidth: '24rem' }}>
      <Card
        media={
          <AspectRatio ratio={16 / 9}>
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                background: 'var(--color-primary-bg)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-muted)',
              }}
            >
              cover
            </div>
          </AspectRatio>
        }
        header={
          <>
            <Inline justify="between" align="start">
              <Eyebrow>Case study</Eyebrow>
              <Badge tone="accent">New</Badge>
            </Inline>
            <Heading level={3} size="xl">
              Caliper UI
            </Heading>
          </>
        }
        footer={
          <Button asChild size="sm" variant="secondary">
            <a href="#read">Read more</a>
          </Button>
        }
      >
        <Text tone="muted" size="sm">
          A small, accessible component library presented as a technical spec
          sheet. Token-driven, two themes, WCAG 2.2 AA.
        </Text>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Caliper UI' }),
    ).toBeInTheDocument();
    const link = canvas.getByRole('link', { name: 'Read more' });
    await expect(link).toHaveClass('button');
  },
};

/** `fill` in a stretched Grid gives equal-height cards with footers aligned. */
export const FillGrid: Story = {
  render: () => (
    <Grid minItemWidth="14rem" gap="md">
      {[
        { t: 'Short', d: 'A brief one.' },
        {
          t: 'Longer card',
          d: 'This one has more body copy, so without fill the footers would not line up across the row.',
        },
        { t: 'Medium', d: 'Two lines of copy here to differ.' },
      ].map((c) => (
        <Card
          key={c.t}
          fill
          header={
            <Heading level={3} size="lg">
              {c.t}
            </Heading>
          }
          footer={
            <Button asChild size="sm" variant="secondary">
              <a href="#open">Open</a>
            </Button>
          }
        >
          <Text size="sm" tone="muted">
            {c.d}
          </Text>
        </Card>
      ))}
    </Grid>
  ),
};

/** `orientation="horizontal"` sets media beside the body (reflows when narrow). */
export const Horizontal: Story = {
  render: () => (
    <div style={{ maxWidth: '34rem' }}>
      <Card
        orientation="horizontal"
        media={
          <AspectRatio ratio={1}>
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                background: 'var(--color-primary-bg)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-muted)',
              }}
            >
              cover
            </div>
          </AspectRatio>
        }
        header={
          <Heading level={3} size="lg">
            Featured case study
          </Heading>
        }
      >
        <Text size="sm" tone="muted">
          Media beside the body, for a small set of featured rows.
        </Text>
      </Card>
    </div>
  ),
};

/**
 * `interactive` plus a stretched `Link` in the header makes the whole card
 * follow that link, while the footer button stays independently clickable.
 */
export const Interactive: Story = {
  render: () => (
    <div style={{ maxWidth: '24rem' }}>
      <Card
        interactive
        header={
          <Heading level={3} size="lg">
            <Link stretch underline="hover" href="#case-study">
              Caliper UI
            </Link>
          </Heading>
        }
        footer={
          <Button size="sm" variant="ghost">
            Share
          </Button>
        }
      >
        <Text size="sm" tone="muted">
          The whole card links to the case study; the Share button still works
          on its own.
        </Text>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvasElement.querySelector('.card');
    await expect(card).toHaveClass('card--interactive');
    await expect(canvas.getByRole('link', { name: 'Caliper UI' })).toHaveClass(
      'link--stretch',
    );
    // The footer action is still its own control.
    await expect(
      canvas.getByRole('button', { name: 'Share' }),
    ).toBeInTheDocument();
  },
};
