---
'@ryancalacsan/caliper-ui': minor
---

Round-two consumer additions, from rebuilding the portfolio on Caliper. All
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
