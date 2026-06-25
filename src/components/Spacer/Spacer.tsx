import type { ComponentPropsWithoutRef } from 'react';
import type { SpaceToken } from '../layout.types';
import './Spacer.scss';

export interface SpacerProps extends ComponentPropsWithoutRef<'span'> {
  /** Amount of space, on the spacing scale. Defaults to `md`. */
  size?: SpaceToken;
  /** Axis to add space along. Defaults to `block` (vertical). */
  axis?: 'block' | 'inline';
}

/**
 * An empty, decorative spacing element for the rare case where a gap on the
 * parent will not do. Hidden from assistive tech.
 */
export function Spacer({
  size = 'md',
  axis = 'block',
  className,
  ...rest
}: SpacerProps) {
  const classes = ['spacer', `spacer--${axis}-${size}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} aria-hidden="true" {...rest} />;
}
