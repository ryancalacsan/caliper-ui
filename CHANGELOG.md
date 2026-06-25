# @ryancalacsan/caliper-ui

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
