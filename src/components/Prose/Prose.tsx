import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './Prose.scss';

export type ProseSize = 'base' | 'lg';

export interface ProseProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Base reading size. Defaults to `base`. */
  size?: ProseSize;
  children?: ReactNode;
}

/**
 * A styled container for rich text - markdown or CMS output. It styles its
 * descendant elements (headings, paragraphs, lists, links, code, quotes) with
 * token-driven rhythm, so raw HTML reads well without per-element classes.
 */
export function Prose({
  as: Tag = 'div',
  size = 'base',
  className,
  children,
  ...rest
}: ProseProps) {
  const classes = ['prose', `prose--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
