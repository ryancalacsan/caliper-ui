import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './Frame.scss';

export type FrameVariant = 'solid' | 'dashed';
export type FrameMarks = 'none' | 'tlbr' | 'all';

export interface FrameProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Border style. `dashed` is the measurement-box treatment. Defaults to `solid`. */
  variant?: FrameVariant;
  /** Which registration corners to draw. Defaults to `tlbr` (top-left + bottom-right). */
  marks?: FrameMarks;
  children?: ReactNode;
}

/**
 * A crop-mark frame - a bordered box with signal-colored registration corners,
 * the outer shell of the Spec Sheet look. Wrap a region to give it the drawn,
 * dimensioned feel. `dashed` is the measurement-box treatment; `marks` controls
 * which corners show (`none`, the default `tlbr`, or `all` four).
 */
export function Frame({
  as: Tag = 'div',
  variant = 'solid',
  marks = 'tlbr',
  className,
  children,
  ...rest
}: FrameProps) {
  const classes = [
    'frame',
    `frame--${variant}`,
    `frame--marks-${marks}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {marks === 'all' && (
        <>
          <span
            className="frame__corner frame__corner--tr"
            aria-hidden="true"
          />
          <span
            className="frame__corner frame__corner--bl"
            aria-hidden="true"
          />
        </>
      )}
      {children}
    </Tag>
  );
}
