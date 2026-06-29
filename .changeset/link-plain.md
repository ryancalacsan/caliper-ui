---
'@ryancalacsan/caliper-ui': minor
---

`Link` gains a `tone` prop (`accent` by default, or `inherit`) and a `none`
option for `underline`. Together, `tone="inherit" underline="none"` renders a
plain link - the surrounding color, no underline - so a structural link like a
stretched card title needs no consumer CSS to override the accent styling.
Defaults are unchanged.
