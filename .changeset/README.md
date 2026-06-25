# Changesets

This folder holds [changesets](https://github.com/changesets/changesets): one
markdown file per pending change, describing the bump (patch/minor/major) and a
changelog line.

To record a change:

```bash
npm run changeset
```

Pick the bump and write a short summary. Commit the generated file with your PR.
On merge to `main`, the release workflow opens (or updates) a "Version Packages"
PR that applies the bumps and updates the changelog. Merging that PR publishes to
npm (once an `NPM_TOKEN` secret is set).
