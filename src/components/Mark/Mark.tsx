import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './Mark.scss';

export type MarkTone = 'signal' | 'accent';
export type MarkThickness = 'sm' | 'md' | 'lg';

export interface MarkProps extends ComponentPropsWithoutRef<'span'> {
  /** Element to render. Defaults to a `span`. */
  as?: ElementType;
  /** Bar color. `signal` is the vivid orange; `accent` the burnt orange. */
  tone?: MarkTone;
  /** Underline weight. Defaults to `md`. */
  thickness?: MarkThickness;
  children?: ReactNode;
}

/**
 * A highlighter underline accent - the orange bar drawn behind a word or two,
 * as on the "drawn to spec." headline. Purely visual: the text keeps its own
 * color and the bar sits near the baseline, cloning across line breaks.
 */
export function Mark({
  as: Tag = 'span',
  tone = 'signal',
  thickness = 'md',
  className,
  children,
  ...rest
}: MarkProps) {
  const classes = ['mark', `mark--${tone}`, `mark--${thickness}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
