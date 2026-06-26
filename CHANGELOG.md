# @ryancalacsan/caliper-ui

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
