// =============================================================================
// Token drift check (CI)
// -----------------------------------------------------------------------------
// Rebuilds the generated token outputs from the DTCG source and fails if they
// differ from the committed files. This guarantees the published tokens.css and
// the SCSS maps the components compile against are always in sync with
// tokens/*.json - the single source of truth.
// =============================================================================

import { execSync } from 'node:child_process';

const GENERATED = [
  'src/tokens/_generated.scss',
  'tokens/tokens.css',
  'tokens/figma/light.json',
  'tokens/figma/dark.json',
  'tokens/figma/tokens-studio.json',
];

execSync('node scripts/build-tokens.mjs', { stdio: 'inherit' });
execSync('node scripts/build-figma.mjs', { stdio: 'inherit' });

try {
  execSync(`git diff --exit-code -- ${GENERATED.join(' ')}`, { stdio: 'pipe' });
  console.log('\nToken outputs are in sync with the DTCG source (tokens/*.json).');
} catch (err) {
  console.error(
    '\nToken drift detected: the generated files do not match the DTCG source.\n' +
      'Run `npm run build:tokens` and commit the result.\n',
  );
  process.stdout.write(err.stdout?.toString() ?? '');
  process.exit(1);
}
