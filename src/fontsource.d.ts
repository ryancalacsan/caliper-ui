// Fontsource packages ship CSS with no type declarations. These are
// side-effect imports (they register @font-face rules), so an empty module
// declaration is all TypeScript needs.
declare module '@fontsource-variable/*';
