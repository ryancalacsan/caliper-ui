import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './Frame.scss';

export type FrameVariant = 'solid' | 'dashed';

export interface FrameProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Border style. `dashed` is the measurement-box treatment. Defaults to `solid`. */
  variant?: FrameVariant;
  children?: ReactNode;
}

/**
 * A crop-mark frame - a bordered box with signal-colored registration corners,
 * the outer shell of the Spec Sheet look. Wrap a region to give it the drawn,
 * dimensioned feel. The `dashed` variant is the measurement-box treatment.
 */
export function Frame({
  as: Tag = 'div',
  variant = 'solid',
  className,
  children,
  ...rest
}: FrameProps) {
  const classes = ['frame', `frame--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
