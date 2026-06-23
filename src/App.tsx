import { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Modal,
  Checkbox,
  RadioGroup,
  Select,
  Tabs,
  Tooltip,
} from './components';
import './App.scss';

type Theme = 'light' | 'dark';

/**
 * The demo surface, dressed as a small editorial landing page. It leads with the
 * dark "noir" theme and shows the components composing on the shared tokens. The
 * real per-component docs live in Storybook.
 */
export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="lp">
      <div className="lp__glow" aria-hidden="true" />

      <header className="lp__bar">
        <a className="lp__wordmark" href="#top">
          Bespoke <span className="lp__wordmark-tag">/ design system</span>
        </a>
        <button
          type="button"
          className="lp__theme"
          aria-pressed={theme === 'dark'}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? 'Noir' : 'Daylight'}
        </button>
      </header>

      <main className="lp__main" id="top">
        <section className="lp__hero">
          <p className="lp__eyebrow">Accessible component system</p>
          <h1 className="lp__title">
            Interfaces, composed
            <br />
            with <em>intent.</em>
          </h1>
          <p className="lp__lead">
            A small React component library built on hand-written SCSS and a
            single source of design tokens. Eight components, two themes,
            accessibility as a first principle, not a finishing pass.
          </p>
          <div className="lp__actions">
            <Button onClick={() => setModalOpen(true)}>
              Explore the system
            </Button>
            <Tooltip content="Opens the documented component set">
              <Button variant="ghost">Storybook</Button>
            </Tooltip>
          </div>
          <ul className="lp__meta">
            <li>
              <span className="lp__meta-num">8</span> components
            </li>
            <li>
              <span className="lp__meta-num">2</span> themes
            </li>
            <li>
              <span className="lp__meta-num">AA</span> contrast
            </li>
          </ul>
        </section>

        <section className="lp__section" aria-labelledby="buttons-heading">
          <p className="lp__overline">01 / Actions</p>
          <h2 id="buttons-heading" className="lp__heading">
            Buttons
          </h2>
          <div className="lp__row">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button isLoading loadingLabel="Saving">
              Loading
            </Button>
          </div>
        </section>

        <section className="lp__section" aria-labelledby="fields-heading">
          <p className="lp__overline">02 / Input</p>
          <h2 id="fields-heading" className="lp__heading">
            Form controls
          </h2>
          <div className="lp__fields">
            <TextField
              label="Email address"
              type="email"
              placeholder="you@example.com"
              helpText="We only use this to send build notifications."
            />
            <TextField
              label="Password"
              type="password"
              error="Enter at least 12 characters."
              required
            />
            <Select
              label="Country"
              placeholder="Select a country"
              options={[
                { label: 'Australia', value: 'au' },
                { label: 'Canada', value: 'ca' },
                { label: 'Germany', value: 'de' },
                { label: 'Japan', value: 'jp' },
              ]}
            />
            <RadioGroup
              legend="Notifications"
              defaultValue="daily"
              options={[
                { label: 'Real time', value: 'realtime' },
                { label: 'Daily digest', value: 'daily' },
                { label: 'Weekly summary', value: 'weekly' },
              ]}
            />
            <div className="lp__stack">
              <Checkbox label="Email me about product updates" defaultChecked />
              <Checkbox label="Make profile public" />
            </div>
          </div>
        </section>

        <section className="lp__section" aria-labelledby="tabs-heading">
          <p className="lp__overline">03 / Navigation</p>
          <h2 id="tabs-heading" className="lp__heading">
            Tabs
          </h2>
          <Tabs
            label="Account settings"
            tabs={[
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
            ]}
          />
        </section>

        <section className="lp__section" aria-labelledby="modal-heading">
          <p className="lp__overline">04 / Overlay</p>
          <h2 id="modal-heading" className="lp__heading">
            Modal
          </h2>
          <Button onClick={() => setModalOpen(true)}>Open dialog</Button>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Publish release"
            footer={
              <>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Publish</Button>
              </>
            }
          >
            <p>
              Focus is trapped in here, Escape closes it, the page behind cannot
              scroll, and focus returns to the trigger when it closes.
            </p>
          </Modal>
        </section>
      </main>

      <footer className="lp__footer">
        <p className="lp__overline">Bespoke — an accessible component system</p>
      </footer>
    </div>
  );
}
