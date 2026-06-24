import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
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
 * The demo surface, drawn as a technical spec sheet. The whole library is
 * presented like an engineering drawing: a ruler rail, a crop-mark frame,
 * crosshair registration marks, dimension annotations, and mono spec labels.
 * The components themselves are the real ones, on the shared tokens.
 */
export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="spec">
      <div className="spec__frame">
        {/* Top rail: brand, ruler, sheet index, mode */}
        <header className="spec__rail">
          <a className="spec__brand" href="#top">
            <span className="spec__dot" aria-hidden="true" />
            Bespoke
          </a>
          <div className="spec__ruler" aria-hidden="true" />
          <div className="spec__railmeta">
            <span>Sheet 01 / 04</span>
            <button
              type="button"
              className="spec__mode"
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? 'Light' : 'Dev'}
            </button>
          </div>
        </header>

        <main id="top">
          {/* Hero with the dimensioned headline */}
          <section className="spec__hero">
            <p className="spec__eyebrow">
              <span className="spec__coord">↘ 00.0</span>
              <b aria-hidden="true">///</b>
              Accessible component system
            </p>

            <div className="spec__measure">
              <span
                className="spec__crosshair spec__crosshair--tl"
                aria-hidden="true"
              />
              <span
                className="spec__crosshair spec__crosshair--br"
                aria-hidden="true"
              />
              <h1 className="spec__title">
                A component
                <br />
                system, <span className="spec__mark">drawn to spec.</span>
              </h1>
              <span className="spec__dim" aria-hidden="true">
                <span>W — measured to the pixel</span>
              </span>
            </div>

            <p className="spec__lead">
              A small, accessible React component library. Hand-written SCSS,
              design tokens as the single source of truth, every measurement
              deliberate. Eight components, two themes, WCAG 2.2 AA.
            </p>

            <div className="spec__cta">
              <Button onClick={() => setModalOpen(true)}>
                Explore the system
              </Button>
              <Tooltip content="Open the component docs">
                <a
                  className="button button--secondary button--md button--rounded"
                  href="/storybook/"
                >
                  Storybook ↗
                </a>
              </Tooltip>
            </div>

            <dl className="spec__stats">
              <div>
                <dt>Components</dt>
                <dd>08</dd>
              </div>
              <div>
                <dt>Themes</dt>
                <dd>02</dd>
              </div>
              <div>
                <dt>Contrast</dt>
                <dd className="spec__stat-accent">AA</dd>
              </div>
            </dl>
          </section>

          <Plate
            code="BTN — 01"
            title="Actions"
            meta={['variant: 4', 'radius: 2px']}
          >
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button isLoading loadingLabel="Saving">
              Loading
            </Button>
          </Plate>

          <Plate
            code="FLD — 02"
            title="Form controls"
            meta={['labelled', 'aria-wired']}
          >
            <div className="spec__fields">
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
              <div className="spec__stack">
                <Checkbox
                  label="Email me about product updates"
                  defaultChecked
                />
                <Checkbox label="Make profile public" />
              </div>
            </div>
          </Plate>

          <Plate
            code="NAV — 03"
            title="Tabs"
            meta={['roving tabindex', 'arrow keys']}
          >
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
          </Plate>

          <Plate
            code="OVL — 04"
            title="Modal"
            meta={['focus trap', 'scroll lock']}
          >
            <Button onClick={() => setModalOpen(true)}>Open dialog</Button>
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Publish release"
              footer={
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setModalOpen(false)}>Publish</Button>
                </>
              }
            >
              <p>
                Focus is trapped in here, Escape closes it, the page behind
                cannot scroll, and focus returns to the trigger when it closes.
              </p>
            </Modal>
          </Plate>
        </main>

        <footer className="spec__footer">
          <span>Bespoke</span>
          <span>An accessible component system</span>
          <span>WCAG 2.2 AA</span>
        </footer>
      </div>
    </div>
  );
}

/** A labelled "plate": a spec label column beside a staged set of components. */
function Plate({
  code,
  title,
  meta,
  children,
}: {
  code: string;
  title: string;
  meta: string[];
  children: ReactNode;
}) {
  return (
    <section className="plate">
      <div className="plate__label">
        <span className="plate__code">{code}</span>
        <h2 className="plate__title">{title}</h2>
        <ul className="plate__meta">
          {meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
      <div className="plate__stage">
        <span
          className="spec__crosshair spec__crosshair--tl"
          aria-hidden="true"
        />
        <span
          className="spec__crosshair spec__crosshair--br"
          aria-hidden="true"
        />
        {children}
      </div>
    </section>
  );
}
