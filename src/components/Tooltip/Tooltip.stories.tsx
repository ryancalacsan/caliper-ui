import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tooltip that shows on hover and on keyboard focus, and dismisses ' +
          'on blur, mouse leave, or Escape. The bubble stays in the DOM with ' +
          'role="tooltip" and the trigger always references it with ' +
          'aria-describedby, so it is announced on focus. The trigger must be a ' +
          'focusable element. Content is text only.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    content: 'Saves without leaving the page',
    placement: 'top',
    delay: 200,
    // Supplied so the required-prop types are satisfied; each render() below
    // provides its own trigger.
    children: <Button variant="secondary">Quick save</Button>,
  },
  argTypes: {
    content: { control: 'text' },
    placement: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: { control: { type: 'number', min: 0, step: 50 } },
    // children is the trigger element, not something you pick from a control,
    // and its full TypeScript type is noise in the table. Show a clean summary
    // and turn the control off.
    children: {
      control: false,
      description:
        'The trigger. Must be a single focusable element such as a button or a link.',
      table: { type: { summary: 'ReactElement' } },
    },
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">Quick save</Button>
    </Tooltip>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Interaction test: the tooltip shows on keyboard focus (not only hover) and
 * dismisses on Escape while focus stays on the trigger.
 */
export const ShowsOnFocus: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Quick save' });
    const tip = canvas.getByText('Saves without leaving the page');

    await step('Hidden until the trigger is focused', async () => {
      await expect(tip).not.toBeVisible();
    });

    await step('Focus reveals the tooltip', async () => {
      button.focus();
      await waitFor(() => expect(tip).toBeVisible());
    });

    await step('Escape dismisses it, focus stays on the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(tip).not.toBeVisible());
      await expect(button).toHaveFocus();
    });
  },
};

export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        gap: '3rem',
        padding: '3rem',
      }}
    >
      <Tooltip content="Shown above" placement="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Shown below" placement="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Shown to the left" placement="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
      <Tooltip content="Shown to the right" placement="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
    </div>
  ),
};

/** Tab to the button to confirm the tooltip shows on keyboard focus too. */
export const OnIconButton: Story = {
  render: () => (
    <Tooltip content="Delete this item" placement="top">
      <Button variant="ghost" aria-label="Delete">
        ✕
      </Button>
    </Tooltip>
  ),
};
