// =============================================================================
// Shared token resolver
// -----------------------------------------------------------------------------
// Resolves a DTCG source set (base + one theme) through Style Dictionary and
// returns a flat list of { name, value, path, type }. Only the name/kebab
// transform runs, so values come back verbatim (no color/size normalization).
// Used by build-tokens.mjs (CSS + SCSS), build-figma.mjs, and figma-push.mjs.
// =============================================================================

import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const tokenFile = (p) => resolve(ROOT, 'tokens', p);

export const SOURCES = {
  light: ['primitives.json', 'base.json', 'theme.light.json'].map(tokenFile),
  dark: ['primitives.json', 'base.json', 'theme.dark.json'].map(tokenFile),
};

function flatten(node, out = []) {
  if (node && typeof node === 'object') {
    const value = node.$value ?? node.value;
    if (typeof node.name === 'string' && value !== undefined) {
      out.push({
        name: node.name,
        value: String(value),
        path: node.path,
        type: node.$type ?? node.type,
      });
      return out;
    }
    for (const key of Object.keys(node)) {
      if (key.startsWith('$') || key === 'name' || key === 'path') continue;
      flatten(node[key], out);
    }
  }
  return out;
}

export async function resolveTokens(sources) {
  const sd = new StyleDictionary({
    usesDtcg: true,
    source: sources,
    platforms: { css: { transforms: ['name/kebab'], files: [] } },
  });
  await sd.hasInitialized;
  return flatten(await sd.exportPlatform('css'));
}
