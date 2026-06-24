// WCAG 2.2 contrast check for the semantic role pairings, both themes.
// Run with: node scripts/check-contrast.mjs
// Keep the values here in sync with src/tokens/_colors.scss.

function srgbToLinear(c) {
  const x = c / 255;
  return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}
function luminance(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}
function ratio(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

// Resolved semantic values, mirroring src/tokens/_colors.scss.
const light = {
  bg: '#f3f1ea',
  surface: '#faf8f2',
  text: '#16140f',
  'text-muted': '#565144',
  'text-subtle': '#6b6657',
  primary: '#16140f',
  'text-on-primary': '#fffdf7',
  'accent-text': '#b83400',
  signal: '#ff4d00',
  'border-strong': '#322f26',
  'danger-solid': '#b91c1c',
  danger: '#b91c1c',
  'focus-ring': '#b83400',
};
const dark = {
  bg: '#0f0d0a',
  surface: '#17150f',
  text: '#faf8f2',
  'text-muted': '#c7c2b2',
  'text-subtle': '#8b8678',
  primary: '#faf8f2',
  'text-on-primary': '#0f0d0a',
  'accent-text': '#ff6a23',
  signal: '#ff5a1a',
  'border-strong': '#8b8678',
  'danger-solid': '#dc2626',
  danger: '#f87171',
  'focus-ring': '#ff5a1a',
};

// [label, fg, bg, minimum, optional:'info']
const checks = (t) => [
  ['text on bg', t.text, t.bg, 4.5],
  ['text on surface', t.text, t.surface, 4.5],
  ['text-muted on surface', t['text-muted'], t.surface, 4.5],
  ['text-subtle on surface', t['text-subtle'], t.surface, 4.5],
  ['label on primary button', t['text-on-primary'], t.primary, 4.5],
  ['white on danger-solid', '#ffffff', t['danger-solid'], 4.5],
  ['danger text on surface', t.danger, t.surface, 4.5],
  ['accent-text on surface', t['accent-text'], t.surface, 4.5],
  ['border-strong vs surface', t['border-strong'], t.surface, 3.0],
  ['primary fill vs bg (UI)', t.primary, t.bg, 3.0],
  ['focus-ring vs bg (UI)', t['focus-ring'], t.bg, 3.0],
  // Informational: the vivid signal is decorative (marks, crop frame), not
  // essential text, so it is not gated - but worth seeing.
  ['signal mark vs bg [info]', t.signal, t.bg, 0, 'info'],
];

let failed = 0;
for (const [name, rows] of [
  ['LIGHT (paper)', checks(light)],
  ['DARK (dev mode)', checks(dark)],
]) {
  console.log(`\n${name}`);
  for (const [label, fg, bg, min, info] of rows) {
    const r = ratio(fg, bg);
    const ok = info ? true : r >= min;
    if (!ok) failed++;
    const tag = info ? 'INFO' : ok ? 'PASS' : 'FAIL';
    console.log(
      `  ${tag}  ${r.toFixed(2)}${min ? ` (min ${min})` : ''}  ${label}  ${fg} on ${bg}`,
    );
  }
}
console.log(`\n${failed === 0 ? 'All gated pairings pass AA.' : `${failed} FAILED.`}`);
process.exit(failed === 0 ? 0 : 1);
