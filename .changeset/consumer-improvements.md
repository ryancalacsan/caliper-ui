---
'@ryancalacsan/caliper-ui': minor
---

Consumer-driven additions and fixes, from building the portfolio site with
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
