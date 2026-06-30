---
'@ryancalacsan/caliper-ui': minor
---

Promote the design tokens to a single, tool-agnostic source of truth and
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
