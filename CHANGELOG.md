# @ryancalacsan/caliper-ui

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
