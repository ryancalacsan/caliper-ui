import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import './DimensionLine.scss';

export type DimensionOrientation = 'horizontal' | 'vertical';

export interface DimensionLineProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'title'
> {
  /** The annotation text, centered on the line. */
  label?: ReactNode;
  /** Line direction. Defaults to `horizontal`. */
  orientation?: DimensionOrientation;
}

/**
 * A dimension line - the "measured to the pixel" annotation, with end ticks and
 * a centered label. Decorative flavor from the Spec Sheet, hidden from
 * assistive tech.
 */
export function DimensionLine({
  label,
  orientation = 'horizontal',
  className,
  ...rest
}: DimensionLineProps) {
  const classes = [
    'dimension-line',
    `dimension-line--${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} aria-hidden="true" {...rest}>
      {label != null && <span className="dimension-line__label">{label}</span>}
    </div>
  );
}
