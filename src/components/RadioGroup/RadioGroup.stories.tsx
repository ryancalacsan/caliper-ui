import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { RadioGroup, type RadioGroupProps } from './RadioGroup';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radios grouped in a real <fieldset> with a <legend>. Native radios ' +
          'sharing a name give arrow-key navigation and single selection for ' +
          'free. Group help and error link to the fieldset via ' +
          'aria-describedby, with the error announced through role="alert".',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    legend: 'Notification frequency',
    options: [
      { label: 'Real time', value: 'realtime' },
      { label: 'Daily digest', value: 'daily' },
      { label: 'Weekly summary', value: 'weekly' },
    ],
    orientation: 'vertical',
    required: false,
  },
  argTypes: {
    legend: { control: 'text' },
    helpText: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 'daily' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('The default value is selected', async () => {
      await expect(
        canvas.getByRole('radio', { name: 'Daily digest' }),
      ).toBeChecked();
    });

    await step('Arrow keys move the selection within the group', async () => {
      const daily = canvas.getByRole('radio', { name: 'Daily digest' });
      daily.focus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(
        canvas.getByRole('radio', { name: 'Weekly summary' }),
      ).toBeChecked();
    });
  },
};

export const WithPerOptionHelp: Story = {
  args: {
    legend: 'Plan',
    defaultValue: 'team',
    options: [
      {
        label: 'Solo',
        value: 'solo',
        helpText: 'For one person. 3 projects.',
      },
      {
        label: 'Team',
        value: 'team',
        helpText: 'Up to 10 people. Unlimited projects.',
      },
      {
        label: 'Enterprise',
        value: 'enterprise',
        helpText: 'SSO, audit logs, and a dedicated contact.',
      },
    ],
  },
};

export const Horizontal: Story = {
  args: {
    legend: 'Size',
    orientation: 'horizontal',
    defaultValue: 'm',
    options: [
      { label: 'Small', value: 's' },
      { label: 'Medium', value: 'm' },
      { label: 'Large', value: 'l' },
    ],
  },
};

export const WithDisabledOption: Story = {
  args: {
    legend: 'Shipping',
    defaultValue: 'standard',
    options: [
      { label: 'Standard', value: 'standard' },
      { label: 'Express', value: 'express' },
      {
        label: 'Overnight (unavailable in your area)',
        value: 'overnight',
        disabled: true,
      },
    ],
  },
};

export const ErrorState: Story = {
  args: {
    legend: 'Accept terms',
    required: true,
    error: 'Choose an option to continue.',
    options: [
      { label: 'I accept', value: 'accept' },
      { label: 'I do not accept', value: 'decline' },
    ],
  },
};

// Named so the hook satisfies rules-of-hooks (inline render arrows do not).
function ControlledDemo(args: RadioGroupProps) {
  const [value, setValue] = useState('daily');
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <RadioGroup {...args} value={value} onChange={setValue} />
      <p style={{ fontSize: '0.875rem', color: '#475569' }}>
        Selected: <strong>{value}</strong>
      </p>
    </div>
  );
}

/** Controlled: the selected value lives in component state. */
export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
