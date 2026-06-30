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

for (const mode of ['light', 'dark']) {
  const tokens = await resolveTokens(SOURCES[mode]);
  const dest = resolve(outDir, `${mode}.json`);
  writeFileSync(dest, JSON.stringify(toDtcg(tokens), null, 2) + '\n');
  console.log(`Wrote ${dest}`);
}
