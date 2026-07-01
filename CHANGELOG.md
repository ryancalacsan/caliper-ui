# @ryancalacsan/caliper-ui

## 0.11.1

### Patch Changes

- b027851: Rewrite the README as product documentation: lead with what the library is and
  why to use it (features, install, usage, component list), reframe the styling and
  accessibility notes for adopters, and move the contributor material (development
  setup, testing, project structure, scripts) into a new CONTRIBUTING.md.

## 0.11.0

### Minor Changes

- cb6b86a: Promote the design tokens to a single, tool-agnostic source of truth and
  generate both the CSS and a Figma export from it.

  - The tokens are now authored as W3C DTCG JSON under `tokens/*.json`, grouped by
    category, with light and dark modeled as themes.
  - Style Dictionary (v4) generates the published `tokens.css` and the SCSS maps
    the components compile against, so code and Figma come from the same place. A
    CI drift check (`npm run tokens:check`) rebuilds from the source and fails if
    either output has changed without a rebuild.
  - Verified non-breaking by a value parity gate: the generated `tokens.css` and
    the compiled `caliper.css` are byte-for-byte identical to the prior
    hand-authored output. Consumers of `tokens.css` / `styles.css` see no change.
  - New Figma export: per-mode DTCG files (`tokens/figma/{light,dark}.json`) for
    native import or Tokens Studio, plus a plugin-free `figma:push` script that
    imports the variables through the Figma Variables REST API, with light/dark as
    the two modes of a `Caliper` collection. It is gated on `FIGMA_TOKEN` +
    `FIGMA_FILE_ID` and hard-codes no secrets.

  No public component API changed.

## 0.10.0

### Minor Changes

- 9bcdd46: `GridBackdrop` gains a `variant` prop (`lines` by default, or `dots`). The dot
  grid reuses the existing spacing rhythm (`--motif-grid` / `--motif-grid-fine`)
  and grid-line color, so it composes with both `size` values and flips per theme
  like the ruled lines. Backed by a new `--motif-dot-radius` token. Additive - the
  default is unchanged.

## 0.9.0

### Minor Changes

- c01fd3b: `Link` gains a `tone` prop (`accent` by default, or `inherit`) and a `none`
  option for `underline`. Together, `tone="inherit" underline="none"` renders a
  plain link - the surrounding color, no underline - so a structural link like a
  stretched card title needs no consumer CSS to override the accent styling.
  Defaults are unchanged.

## 0.8.0

### Minor Changes

- 2748303: Round-two consumer additions, from rebuilding the portfolio on Caliper. All
  additive - defaults are unchanged.

  - `Card` gains three layout capabilities: `fill` (equal-height cards in a grid,
    with the footer pinned to the bottom so action rows line up), `orientation`
    (`horizontal` sets media beside the body and reflows to vertical when narrow),
    and `interactive` (a clickable card surface with hover + focus-within ring).
  - `Link` gains a `stretch` prop - the stretched hit area that makes a whole
    `<Card interactive>` follow one link while footer actions stay clickable.
    (Stretch is `Link`-only: `NavLink`'s own positioned underline keeps an overlay
    from escaping past it.)
  - `Badge` gains `shape` (`square` takes the sharp radius to match the system).
  - `AspectRatio` gains `fit` (`contain` for diagrams, `cover` for photos).
  - `Frame` gains `marks` (`none` / `tlbr` / `all`) for the four-corner option.
  - `ThemeToggle` gains a controlled mode (`theme` + `onThemeChange`) so it can
    defer to an external store such as next-themes instead of owning `data-theme`
    itself.
  - README: recipes for using Caliper with next-themes, equal-height card grids,
    and whole-card links.

## 0.7.0

### Minor Changes

- 8127466: Consumer-driven additions and fixes, from building the portfolio site with
  Caliper:

  - New `Mark`: the highlighter underline accent (the orange bar behind text like
    "drawn to spec."), content-free and theme-aware.
  - `Heading` gains a fluid `display` size, backed by a new `--text-display` clamp
    token, for hero titles that scale with the viewport without overflowing on
    small screens.
  - `Prose` now sets list markers explicitly (`list-style: disc` / `decimal`), so a
    global reset in the host app (`ul, ol { list-style: none }`) can no longer
    strip rich-text bullets.
  - New `StatGroup`: the readout strip (a row of `Stat`s with dividers between
    them, wrapping responsibly on narrow screens).
  - `Frame` gains a `dashed` variant (the measurement-box treatment), keeping the
    registration corners.
  - New `MeasureFrame`: the signature dimensioned title-box motif - a dashed frame
    with crop-mark crosshairs and a content-width dimension line, sized to its
    content. Also covers the "measure a specific element" case for `DimensionLine`.
  - Documented the reserved top-level class names: Caliper emits unprefixed BEM
    classes that can collide with a host app's own classes. A `cui-` prefix is
    planned for the next major release.

## 0.6.0

### Minor Changes

- 72acb6a: Add the navigation & chrome layer: `AppHeader` (sticky, condenses to a glass bar
  on scroll), `NavLink` (active state + `aria-current`), `Link` (styled, with
  `asChild`), `Drawer` (focus-trapped side menu built on the Modal hooks),
  `ThemeToggle` (reads the theme after mount, so no hydration mismatch),
  `BackToTop`, `SkipLink`, and `VisuallyHidden`. The interactive ones are
  `"use client"`; the links and utilities stay server-renderable.

## 0.5.0

### Minor Changes

- 34cb0bc: Add the Spec Sheet motif components: `Frame` (crop-mark frame), `GridBackdrop`
  (blueprint grid backing), `Crosshair` (registration mark), `DimensionLine` (the
  "measured to the pixel" annotation), and `SheetHeader` (the meta bar). They draw
  on the motif tokens and let a page be reskinned in the Spec Sheet identity from
  reusable parts; the purely decorative ones are hidden from assistive tech.

## 0.4.0

### Minor Changes

- 874334d: Add content and data-display components: `Card` (bordered surface with
  media/header/body/footer regions), `Badge` (outline pill), `Stat` (spec
  readout), `Callout` (bordered note), `AspectRatio`, and an `Icon` convention
  wrapper that depends on no icon library. Extend `Button` with `asChild` (render
  the styling onto a link or framework `<Link>` via prop merging) and `iconOnly`.

## 0.3.0

### Minor Changes

- f6b3b88: Add a typography layer: `Heading` (semantic level decoupled from visual size),
  `Eyebrow` (the mono kicker label), `Text` (body copy with size/tone/weight/align
  props), and `Prose` (a styled container for rich-text / markdown output). All
  token-driven and theme-aware.

## 0.2.0

### Minor Changes

- fd5e168: Add layout primitives: `Container`, `Stack`, `Inline`, `Grid`, `Section`,
  `Spacer`, and `Divider`. Token-driven (gaps and padding map to the spacing
  scale), polymorphic via an `as` prop where it makes sense, and theme-aware.
  Exports shared `SpaceToken`, `Align`, and `Justify` types.
