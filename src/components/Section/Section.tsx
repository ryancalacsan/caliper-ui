import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { SpaceToken } from '../layout.types';
import './Section.scss';

export interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  /** Element to render. Defaults to a `section`. */
  as?: ElementType;
  /** Vertical padding, on the spacing scale. Defaults to `2xl`. */
  space?: SpaceToken;
  children?: ReactNode;
}

/**
 * A landmark region with vertical padding from the spacing scale. Use it to
 * band a page into sections with consistent breathing room.
 */
export function Section({
  as: Tag = 'section',
  space = '2xl',
  className,
  children,
  ...rest
}: SectionProps) {
  const classes = ['section', `section--space-${space}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
