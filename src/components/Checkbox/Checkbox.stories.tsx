import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A checkbox on a real <input type="checkbox">. The check and the ' +
          'mixed-state dash are driven by the :checked and :indeterminate ' +
          'pseudo-classes. Help and error text are linked with ' +
          'aria-describedby, and the error is announced via role="alert".',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Email me about product updates',
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    helpText: { control: 'text' },
    error: { control: 'text' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Interaction test: the box toggles by keyboard (Space) from the label focus. */
export const TogglesWithKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: /product updates/i });
    await expect(box).not.toBeChecked();
    box.focus();
    await userEvent.keyboard(' ');
    await expect(box).toBeChecked();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true, label: 'Subscribed' },
};

export const WithHelpText: Story = {
  args: {
    label: 'Make profile public',
    helpText: 'Anyone with the link will be able to see your work.',
  },
};

export const Indeterminate: Story = {
  args: { label: 'Select all', indeterminate: true },
  parameters: {
    docs: {
      description: {
        story:
          'The mixed state is set via the DOM property and styled by the ' +
          'native :indeterminate pseudo-class. Common for a "select all" parent.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    label: 'I accept the terms of service',
    error: 'You must accept the terms to continue.',
  },
};

export const Disabled: Story = {
  args: { label: 'Unavailable option', disabled: true },
};

// Named so the hook satisfies rules-of-hooks (inline render arrows do not).
function SelectAllDemo() {
  const [items, setItems] = useState([true, false, true]);
  const allChecked = items.every(Boolean);
  const someChecked = items.some(Boolean) && !allChecked;

  const labels = ['Design', 'Engineering', 'Marketing'];

  return (
    <div style={{ display: 'grid', gap: '0.5rem', minWidth: 240 }}>
      <Checkbox
        label="All teams"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={(e) => setItems(items.map(() => e.target.checked))}
      />
      <div style={{ display: 'grid', gap: '0.5rem', paddingLeft: '1.75rem' }}>
        {labels.map((labelText, i) => (
          <Checkbox
            key={labelText}
            label={labelText}
            checked={items[i]}
            onChange={(e) =>
              setItems(items.map((v, j) => (j === i ? e.target.checked : v)))
            }
          />
        ))}
      </div>
    </div>
  );
}

/** A parent checkbox whose mixed state reflects its children. */
export const SelectAllGroup: Story = {
  render: () => <SelectAllDemo />,
};
