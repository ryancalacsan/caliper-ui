---
'@ryancalacsan/caliper-ui': minor
---

`GridBackdrop` gains a `variant` prop (`lines` by default, or `dots`). The dot
grid reuses the existing spacing rhythm (`--motif-grid` / `--motif-grid-fine`)
and grid-line color, so it composes with both `size` values and flips per theme
like the ruled lines. Backed by a new `--motif-dot-radius` token. Additive - the
default is unchanged.
