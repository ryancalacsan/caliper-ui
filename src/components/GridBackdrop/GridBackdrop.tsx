import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './GridBackdrop.scss';

export type GridBackdropSize = 'grid' | 'grid-fine';
export type GridBackdropVariant = 'lines' | 'dots';

export interface GridBackdropProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Cell size: the standard blueprint grid or the finer one. Defaults to `grid`. */
  size?: GridBackdropSize;
  /** Backdrop pattern: ruled `lines` or a dot grid. Defaults to `lines`. */
  variant?: GridBackdropVariant;
  children?: ReactNode;
}

/**
 * Paints the blueprint grid behind its content - the Spec Sheet's backing
 * texture. A wrapper, so content sits on top of the grid with no extra markup.
 * `variant="dots"` swaps the ruled lines for a dot grid on the same rhythm.
 */
export function GridBackdrop({
  as: Tag = 'div',
  size = 'grid',
  variant = 'lines',
  className,
  children,
  ...rest
}: GridBackdropProps) {
  const classes = [
    'grid-backdrop',
    `grid-backdrop--${variant}`,
    `grid-backdrop--${size}`,
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
