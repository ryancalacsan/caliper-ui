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
  Heading,
  Eyebrow,
  Text,
  Mark,
  Stack,
  Inline,
  Grid,
  Divider,
  Card,
  Badge,
  Stat,
  StatGroup,
  Callout,
  Frame,
  MeasureFrame,
  Crosshair,
  NavLink,
  Link,
  ThemeToggle,
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

  function exploreComponents() {
    const el = document.getElementById('components');
    if (!el) return;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  return (
    <div className="spec">
      <div className="spec__frame">
        {/* Top rail: brand, ruler, sheet index, mode */}
        <header className="spec__rail">
          <a className="spec__brand" href="#top">
            <span className="spec__dot" aria-hidden="true" />
            Caliper
          </a>
          <div className="spec__ruler" aria-hidden="true" />
          <div className="spec__railmeta">
            <span>Sheet 01 / 09</span>
            {/* Caliper's own ThemeToggle, in controlled mode: the demo owns the
                theme (applied to the document by the effect above) and the
                toggle defers to it. */}
            <ThemeToggle
              className="spec__mode"
              theme={theme}
              onThemeChange={setTheme}
            />
          </div>
        </header>

        <main id="top">
          {/* Hero with the dimensioned headline */}
          <section className="spec__hero">
            <Eyebrow className="spec__eyebrow">
              <span className="spec__coord">↘ 00.0</span>
              <b aria-hidden="true">///</b>
              Accessible component system
            </Eyebrow>

            {/* The signature dimensioned headline, built from Caliper itself:
                MeasureFrame (dashed frame + crop crosshairs + dimension line)
                wrapping a display Heading with a Mark underline. */}
            {/* spec__measure is the entrance-animation hook; the visual motif
                comes entirely from the MeasureFrame component. */}
            <MeasureFrame
              label="W — measured to the pixel"
              className="spec__measure"
            >
              <Heading level={1} size="display" weight="black">
                A component
                <br />
                system, <Mark>drawn to spec.</Mark>
              </Heading>
            </MeasureFrame>

            <Text className="spec__lead" size="md" tone="muted">
              A small, accessible React component library, published on npm.
              Hand-written SCSS, design tokens as the single source of truth,
              every measurement deliberate. Forty-one components, two themes,
              WCAG 2.2 AA.
            </Text>

            <Inline className="spec__cta" gap="sm" wrap>
              <Button onClick={exploreComponents}>Explore the system</Button>
              <Tooltip content="Open the component docs">
                <Button asChild variant="secondary">
                  <a href="/storybook/">Storybook ↗</a>
                </Button>
              </Tooltip>
            </Inline>

            <StatGroup dividers className="spec__stats">
              <Stat label="Components" value="41" />
              <Stat label="Themes" value="02" />
              <Stat label="Contrast" value="AA" accent />
            </StatGroup>
          </section>

          <Plate
            id="components"
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
            <Grid
              minItemWidth="15rem"
              gap="xl"
              style={{ width: '100%', maxWidth: '44rem' }}
            >
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
              <Stack gap="xs">
                <Checkbox
                  label="Email me about product updates"
                  defaultChecked
                />
                <Checkbox label="Make profile public" />
              </Stack>
            </Grid>
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

          <Plate
            code="TYP — 05"
            title="Typography"
            meta={['scale: 1.25', 'Hanken + Geist']}
          >
            <Stack gap="sm" style={{ maxWidth: '32rem' }}>
              <Eyebrow tone="accent">Display &amp; body</Eyebrow>
              <Heading level={3} size="2xl">
                Drawn, not written
              </Heading>
              <Text tone="muted">
                Headings with size decoupled from level, a mono eyebrow, body
                text, and a Prose container for rich content — all from the type
                tokens.
              </Text>
            </Stack>
          </Plate>

          <Plate
            code="LAY — 06"
            title="Layout"
            meta={['flex + grid', 'token gaps']}
          >
            <Stack gap="md" style={{ width: '100%', maxWidth: '34rem' }}>
              <Inline gap="xs">
                <Badge>Stack</Badge>
                <Badge>Inline</Badge>
                <Badge>Grid</Badge>
                <Badge>Container</Badge>
                <Badge>Section</Badge>
              </Inline>
              <Divider />
              <Grid columns={3} gap="sm">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="demo-cell">
                    {n}
                  </div>
                ))}
              </Grid>
            </Stack>
          </Plate>

          <Plate
            code="DSP — 07"
            title="Content"
            meta={['card + callout', 'composed']}
          >
            <Stack gap="md" style={{ width: '100%', maxWidth: '24rem' }}>
              <Card
                interactive
                header={
                  <>
                    <Inline justify="between" align="start">
                      <Eyebrow>Case study</Eyebrow>
                      <Badge tone="accent" shape="square">
                        New
                      </Badge>
                    </Inline>
                    <Heading level={3} size="lg">
                      <Link
                        stretch
                        tone="inherit"
                        underline="none"
                        href="/storybook/"
                      >
                        Caliper UI
                      </Link>
                    </Heading>
                  </>
                }
                footer={
                  <Button asChild size="sm" variant="secondary">
                    <a href="/storybook/">Read more</a>
                  </Button>
                }
              >
                <Text size="sm" tone="muted">
                  The whole card is a link (a stretched Link), while the footer
                  button stays clickable above it — the pattern a portfolio card
                  uses.
                </Text>
              </Card>
              <Callout tone="accent" title="Measured to spec">
                Every color pairing is verified against WCAG 2.2 AA by a script.
              </Callout>
            </Stack>
          </Plate>

          <Plate
            code="CHR — 08"
            title="Navigation"
            meta={['nav + links', 'a11y']}
          >
            <Stack gap="sm" style={{ maxWidth: '32rem' }}>
              <Inline as="nav" gap="lg" aria-label="Demo navigation">
                <NavLink href="#top" active>
                  Docs
                </NavLink>
                <NavLink href="#top">API</NavLink>
                <NavLink href="#top">Changelog</NavLink>
              </Inline>
              <Text size="sm" tone="muted">
                Plus <Link href="/storybook/">styled links</Link>, a
                focus-trapped Drawer, a theme toggle, skip links, and a sticky
                AppHeader.
              </Text>
            </Stack>
          </Plate>

          <Plate
            code="MTF — 09"
            title="Spec Sheet motifs"
            meta={['frame + marks', 'measured']}
          >
            <Stack gap="lg" style={{ width: '100%', maxWidth: '34rem' }}>
              <MeasureFrame label="W — sized to content">
                <Heading level={3} size="xl" weight="black">
                  <Mark>Drawn to spec.</Mark>
                </Heading>
              </MeasureFrame>
              <Frame
                variant="dashed"
                marks="all"
                style={{ padding: 'var(--space-md)' }}
              >
                <Text size="sm" tone="muted">
                  Frame — dashed border with all four registration corners.
                </Text>
              </Frame>
              <StatGroup dividers>
                <Stat label="Components" value="41" />
                <Stat label="Themes" value="02" />
                <Stat label="Contrast" value="AA" accent />
              </StatGroup>
            </Stack>
          </Plate>
        </main>

        <footer className="spec__footer">
          <span>Caliper</span>
          <span>An accessible component system</span>
          <span>WCAG 2.2 AA</span>
        </footer>
      </div>
    </div>
  );
}

/** A labelled "plate": a spec label column beside a staged set of components. */
function Plate({
  id,
  code,
  title,
  meta,
  children,
}: {
  id?: string;
  code: string;
  title: string;
  meta: string[];
  children: ReactNode;
}) {
  return (
    <section id={id} className="plate">
      <div className="plate__label">
        <span className="plate__code">{code}</span>
        <Heading level={2} size="xl" weight="bold" className="plate__title">
          {title}
        </Heading>
        <ul className="plate__meta">
          {meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
      <div className="plate__stage">
        <Crosshair className="plate__mark plate__mark--tl" />
        <Crosshair className="plate__mark plate__mark--br" />
        {children}
      </div>
    </section>
  );
}
