import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './GridBackdrop.scss';

export type GridBackdropSize = 'grid' | 'grid-fine';

export interface GridBackdropProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Cell size: the standard blueprint grid or the finer one. Defaults to `grid`. */
  size?: GridBackdropSize;
  children?: ReactNode;
}

/**
 * Paints the blueprint grid behind its content - the Spec Sheet's backing
 * texture. A wrapper, so content sits on top of the grid with no extra markup.
 */
export function GridBackdrop({
  as: Tag = 'div',
  size = 'grid',
  className,
  children,
  ...rest
}: GridBackdropProps) {
  const classes = ['grid-backdrop', `grid-backdrop--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
