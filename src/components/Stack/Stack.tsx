import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { Align, Justify, SpaceToken } from '../layout.types';
import './Stack.scss';

export interface StackProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Space between children, on the spacing scale. */
  gap?: SpaceToken;
  /** Cross-axis (horizontal) alignment. */
  align?: Align;
  /** Main-axis (vertical) distribution. */
  justify?: Justify;
  children?: ReactNode;
}

/**
 * Vertical flex layout with a token-driven gap. The workhorse for stacking
 * content with consistent rhythm, instead of scattering margins.
 */
export function Stack({
  as: Tag = 'div',
  gap = 'md',
  align,
  justify,
  className,
  children,
  ...rest
}: StackProps) {
  const classes = [
    'stack',
    `stack--gap-${gap}`,
    align && `stack--align-${align}`,
    justify && `stack--justify-${justify}`,
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
