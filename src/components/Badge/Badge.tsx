import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import './Badge.scss';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'danger';
export type BadgeShape = 'pill' | 'square';

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  /** Color role. Defaults to `neutral`. */
  tone?: BadgeTone;
  /** Corner treatment. `square` matches the sharp Spec Sheet radii. Defaults to `pill`. */
  shape?: BadgeShape;
  children?: ReactNode;
}

/**
 * A small status or category label - an outline chip in the mono voice. Its
 * border tracks the text color, so every tone reads as tidy. `pill` is fully
 * round; `square` takes the sharp radius to match the rest of the system.
 */
export function Badge({
  tone = 'neutral',
  shape = 'pill',
  className,
  children,
  ...rest
}: BadgeProps) {
  const classes = ['badge', `badge--${tone}`, `badge--${shape}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
