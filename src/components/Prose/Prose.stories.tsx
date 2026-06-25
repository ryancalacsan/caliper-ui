import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Prose } from './Prose';

const meta = {
  title: 'Typography/Prose',
  component: Prose,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A styled container for rich text - markdown or CMS output. It styles ' +
          'its descendant elements (headings, paragraphs, lists, links, code, ' +
          'quotes) with token-driven rhythm, so raw HTML reads well with no ' +
          'per-element classes.',
      },
    },
  },
  tags: ['autodocs'],
  args: { size: 'base' },
  argTypes: {
    size: { control: 'inline-radio', options: ['base', 'lg'] },
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Prose {...args} style={{ maxWidth: '42rem' }}>
      <h2>A component system, drawn to spec</h2>
      <p>
        Caliper UI is a small, accessible React component library. It is built
        on <a href="#tokens">design tokens</a>, with <strong>two themes</strong>{' '}
        and <em>every measurement deliberate</em>.
      </p>
      <h3>What is inside</h3>
      <ul>
        <li>Accessible components with correct ARIA</li>
        <li>
          Layout primitives like <code>Stack</code> and <code>Grid</code>
        </li>
        <li>A typography layer for long-form content</li>
      </ul>
      <blockquote>
        The CSS is the artifact. For a CSS-forward system, the stylesheet is the
        work sample.
      </blockquote>
      <pre>
        <code>npm i @ryancalacsan/caliper-ui</code>
      </pre>
    </Prose>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2 })).toBeInTheDocument();
    const link = canvas.getByRole('link', { name: 'design tokens' });
    await expect(link).toBeInTheDocument();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};
