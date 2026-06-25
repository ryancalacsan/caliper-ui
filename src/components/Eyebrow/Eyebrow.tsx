import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './Eyebrow.scss';

export type EyebrowTone = 'muted' | 'accent';

export interface EyebrowProps extends ComponentPropsWithoutRef<'p'> {
  /** Element to render. Defaults to a `p`. */
  as?: ElementType;
  /** `muted` is the default label gray; `accent` is the signal color. */
  tone?: EyebrowTone;
  children?: ReactNode;
}

/**
 * A mono, uppercase kicker label - the small letter-spaced line that sits above
 * a heading. The Spec Sheet's voice for section markers and metadata.
 */
export function Eyebrow({
  as: Tag = 'p',
  tone = 'muted',
  className,
  children,
  ...rest
}: EyebrowProps) {
  const classes = ['eyebrow', `eyebrow--${tone}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
