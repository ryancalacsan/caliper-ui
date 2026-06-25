import type { ComponentPropsWithoutRef } from 'react';
import './Crosshair.scss';

export type CrosshairSize = 'sm' | 'md' | 'lg';

export interface CrosshairProps extends ComponentPropsWithoutRef<'span'> {
  /** Mark size. Defaults to `md`. */
  size?: CrosshairSize;
}

/**
 * A registration crosshair - the small `+` mark from the Spec Sheet language.
 * Purely decorative; hidden from assistive tech. Position it with the parent
 * (it is a plain inline-block by default).
 */
export function Crosshair({ size = 'md', className, ...rest }: CrosshairProps) {
  const classes = ['crosshair', `crosshair--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} aria-hidden="true" {...rest} />;
}
