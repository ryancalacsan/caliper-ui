// =============================================================================
// Figma Variables push (plugin-free import)
// -----------------------------------------------------------------------------
// Creates/updates a Caliper variable collection in a Figma file from the DTCG
// source: one collection, two modes (Light / Dark), with color and shadow
// values differing per mode and the rest shared. Colors are converted to
// Figma's 0..1 RGBA; dimensions become FLOATs in px (rem x 16); fluid, em, font,
// easing and shadow values stay STRINGs.
//
// Auth is read from the environment, never hard-coded:
//   FIGMA_TOKEN     a personal access token with file_variables:write
//   FIGMA_FILE_ID   the target file key (use a fresh/scratch file first)
//
// Usage:
//   node scripts/figma-push.mjs --dry-run     # print the payload, no network
//   FIGMA_TOKEN=... FIGMA_FILE_ID=... node scripts/figma-push.mjs
//
// Note: Figma's Variables REST *write* API requires an Enterprise org seat. On
// other plans the POST returns 403; use the native DTCG import or Tokens Studio
// with tokens/figma/{light,dark}.json instead.
// =============================================================================

import { SOURCES, resolveTokens } from './_resolve.mjs';

const DRY_RUN = process.argv.includes('--dry-run');
const EXCLUDE_TOP = new Set(['palette']);
const FLOAT_CATEGORIES = new Set([
  'space', 'text', 'radius', 'motif', 'weight', 'leading', 'z', 'duration',
]);

function parseColor(v) {
  const s = v.trim();
  if (s.startsWith('#')) {
    const h = s.slice(1);
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
      a: h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[,\s/]+/).filter(Boolean);
  const a = p[3] === undefined ? 1 : p[3].endsWith('%') ? parseFloat(p[3]) / 100 : +p[3];
  return { r: +p[0] / 255, g: +p[1] / 255, b: +p[2] / 255, a };
}

function parseFloatToken(v) {
  const s = v.trim();
  if (s === '0') return 0;
  const m = s.match(/^(-?[\d.]+)(rem|px|ms)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2] === 'rem' ? n * 16 : n;
}

// type + per-mode value for a token, given its light and dark string values.
function classify(path, lightValue, darkValue) {
  if (path[0] === 'color') {
    return { type: 'COLOR', light: parseColor(lightValue), dark: parseColor(darkValue) };
  }
  const f = FLOAT_CATEGORIES.has(path[0]) ? parseFloatToken(lightValue) : null;
  if (f !== null) return { type: 'FLOAT', light: f, dark: parseFloatToken(darkValue) ?? f };
  return { type: 'STRING', light: lightValue, dark: darkValue };
}

const light = (await resolveTokens(SOURCES.light)).filter((t) => !EXCLUDE_TOP.has(t.path[0]));
const dark = await resolveTokens(SOURCES.dark);
const darkByName = new Map(dark.map((t) => [t.name, t.value]));

const COLLECTION = 'caliper';
const MODE_LIGHT = 'mode-light';
const MODE_DARK = 'mode-dark';

const variables = [];
const modeValues = [];

light.forEach((t, i) => {
  const id = `var-${i}`;
  const figmaName = t.path.join('/'); // color/bg, space/md -> Figma groups
  const { type, light: lv, dark: dv } = classify(t.path, t.value, darkByName.get(t.name) ?? t.value);
  variables.push({
    action: 'CREATE',
    id,
    name: figmaName,
    variableCollectionId: COLLECTION,
    resolvedType: type,
  });
  modeValues.push({ variableId: id, modeId: MODE_LIGHT, value: lv });
  modeValues.push({ variableId: id, modeId: MODE_DARK, value: dv });
});

const payload = {
  variableCollections: [
    { action: 'CREATE', id: COLLECTION, name: 'Caliper', initialModeId: MODE_LIGHT },
  ],
  variableModes: [
    { action: 'UPDATE', id: MODE_LIGHT, name: 'Light', variableCollectionId: COLLECTION },
    { action: 'CREATE', id: MODE_DARK, name: 'Dark', variableCollectionId: COLLECTION },
  ],
  variables,
  variableModeValues: modeValues,
};

const summary = `Caliper -> Figma: ${variables.length} variables, 2 modes (Light/Dark), ${modeValues.length} mode values.`;

if (DRY_RUN) {
  console.log(summary);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const token = process.env.FIGMA_TOKEN;
const fileId = process.env.FIGMA_FILE_ID;
if (!token || !fileId) {
  console.error('Missing FIGMA_TOKEN and/or FIGMA_FILE_ID. Set both, or pass --dry-run.');
  process.exit(1);
}

console.log(summary);
const res = await fetch(`https://api.figma.com/v1/files/${fileId}/variables`, {
  method: 'POST',
  headers: { 'X-Figma-Token': token, 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
const body = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`Figma API ${res.status}: ${body.message ?? res.statusText}`);
  if (res.status === 403) {
    console.error('The Variables write API needs an Enterprise org seat. Use the native DTCG import instead.');
  }
  process.exit(1);
}
const created = Object.keys(body.meta?.tempIdToRealId ?? {}).length;
console.log(`Done. Figma resolved ${created} temp ids to real variable ids.`);
