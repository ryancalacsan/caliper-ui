import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import './Heading.scss';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize =
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';
export type HeadingWeight = 'semibold' | 'bold' | 'black';

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'md',
};

export interface HeadingProps extends Omit<
  ComponentPropsWithoutRef<'h2'>,
  'color'
> {
  /** Document heading level, h1-h6. Drives the tag and the default size. */
  level?: HeadingLevel;
  /** Visual size, decoupled from `level`. Defaults to a size that suits the level. */
  size?: HeadingSize;
  /** Font weight. Defaults to `bold`. */
  weight?: HeadingWeight;
  children?: ReactNode;
}

/**
 * A display heading. `level` sets the semantic tag for the document outline,
 * while `size` controls the visual scale - so an h2 can look small and an h3
 * can look large when the layout calls for it.
 */
export function Heading({
  level = 2,
  size,
  weight = 'bold',
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const resolvedSize = size ?? DEFAULT_SIZE[level];

  const classes = [
    'heading',
    `heading--${resolvedSize}`,
    `heading--${weight}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
