import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './Frame.scss';

export interface FrameProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  children?: ReactNode;
}

/**
 * A crop-mark frame - a bordered box with signal-colored registration corners,
 * the outer shell of the Spec Sheet look. Wrap a region to give it the drawn,
 * dimensioned feel.
 */
export function Frame({
  as: Tag = 'div',
  className,
  children,
  ...rest
}: FrameProps) {
  const classes = ['frame', className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
