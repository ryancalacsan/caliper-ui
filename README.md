# Caliper UI

[![CI](https://github.com/ryancalacsan/caliper-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/ryancalacsan/caliper-ui/actions/workflows/ci.yml)

**[Live demo](https://caliper-ui.vercel.app)** · **[Component docs (Storybook)](https://caliper-ui.vercel.app/storybook/)**

![The Caliper UI demo landing, drawn as a technical spec sheet on warm paper: a ruler rail, a crop-mark frame, and a big grotesque headline reading "A component system, drawn to spec." dimensioned like an engineering drawing with crosshair marks and a width annotation, in ink with one construction-orange accent.](.github/assets/hero.png)

A small, accessible React component library built to show design-system craft:
hand-written SCSS with BEM, one source of truth for design tokens, and
accessibility wired in from the first line rather than bolted on at the end.

It is meant to be read as much as run.

## Install

```bash
npm install @ryancalacsan/caliper-ui
```

React 18 or newer is a peer dependency (your app provides it). The package ships
ESM with types and is safe to use in React Server Components.

## Usage

Import the stylesheet once at your app root, then use the components:

```tsx
import '@ryancalacsan/caliper-ui/styles.css';
import { Button } from '@ryancalacsan/caliper-ui';

export function Example() {
  return <Button onClick={() => alert('hi')}>Save changes</Button>;
}
```

Themes switch by a `data-theme` attribute on `<html>` (`"light"` or `"dark"`);
with no attribute set, the OS `prefers-color-scheme` decides. Want only the
tokens (the CSS custom properties), without component styles? Import
`@ryancalacsan/caliper-ui/tokens.css` instead.

### Next.js App Router

The styling is global CSS, so import it once in the root layout. Interactive
components (`Modal`, `Select`, `Tabs`, `Tooltip`, `Checkbox`, `RadioGroup`,
`TextField`) are marked `"use client"`; `Button` renders on the server.

```tsx
// app/layout.tsx
import '@ryancalacsan/caliper-ui/styles.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
```

To set the theme from the user's choice with no flash on first paint, set
`data-theme` before React hydrates with a tiny inline script in `<head>`:

```tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html:
        "try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}",
    }}
  />
</head>
```

A consumer can override any token by redefining its custom property (for example
`:root { --color-signal: #2347ff; }`) after the import.

## Class names and collisions

Caliper emits unprefixed BEM class names (`button`, `card`, `prose`, and so on).
If your app defines its own top-level class with one of these names, the
library's styles will apply to it too. The reserved top-level block class names:

> `app-header`, `aspect-ratio`, `back-to-top`, `badge`, `button`, `callout`,
> `card`, `checkbox`, `container`, `crosshair`, `dimension-line`, `divider`,
> `drawer`, `eyebrow`, `frame`, `grid`, `grid-backdrop`, `heading`, `icon`,
> `inline`, `link`, `mark`, `measure-frame`, `modal`, `nav-link`, `prose`,
> `radio-group`, `section`, `select`, `sheet-header`, `skip-link`, `spacer`,
> `stack`, `stat`, `stat-group`, `tabs`, `text`, `text-field`,
> `theme-toggle`, `tooltip`, `visually-hidden`

Avoid these names for your own elements, or scope your own styles (CSS Modules, a
prefix, or a cascade layer). A future major release will prefix every emitted
class with `cui-` so the library is collision-proof by default.

## Recipes

**Measure a specific element with `DimensionLine`.** The line is `width: 100%` of
its parent, so to dimension one element (rather than its container), put the
element and the line together in a `fit-content` wrapper. `MeasureFrame` does
exactly this around a headline, with the dashed frame and crop marks; reach for
it directly, or replicate the pattern for other content.

**Equal-height cards in a grid.** Put the cards in a `Grid` (its items stretch by
default) and set `fill` on each card. The body grows so the footers line up
across the row, with no consumer CSS:

```tsx
<Grid minItemWidth="16rem" gap="md">
  {projects.map((p) => (
    <Card key={p.id} fill footer={<Link href={p.href}>View</Link>}>
      ...
    </Card>
  ))}
</Grid>
```

**A whole card as a link.** Set `interactive` on the `Card` and `stretch` on the
title `Link`. The link's hit area covers the card, so a click anywhere follows
it, while footer actions stay clickable:

```tsx
<Card
  interactive
  header={
    <Heading level={3}>
      <Link stretch tone="inherit" underline="none" href={p.href}>
        {p.title}
      </Link>
    </Heading>
  }
  footer={<Button>Share</Button>}
>
  ...
</Card>
```

**Use with next-themes (or another theme store).** Caliper reads `data-theme` on
`<html>`. next-themes writes a class by default, so set it to write both:

```tsx
<ThemeProvider attribute={['class', 'data-theme']} defaultTheme="system" enableSystem>
```

Let next-themes own the theme (it handles persistence and the no-flash script).
Either keep your existing toggle, or use Caliper's `ThemeToggle` in controlled
mode so it defers to the store instead of managing `data-theme` itself:

```tsx
'use client';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '@ryancalacsan/caliper-ui';

export function Toggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <ThemeToggle
      theme={resolvedTheme as 'light' | 'dark' | undefined}
      onThemeChange={setTheme}
    />
  );
}
```

## What is here

- **React + TypeScript**, built with Vite.
- **Design tokens** as SCSS maps, mirrored to CSS custom properties.
- **41 components** with typed props, BEM SCSS, and full keyboard and ARIA
  support: eight interactive (Button, TextField, Modal, Checkbox, RadioGroup,
  Select, Tabs, Tooltip), plus layout primitives, typography, content and
  data-display, the Spec Sheet motifs, and navigation chrome.
- **Storybook** with the accessibility (axe) addon, prop controls, and a usage
  doc per component.
- **Tests**: interaction tests that drive the keyboard flows, and visual
  regression snapshots of each component in both themes.
- **A lint and format baseline**: oxlint for TypeScript, Stylelint for SCSS,
  Prettier for everything else.

## Why no Tailwind

This is a deliberate choice, not an oversight.

Utility frameworks are a fine fit for a lot of products. They are a poor fit for
a piece whose entire point is to show CSS and design-system thinking. Tailwind
would move the interesting decisions into class strings in the markup and hide
the cascade, the naming, and the token system that this project is meant to put
on display.

Writing the styles by hand keeps a few things true:

- **The structure is visible.** BEM names say what each rule is for. A reader can
  open a `.scss` file and see the block, its elements, and its modifiers without
  decoding a chain of utilities.
- **Tokens stay central.** Components reference `var(--color-primary)` and
  `var(--space-md)`, never a raw value. Change a token in one place and the whole
  system moves with it. That is the part of a design system that matters, and it
  is hard to show through utility classes.
- **The CSS is the artifact.** For a CSS-forward role, the stylesheet is the work
  sample. Hiding it behind a framework would defeat the purpose.

None of this is a knock on utilities. It is a statement that for this brief, the
hand-written stylesheet is the point.

## Design-system thinking

The system is built in layers, each one depending only on the layer below it.

**Tokens are the source of truth.** Color, type, spacing, radii, motion, and
z-index live as SCSS maps in `src/tokens/`. Nothing in a component is a magic
number. A token is defined once and reaches the rest of the system two ways:

1. A build step walks every map and emits a matching CSS custom property on
   `:root` (`src/styles/_root.scss`). Components read `var(--space-md)`, so a
   theme can change at runtime without a rebuild.
2. Typed accessor functions (`src/styles/_functions.scss`) expose the same maps
   to Sass for the cases that need a compile-time value, like a `calc()` or a
   media query. Ask for a token that does not exist and the build stops with a
   clear error.

Edit one line in `src/tokens/`, and both paths update together.

**Color roles, not raw colors.** The palette has two levels. Primitives are the
raw ramps — a warm `neutral` ramp (paper to ink), `signal` (construction orange),
plus danger and success. Semantic roles (`text`, `primary`, `danger`,
`border-strong`) are what components actually use. Every text-on-surface pairing
is chosen to meet WCAG 2.2 AA, and the pairings are verified by a script rather
than by eye (`npm run test:contrast`). That script earned its keep: it forced two
honest splits the eye would have missed — `signal` (the vivid mark color, which
cannot clear AA as text on light paper) from `accent-text` (a darker burnt orange
that carries any orange text, links, and the focus ring), and `danger` from
`danger-solid` (a darker red so a danger button's white label still passes).

**A technical aesthetic.** The look is "Spec Sheet": the system is drawn like an
engineering document — a blueprint grid, a crop-mark frame, crosshair
registration marks, dimension annotations, and mono spec labels. A grotesque
(Hanken Grotesk) set big and tight for display and used for UI, a monospace
(Geist Mono) for the labels, both self-hosted via Fontsource. Warm paper and ink,
near-square corners, with one construction-orange signal. It is an inversion
model: the light theme is a paper spec sheet, the dark theme a dev-mode terminal.
None of this lives in component logic — it is the token layer, so it could be
re-skinned again the same way the dark theme was added.

**Two themes, one set of roles.** The dark theme is the payoff of that split. It
is a second set of values for the same role names, and nothing else. No
component file changed to support it. Switching is a single `data-theme="dark"`
attribute on the root, and the system also follows the OS `prefers-color-scheme`
when no choice is set. The dark theme is held to the same AA bar, which surfaced
one honest refinement: a danger button needs a dark enough red for its white
label, while danger _text_ needs a light enough red on a dark surface. Those are
different jobs, so the solid action color lives in its own role rather than being
overloaded onto the text color. The demo page has a toggle; Storybook has one in
its toolbar so the axe panel can check both themes.

**Accessibility is structural.** It is part of each component's contract:

- Components render real semantic elements. The Button is a `<button>`, so
  keyboard activation and focus come from the platform.
- Focus is always visible. A shared `focus-ring` mixin uses `:focus-visible` so
  the ring shows for keyboard users without flashing on mouse clicks.
- The Modal traps focus while open, closes on Escape, restores focus to the
  trigger on close, locks background scroll, and exposes `role="dialog"` with
  `aria-modal` and a linked title.
- The TextField wires up `htmlFor`/`id`, `aria-describedby` for help and error
  text, `aria-invalid` in the error state, and a live region so errors are
  announced. The error state also uses a non-color cue, so it does not rely on a
  user seeing red.
- Motion respects `prefers-reduced-motion`. Every animation is behind a
  motion-safe guard, with a global reduced-motion reset as a backstop.

Storybook ships with the axe addon enabled so these checks run against every
story, visibly, in the Accessibility panel.

## Testing

Two layers, both running the real components in a real browser.

**Interaction tests** live in the stories as `play` functions and run headless
through the Storybook Vitest addon (`npm test`). They drive the behavior that is
hard to eyeball: arrow-key navigation in Tabs, type-ahead and selection in
Select, the Modal focus trap and focus restore, the Tooltip showing on focus and
dismissing on Escape. Because they are play functions, the same steps also replay
visibly in Storybook's Interactions panel.

**Visual regression** lives in `tests/visual.spec.ts` and runs with Playwright
(`npm run test:visual`). It snapshots one representative story per component in
both the light and dark themes, so a styling change that shifts a pixel is caught
on review. Baselines are committed under `tests/__screenshots__/`. They carry the
OS in the file name, so a run on a different platform regenerates rather than
fails falsely; update them on purpose with `npm run test:visual:update`, and in
CI generate them in the official Playwright container so they match.

**CI** (`.github/workflows/ci.yml`) runs all of this on every push and pull
request: lint, format, types, and build in one job, the interaction tests and
the visual regression in the pinned Playwright container so the screenshots
compare against matching baselines. The committed baselines include a Linux set
generated in that same image.

## Deployment

The demo and the docs ship from a single Vercel project connected to this repo,
so every push to `main` deploys production and every pull request gets a preview
URL. One build produces both: the `vercel-build` script builds the demo, then
builds Storybook into `dist/storybook`, so the landing page serves at the root
and the component docs at `/storybook`.

- Demo: <https://caliper-ui.vercel.app>
- Storybook: <https://caliper-ui.vercel.app/storybook/>

## Project structure

```
src/
  tokens/            SCSS maps: the single source of truth
    _colors.scss       primitives + semantic roles (AA contrast)
    _typography.scss   modular type scale, weights, line heights
    _spacing.scss      4px spacing grid
    _radii.scss        border radii
    _elevation.scss    z-index scale + shadows
    _motion.scss       durations + easings
    _breakpoints.scss  named viewport widths
    _index.scss        forwards every map
  styles/            the token-to-CSS bridge and shared helpers
    _root.scss         emits custom properties from the maps
    _functions.scss    typed token accessors for Sass
    _mixins.scss       focus-ring, field-focus, media queries, reduced-motion
    _reset.scss        minimal modern reset
    fonts.ts           self-hosted variable fonts (Fontsource)
    global.scss        the entry point that ties it together
  components/
    Button/            variants, sizes, shapes (pill), loading
    TextField/         label, help text, error state, ARIA wiring
    Modal/             focus trap, escape, focus restore, scroll lock
    Checkbox/          checked + indeterminate via pseudo-classes
    RadioGroup/        fieldset/legend group, per-option help
    Select/            ARIA listbox: activedescendant, type-ahead
    Tabs/              roving tabindex, arrow keys, sliding indicator
    Tooltip/           hover + focus, escape to dismiss, describedby
  foundations/       live Storybook specimens (color, type)
  docs/
    Introduction.mdx   the branded Storybook cover page
    Tokens.mdx         the token reference, rendered in Storybook
scripts/
  check-contrast.mjs   WCAG AA check for every color pairing
tests/
  visual.spec.ts       Playwright visual regression, light and dark
  __screenshots__/     committed baselines
```

Each component folder holds the component, its `.scss`, a typed `index.ts`, a
Storybook story (with `play` interaction tests), and a usage doc through
autodocs.

## Getting started

```bash
npm install
npm run storybook     # component docs + a11y panel at http://localhost:6006
npm run dev           # the demo page at http://localhost:5173
```

## Scripts

| Script                       | What it does                        |
| ---------------------------- | ----------------------------------- |
| `npm run dev`                | Run the Vite demo page              |
| `npm run storybook`          | Run Storybook with the a11y addon   |
| `npm test`                   | Interaction tests (play functions)  |
| `npm run test:contrast`      | Verify every color pairing meets AA |
| `npm run test:visual`        | Visual regression against baselines |
| `npm run test:visual:update` | Refresh the visual baselines        |
| `npm run build`              | Type-check and build the library    |
| `npm run build-storybook`    | Build the static Storybook site     |
| `npm run lint`               | oxlint (TS) and Stylelint (SCSS)    |
| `npm run format`             | Prettier write                      |
| `npm run typecheck`          | TypeScript, no emit                 |

## Where it is now

The system has grown to **38 components** across interactive controls, layout
primitives, typography, content and data display, the Spec Sheet motifs, and
navigation chrome — all on the same token layer, proven by a second (dark) theme,
with the keyboard flows and visuals under test and CI on every push. It is
published to npm (`@ryancalacsan/caliper-ui`) via Changesets and Trusted
Publishing (OIDC, with provenance), and deployed: the demo at the root and the
full Storybook at `/storybook`.
