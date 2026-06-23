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
// Composite a translucent fg over an opaque bg (for tinted surfaces).
function over(hex, alpha, bgHex) {
  const h = hex.replace('#', '');
  const b = bgHex.replace('#', '');
  const mix = (i) => {
    const f = parseInt(h.slice(i, i + 2), 16);
    const k = parseInt(b.slice(i, i + 2), 16);
    return Math.round(f * alpha + k * (1 - alpha));
  };
  const c = (n) => n.toString(16).padStart(2, '0');
  return `#${c(mix(0))}${c(mix(2))}${c(mix(4))}`;
}

const light = {
  bg: '#f4f1ea',
  surface: '#fffefb',
  text: '#0a0d14',
  'text-muted': '#444d63',
  'text-subtle': '#5f6982',
  primary: '#6244e0',
  'text-on-primary': '#ffffff',
  'accent-text': '#6244e0',
  'border-strong': '#8089a0',
  'danger-solid': '#b91c1c',
  danger: '#b91c1c',
  'primary-bg': '#f1effe',
};
const dark = {
  bg: '#0a0d14',
  surface: '#161b29',
  text: '#f4f1ea',
  'text-muted': '#a8b0c2',
  'text-subtle': '#8089a0',
  primary: '#8f7af4',
  'text-on-primary': '#0a0d14',
  'accent-text': '#ab9bf8',
  'border-strong': '#8089a0',
  'danger-solid': '#dc2626',
  danger: '#f87171',
};

// [label, fg, bg, minimum]
const checks = (t, isDark) => [
  ['text on bg', t.text, t.bg, 4.5],
  ['text on surface', t.text, t.surface, 4.5],
  ['text-muted on surface', t['text-muted'], t.surface, 4.5],
  ['text-subtle on surface', t['text-subtle'], t.surface, 4.5],
  ['label on primary button', t['text-on-primary'], t.primary, 4.5],
  ['white on danger-solid', '#ffffff', t['danger-solid'], 4.5],
  ['danger text on surface', t.danger, t.surface, 4.5],
  ['border-strong vs surface', t['border-strong'], t.surface, 3.0],
  ['primary fill vs bg (UI)', t.primary, t.bg, 3.0],
  ['accent-text on surface', t['accent-text'], t.surface, 4.5],
  isDark
    ? [
        'accent-text on iris tint',
        t['accent-text'],
        over('#8f7af4', 0.18, t.surface),
        4.5,
      ]
    : ['accent-text on iris tint', t['accent-text'], light['primary-bg'], 4.5],
];

let failed = 0;
for (const [name, rows] of [
  ['LIGHT (editorial)', checks(light, false)],
  ['DARK (noir)', checks(dark, true)],
]) {
  console.log(`\n${name}`);
  for (const [label, fg, bg, min] of rows) {
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)} (min ${min})  ${label}  ${fg} on ${bg}`,
    );
  }
}
console.log(`\n${failed === 0 ? 'All pairings pass AA.' : `${failed} FAILED.`}`);
process.exit(failed === 0 ? 0 : 1);
