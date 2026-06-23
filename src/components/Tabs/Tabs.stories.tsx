import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabs following the ARIA tabs pattern. The list uses a roving ' +
          'tabindex, the arrow keys move between tabs (Home and End jump to ' +
          'the ends) and skip disabled tabs, and activation is automatic so ' +
          'the panel follows focus. Styling hangs off [aria-selected] so the ' +
          'visual state cannot drift from the accessible state.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Account settings',
    tabs: [
      {
        id: 'profile',
        label: 'Profile',
        content: 'Your name, photo, and public details live here.',
      },
      {
        id: 'billing',
        label: 'Billing',
        content: 'Manage your plan, payment method, and invoices.',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        content: 'Choose what we email you about and how often.',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Interaction test: focus the first tab, then ArrowRight should move selection
 * to the next tab and the panel should follow (automatic activation).
 */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const profile = canvas.getByRole('tab', { name: 'Profile' });

    await step('First tab is selected and focusable', async () => {
      profile.focus();
      await expect(profile).toHaveAttribute('aria-selected', 'true');
      await expect(profile).toHaveFocus();
    });

    await step('ArrowRight selects and focuses the next tab', async () => {
      await userEvent.keyboard('{ArrowRight}');
      const billing = canvas.getByRole('tab', { name: 'Billing' });
      await expect(billing).toHaveAttribute('aria-selected', 'true');
      await expect(billing).toHaveFocus();
      await expect(
        canvas.getByRole('tabpanel', { name: 'Billing' }),
      ).toBeVisible();
    });

    await step('Home jumps back to the first tab', async () => {
      await userEvent.keyboard('{Home}');
      await expect(profile).toHaveAttribute('aria-selected', 'true');
    });
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        content: 'A summary of your workspace.',
      },
      {
        id: 'members',
        label: 'Members',
        content: 'People with access to this workspace.',
      },
      {
        id: 'audit',
        label: 'Audit log',
        content: 'Available on the Enterprise plan.',
        disabled: true,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Arrow-key navigation skips the disabled tab.',
      },
    },
  },
};

export const StartOnSecondTab: Story = {
  args: { defaultId: 'billing' },
};
