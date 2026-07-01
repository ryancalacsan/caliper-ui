// =============================================================================
// Figma export: DTCG JSON -> tokens/figma/{light,dark}.json
// -----------------------------------------------------------------------------
// One resolved DTCG file per theme (one file = one Figma mode), the shape
// Figma's native variable import and Tokens Studio consume. Aliases are
// resolved and the color primitives (palette.*) are dropped, so each file is a
// self-contained set of the semantic + scale tokens. The group structure
// (color/*, space/*, ...) maps to Figma collection -> group -> variable.
//
// The plugin-free REST import (scripts/figma-push.mjs) is the primary path and
// builds both modes in one collection; these files are the manual-import
// alternative.
// =============================================================================

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, SOURCES, resolveTokens } from './_resolve.mjs';

const EXCLUDE_TOP = new Set(['palette']);

const TYPE_BY_CATEGORY = {
  color: 'color',
  space: 'dimension',
  text: 'dimension',
  radius: 'dimension',
  motif: 'dimension',
  tracking: 'dimension',
  weight: 'fontWeight',
  leading: 'number',
  z: 'number',
  duration: 'duration',
  ease: 'cubicBezier',
  font: 'fontFamily',
  shadow: 'shadow',
};

function toDtcg(tokens) {
  const tree = {};
  for (const t of tokens) {
    if (EXCLUDE_TOP.has(t.path[0])) continue;
    let node = tree;
    for (let i = 0; i < t.path.length - 1; i += 1) {
      node[t.path[i]] ??= {};
      node = node[t.path[i]];
    }
    node[t.path.at(-1)] = {
      $type: t.type ?? TYPE_BY_CATEGORY[t.path[0]] ?? 'string',
      $value: t.value,
    };
  }
  return tree;
}

const outDir = resolve(ROOT, 'tokens/figma');
mkdirSync(outDir, { recursive: true });

const trees = {};
for (const mode of ['light', 'dark']) {
  const tokens = await resolveTokens(SOURCES[mode]);
  trees[mode] = toDtcg(tokens);
  const dest = resolve(outDir, `${mode}.json`);
  writeFileSync(dest, JSON.stringify(trees[mode], null, 2) + '\n');
  console.log(`Wrote ${dest}`);
}

// Combined Tokens Studio file: the two modes as token sets, plus a $themes block
// that maps them to a Light/Dark "Caliper" collection on export to Figma.
const studio = {
  light: trees.light,
  dark: trees.dark,
  $themes: [
    {
      id: 'caliper-light',
      name: 'Light',
      group: 'Caliper',
      selectedTokenSets: { light: 'enabled' },
    },
    {
      id: 'caliper-dark',
      name: 'Dark',
      group: 'Caliper',
      selectedTokenSets: { dark: 'enabled' },
    },
  ],
  $metadata: { tokenSetOrder: ['light', 'dark'] },
};
const studioDest = resolve(outDir, 'tokens-studio.json');
writeFileSync(studioDest, JSON.stringify(studio, null, 2) + '\n');
console.log(`Wrote ${studioDest}`);
