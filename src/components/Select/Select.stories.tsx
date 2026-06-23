import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { Select, type SelectProps } from './Select';

const countries = [
  { label: 'Australia', value: 'au' },
  { label: 'Brazil', value: 'br' },
  { label: 'Canada', value: 'ca' },
  { label: 'Denmark', value: 'dk' },
  { label: 'Estonia', value: 'ee' },
  { label: 'Finland', value: 'fi' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A custom single-select on the ARIA select-only combobox pattern. ' +
          'A button (role="combobox") opens a listbox; focus stays on the ' +
          'button and the active option is tracked with aria-activedescendant. ' +
          'Keyboard support: Up/Down, Home/End, Enter/Space, Escape, and ' +
          'type-ahead. Prefer a native <select> unless you need custom option ' +
          'rendering; this is here to demonstrate the pattern.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Country',
    options: countries,
    placeholder: 'Select a country',
    required: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Interaction test: open with the keyboard, jump to an option with type-ahead,
 * and commit it with Enter. Focus stays on the combobox throughout.
 */
export const KeyboardSelection: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole('combobox');

    await step('Enter opens the listbox', async () => {
      combobox.focus();
      await userEvent.keyboard('{Enter}');
      await expect(combobox).toHaveAttribute('aria-expanded', 'true');
      await expect(canvas.getByRole('listbox')).toBeVisible();
    });

    await step('Type-ahead moves the active option to Finland', async () => {
      await userEvent.keyboard('f');
      await waitFor(() =>
        expect(canvas.getByRole('option', { name: 'Finland' })).toHaveClass(
          'select__option--active',
        ),
      );
    });

    await step('Enter selects it and closes the list', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(combobox).toHaveAttribute('aria-expanded', 'false');
      await expect(combobox).toHaveTextContent('Finland');
      await expect(combobox).toHaveFocus();
    });
  },
};

export const WithSelectedValue: Story = {
  args: { defaultValue: 'ca' },
};

export const WithHelpText: Story = {
  args: {
    helpText: 'Used to set your default currency and tax region.',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { label: 'Starter', value: 'starter' },
      { label: 'Pro', value: 'pro' },
      { label: 'Business (contact sales)', value: 'business', disabled: true },
      {
        label: 'Enterprise (contact sales)',
        value: 'enterprise',
        disabled: true,
      },
    ],
    label: 'Plan',
    placeholder: 'Choose a plan',
  },
};

export const ErrorState: Story = {
  args: {
    required: true,
    error: 'Select a country to continue.',
  },
};

export const Disabled: Story = {
  args: { defaultValue: 'jp', disabled: true },
};

// Named so the hook satisfies rules-of-hooks (inline render arrows do not).
function ControlledDemo(args: SelectProps) {
  const [value, setValue] = useState('de');
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Select {...args} value={value} onChange={setValue} />
      <p style={{ fontSize: '0.875rem', color: '#475569' }}>
        Selected value: <strong>{value}</strong>
      </p>
    </div>
  );
}

/** Controlled: the selected value lives in component state. */
export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
