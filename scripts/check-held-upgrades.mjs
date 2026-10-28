// =============================================================================
// Held-back upgrades report
// -----------------------------------------------------------------------------
// Dependabot skips the packages listed under `ignore:` in .github/dependabot.yml,
// so nothing would ever say a newer version is out. This reads that list, checks
// each package against the npm registry, and prints a Markdown report of the
// upgrades that are waiting, grouped by the reason comment above each entry.
//
// The ignore list is the single source: adding or removing an entry there
// changes this report. Run locally with `npm run deps:held`; the monthly
// held-upgrades workflow posts the output to a tracking issue.
// =============================================================================

import { readFileSync, appendFileSync } from 'node:fs';

const config = readFileSync('.github/dependabot.yml', 'utf8').split('\n');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const declared = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });

// --- Parse the ignore entries ------------------------------------------------
// A small line parser, not full YAML: it relies on the layout used in
// dependabot.yml (comment lines, then `- dependency-name:`, then an optional
// `update-types:` line). An entry with no comment of its own shares the reason
// of the entry above it.

const entries = [];
let inIgnore = false;
let comment = [];
let reason = '';
for (const line of config) {
  if (/^\s+ignore:\s*$/.test(line)) {
    inIgnore = true;
    continue;
  }
  if (!inIgnore) continue;
  if (/^\s*$/.test(line)) break;
  const c = line.match(/^\s+#\s?(.*)$/);
  const dep = line.match(/^\s+- dependency-name:\s*'?([^'\s]+)'?/);
  if (c) comment.push(c[1]);
  else if (dep) {
    if (comment.length) reason = comment.join(' ');
    comment = [];
    entries.push({ pattern: dep[1], majorOnly: false, reason });
  } else if (/update-types:.*semver-major/.test(line)) {
    entries.at(-1).majorOnly = true;
  }
}

// --- Compare against the registry -------------------------------------------

const toRegex = (p) =>
  new RegExp(
    `^${p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`,
  );
const parse = (v) => v.split('.').map(Number);
const newer = (a, b) => {
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
};

const held = [];
for (const entry of entries) {
  const names = declared.filter((n) => toRegex(entry.pattern).test(n));
  for (const name of names) {
    const current = lock.packages[`node_modules/${name}`]?.version;
    const res = await fetch(`https://registry.npmjs.org/${name}/latest`);
    if (!res.ok)
      throw new Error(`npm registry: ${name} returned ${res.status}`);
    const { version: latest } = await res.json();
    const waiting = entry.majorOnly
      ? parse(latest)[0] > parse(current)[0]
      : newer(latest, current);
    if (waiting) held.push({ name, current, latest, ...entry });
  }
}

// --- Report -------------------------------------------------------------------

const byReason = Map.groupBy(held, (h) => h.reason);
const sections = [...byReason].map(
  ([why, rows]) =>
    `**${why || 'No reason given in dependabot.yml.'}**\n\n` +
    `| Package | Installed | Latest |\n|---|---|---|\n` +
    rows
      .map((r) => `| \`${r.name}\` | ${r.current} | ${r.latest} |`)
      .join('\n'),
);

const report = held.length
  ? `These packages are ignored by Dependabot in \`.github/dependabot.yml\`, and a ` +
    `newer version is out. Each one needs a hand upgrade, or its ignore removed ` +
    `once the reason no longer applies.\n\n${sections.join('\n\n')}\n`
  : `No held-back upgrades are waiting.\n`;

console.log(report);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `held=${held.length > 0}\n`);
}
