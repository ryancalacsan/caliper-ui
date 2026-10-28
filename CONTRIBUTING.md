# Contributing to Caliper UI

Thanks for your interest. This covers the development setup, how the project is
laid out, and how it is tested and released.

## Getting started

```bash
npm install
npm run storybook     # component docs + a11y panel at http://localhost:6006
npm run dev           # the demo page at http://localhost:5173
```

Each component lives in its own folder under `src/components/` with the
component, its `.scss`, a typed `index.ts`, a Storybook story (with `play`
interaction tests), and a usage doc via autodocs.

## Design tokens

The tokens are the single source of truth and are authored as W3C DTCG JSON under
`tokens/`. Everything else - the published `tokens.css`, the SCSS maps the
components compile against, and the Figma exports - is generated from there.

```bash
npm run build:tokens   # regenerate tokens/tokens.css + src/tokens/_generated.scss
npm run build:figma    # regenerate the Figma exports under tokens/figma/
npm run tokens:check   # rebuild and fail if any generated output has drifted
```

Do not edit the generated files (`tokens/tokens.css`, `src/tokens/_generated.scss`,
`tokens/figma/*.json`) by hand - change `tokens/*.json` and rebuild. CI runs
`tokens:check` and fails on drift. `src/tokens/_breakpoints.scss` is the one
hand-authored map: breakpoints are consumed only in Sass (a media query can't
read a custom property) and are not part of the DTCG/CSS/Figma pipeline.

## Testing

Two layers, both running the real components in a real browser.

**Interaction tests** live in the stories as `play` functions and run headless
through the Storybook Vitest addon (`npm test`). They drive the behavior that is
hard to eyeball: arrow-key navigation in Tabs, type-ahead and selection in
Select, the Modal focus trap and focus restore, the Tooltip showing on focus and
dismissing on Escape. The same steps replay visibly in Storybook's Interactions
panel.

**Visual regression** lives in `tests/visual.spec.ts` and runs with Playwright
(`npm run test:visual`). It snapshots one representative story per component in
both themes, so a styling change that shifts a pixel is caught on review.
Baselines are committed under `tests/__screenshots__/` and carry the OS in the
file name, so a run on a different platform regenerates rather than fails
falsely. Update them on purpose with `npm run test:visual:update`; in CI they run
in the pinned Playwright container so screenshots compare against matching
baselines (a Linux set is committed for that image).

**Contrast** is checked by `npm run test:contrast`, which verifies every
color-role pairing meets WCAG 2.2 AA.

**CI** (`.github/workflows/ci.yml`) runs all of this on every push and pull
request: lint, format, types, the token drift check, and the build in one job;
the interaction tests and visual regression in the pinned Playwright container.

## Dependency updates

Dependabot (`.github/dependabot.yml`) opens grouped update PRs monthly. A few
packages are on its ignore list because they can't be bumped automatically:
Playwright moves with the CI image and the visual baselines, and some majors
need hand migration. The reason is the comment above each ignore entry.

So an ignore never means a missed upgrade, the **Held-back upgrades** workflow
runs monthly and keeps an issue of that name open while any ignored package has
a newer version out. Run `npm run deps:held` to see the same report locally.
When a reason stops applying, upgrade by hand and remove the ignore.

## Releases and deployment

Releases go out via [Changesets](https://github.com/changesets/changesets) and
npm Trusted Publishing (OIDC, with provenance) - no stored npm token. Add a
changeset with `npm run changeset` in any PR that should ship; merging the
resulting Version PR publishes.

The demo and docs ship from a single Vercel project: every push to `main` deploys
production and every pull request gets a preview URL. One `vercel-build` produces
both - the demo at the root and Storybook at `/storybook`.

- Demo: <https://caliper-ui.vercel.app>
- Storybook: <https://caliper-ui.vercel.app/storybook/>

## Project structure

```
tokens/                 DTCG token source - the single source of truth
  primitives.json         color ramps (neutral, signal, danger, success)
  base.json               space, type, radius, motion, motif (theme-independent)
  theme.light.json        semantic color roles + shadows, light
  theme.dark.json         semantic color roles + shadows, dark
  tokens.css              generated CSS custom properties (committed)
  figma/                  generated Figma exports (per-mode + Tokens Studio)
src/
  tokens/
    _generated.scss       SCSS maps generated from the DTCG source
    _breakpoints.scss     named viewport widths (Sass-only)
    _index.scss           forwards the maps
  styles/                 the token-to-CSS bridge and shared helpers
    _root.scss              emits custom properties from the maps, per theme
    _functions.scss         typed token accessors for Sass (calc, media queries)
    _mixins.scss            focus-ring, field-focus, media queries, reduced-motion
    _reset.scss             minimal modern reset
    fonts.ts                self-hosted variable fonts (Fontsource)
    global.scss             the entry point that ties it together
  components/             one folder per component (.tsx, .scss, index.ts, .stories.tsx)
scripts/
  build-tokens.mjs        DTCG -> tokens.css + SCSS maps
  build-figma.mjs         DTCG -> Figma exports
  figma-push.mjs          Figma Variables REST import (gated on env)
  check-token-parity.mjs  token drift check
  check-contrast.mjs      WCAG AA check for every color pairing
  check-lib.mjs           asserts the published build is complete
  build-fonts.mjs         inlines the fonts into the library CSS
tests/
  visual.spec.ts          Playwright visual regression, light and dark
  __screenshots__/        committed baselines
```

## Scripts

| Script                       | What it does                               |
| ---------------------------- | ------------------------------------------ |
| `npm run dev`                | Run the Vite demo page                     |
| `npm run storybook`          | Run Storybook with the a11y addon          |
| `npm test`                   | Interaction tests (play functions)         |
| `npm run test:contrast`      | Verify every color pairing meets AA        |
| `npm run test:visual`        | Visual regression against baselines        |
| `npm run test:visual:update` | Refresh the visual baselines               |
| `npm run build:tokens`       | Regenerate tokens.css + the SCSS maps      |
| `npm run build:figma`        | Regenerate the Figma exports               |
| `npm run tokens:check`       | Fail if any generated token output drifted |
| `npm run build:lib`          | Build the publishable library into `lib/`  |
| `npm run build`              | Type-check and build the demo              |
| `npm run lint`               | oxlint (TS) and Stylelint (SCSS)           |
| `npm run format`             | Prettier write                             |
| `npm run typecheck`          | TypeScript, no emit                        |
| `npm run deps:held`          | List upgrades Dependabot is holding back   |
| `npm run changeset`          | Record a changeset for the next release    |
