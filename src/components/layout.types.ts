// Shared prop types for the layout primitives. Spacing values map to the
// spacing scale (var(--space-*)); align/justify map to flexbox keywords.

/** A step on the spacing scale. Maps to var(--space-{token}). */
export type SpaceToken =
  | '0'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

/** Cross-axis alignment (align-items). */
export type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

/** Main-axis distribution (justify-content). */
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around';
