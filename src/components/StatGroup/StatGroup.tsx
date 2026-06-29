import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './StatGroup.scss';

export interface StatGroupProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Draw vertical dividers between the stats. Defaults to `true`. */
  dividers?: boolean;
  children?: ReactNode;
}

/**
 * Lays out a row of `Stat`s - the "08 / 02 / AA" readout strip - with optional
 * dividers between them. Wraps to a new line when the row runs out of room.
 */
export function StatGroup({
  as: Tag = 'div',
  dividers = true,
  className,
  children,
  ...rest
}: StatGroupProps) {
  const classes = ['stat-group', dividers && 'stat-group--dividers', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
