import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { Align, Justify, SpaceToken } from '../layout.types';
import './Inline.scss';

export interface InlineProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Space between children, on the spacing scale. */
  gap?: SpaceToken;
  /** Cross-axis (vertical) alignment. Defaults to `center`. */
  align?: Align;
  /** Main-axis (horizontal) distribution. */
  justify?: Justify;
  /** Allow items to wrap onto multiple lines. Defaults to `true`. */
  wrap?: boolean;
  children?: ReactNode;
}

/**
 * Horizontal flex layout with a token-driven gap. Wraps by default, so a row of
 * chips or buttons flows onto the next line instead of overflowing.
 */
export function Inline({
  as: Tag = 'div',
  gap = 'sm',
  align,
  justify,
  wrap = true,
  className,
  children,
  ...rest
}: InlineProps) {
  const classes = [
    'inline',
    `inline--gap-${gap}`,
    align && `inline--align-${align}`,
    justify && `inline--justify-${justify}`,
    !wrap && 'inline--nowrap',
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
