import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';
import type { SpaceToken } from '../layout.types';
import './Grid.scss';

export interface GridProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Space between cells, on the spacing scale. */
  gap?: SpaceToken;
  /** A fixed number of equal-width columns. */
  columns?: number;
  /**
   * Responsive columns: the minimum cell width (e.g. `'16rem'`). Cells fit as
   * many per row as will hold that width. Ignored when `columns` is set.
   */
  minItemWidth?: string;
  children?: ReactNode;
}

/**
 * CSS grid with a token-driven gap. Pass `columns` for a fixed grid, or
 * `minItemWidth` for a responsive auto-fitting one that needs no media queries.
 */
export function Grid({
  as: Tag = 'div',
  gap = 'md',
  columns,
  minItemWidth,
  className,
  style,
  children,
  ...rest
}: GridProps) {
  const classes = [
    'grid',
    `grid--gap-${gap}`,
    columns != null && 'grid--fixed',
    minItemWidth != null && columns == null && 'grid--auto',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const vars = {
    ...(columns != null ? { '--grid-columns': String(columns) } : {}),
    ...(minItemWidth != null ? { '--grid-min': minItemWidth } : {}),
    ...style,
  } as CSSProperties;

  return (
    <Tag className={classes} style={vars} {...rest}>
      {children}
    </Tag>
  );
}
