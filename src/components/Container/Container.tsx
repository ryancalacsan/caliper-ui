import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './Container.scss';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Max width of the column. Defaults to `lg`. */
  size?: ContainerSize;
  /** Horizontal gutter padding. Defaults to `true`. */
  gutter?: boolean;
  children?: ReactNode;
}

/**
 * A centered, max-width column with a horizontal gutter. The outer wrapper that
 * keeps page content from running edge to edge on wide screens.
 */
export function Container({
  as: Tag = 'div',
  size = 'lg',
  gutter = true,
  className,
  children,
  ...rest
}: ContainerProps) {
  const classes = [
    'container',
    `container--${size}`,
    !gutter && 'container--flush',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
