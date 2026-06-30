// =============================================================================
// Token build: DTCG JSON -> tokens/tokens.css + src/tokens/_generated.scss
// -----------------------------------------------------------------------------
// The tokens under tokens/*.json (W3C DTCG) are the single source of truth.
// This renders two outputs from them:
//   - tokens/tokens.css     the published custom properties, two-theme structure
//   - src/tokens/_generated.scss  the SCSS maps the components compile against
// Both are committed; scripts/check-token-parity.mjs fails CI if either drifts.
//
// Values are emitted verbatim (the resolver runs only name/kebab), so the output
// matches the prior hand-rolled token layer byte for byte.
// =============================================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, SOURCES, resolveTokens } from './_resolve.mjs';

// Primitives (palette.*) are referenced by the semantic roles but never emitted.
const EXCLUDE_TOP = new Set(['palette']);

// Group order within :root, matching the prior file.
const ROOT_ORDER = [
  'color', 'space', 'font', 'text', 'weight', 'leading', 'tracking',
  'radius', 'z', 'shadow', 'duration', 'ease', 'motif',
];

const light = await resolveTokens(SOURCES.light);
const dark = await resolveTokens(SOURCES.dark);

// --- tokens.css ------------------------------------------------------------

const ordered = (tokens, groups) =>
  groups.flatMap((g) => tokens.filter((t) => t.path[0] === g));
const emit = (tokens) => tokens.map((t) => `  --${t.name}: ${t.value};`).join('\n');
const block = (selector, scheme, tokens) =>
  `${selector} {\n  color-scheme: ${scheme};\n${emit(tokens)}\n}`;

const lightEmitted = light.filter((t) => !EXCLUDE_TOP.has(t.path[0]));
const lightColors = ordered(lightEmitted, ['color']);
const darkDeltas = ordered(dark.filter((t) => !EXCLUDE_TOP.has(t.path[0])), ['color', 'shadow']);

const mediaBlock =
  `@media (prefers-color-scheme: dark) {\n` +
  block(':root:not([data-theme=light])', 'dark', darkDeltas)
    .split('\n')
    .map((l) => (l ? `  ${l}` : l))
    .join('\n') +
  `\n}`;

const css =
  [
    block(':root', 'light', ordered(lightEmitted, ROOT_ORDER)),
    block('[data-theme=light]', 'light', lightColors),
    block('[data-theme=dark]', 'dark', darkDeltas),
    mediaBlock,
  ].join('\n\n') + '\n';

const cssDest = resolve(ROOT, 'tokens/tokens.css');
writeFileSync(cssDest, css);
console.log(`Wrote ${cssDest} (${css.split('\n').length} lines, ${lightEmitted.length} :root tokens)`);

// --- SCSS maps -------------------------------------------------------------
// List values (font stacks, layered shadows) are wrapped in parens; the dark
// shadows keep their modern rgb() syntax through a quoted string so it survives
// Sass interpolation.

const top = (toks, ...prefix) =>
  toks.filter((t) => prefix.every((p, i) => t.path[i] === p));
const key = (t) => t.path[t.path.length - 1];

function sassMap(name, tokens, { parens = false, quote = false } = {}) {
  const lines = tokens
    .map((t) => {
      const v = quote ? `'${t.value}'` : parens ? `(${t.value})` : t.value;
      return `  '${key(t)}': ${v},`;
    })
    .join('\n');
  return `$${name}: (\n${lines}\n);`;
}

const maps = [
  sassMap('neutral', top(light, 'palette', 'neutral')),
  sassMap('signal', top(light, 'palette', 'signal')),
  sassMap('danger', top(light, 'palette', 'danger')),
  sassMap('success', top(light, 'palette', 'success')),
  sassMap('semantic', top(light, 'color')),
  sassMap('semantic-dark', top(dark, 'color')),
  sassMap('spacing', top(light, 'space')),
  sassMap('font-family', top(light, 'font'), { parens: true }),
  sassMap('font-size', top(light, 'text')),
  sassMap('font-weight', top(light, 'weight')),
  sassMap('line-height', top(light, 'leading')),
  sassMap('letter-spacing', top(light, 'tracking')),
  sassMap('radii', top(light, 'radius')),
  sassMap('z-index', top(light, 'z')),
  sassMap('shadow', top(light, 'shadow'), { parens: true }),
  sassMap('shadow-dark', top(dark, 'shadow'), { quote: true }),
  sassMap('duration', top(light, 'duration')),
  sassMap('easing', top(light, 'ease')),
  sassMap('motif', top(light, 'motif')),
];

const scss =
  `// =============================================================================\n` +
  `// GENERATED FILE - do not edit.\n` +
  `// Source of truth: tokens/*.json (W3C DTCG). Regenerate with: npm run build:tokens\n` +
  `// =============================================================================\n\n` +
  maps.join('\n\n') +
  '\n';

const scssDest = resolve(ROOT, 'src/tokens/_generated.scss');
writeFileSync(scssDest, scss);
console.log(`Wrote ${scssDest} (${maps.length} maps)`);
