import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './Text.scss';

export type TextSize = 'xs' | 'sm' | 'base' | 'md' | 'lg';
export type TextTone = 'default' | 'muted' | 'subtle';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'start' | 'center' | 'end';

export interface TextProps extends Omit<
  ComponentPropsWithoutRef<'p'>,
  'color'
> {
  /** Element to render. Defaults to a `p`. */
  as?: ElementType;
  /** Type scale step. Defaults to `base` (16px). */
  size?: TextSize;
  /** Text color role. Defaults to `default`. */
  tone?: TextTone;
  /** Font weight. */
  weight?: TextWeight;
  /** Text alignment. */
  align?: TextAlign;
  children?: ReactNode;
}

/**
 * Body text. A thin wrapper that maps friendly props onto the type and color
 * tokens, so prose stays consistent without reaching for raw font sizes.
 */
export function Text({
  as: Tag = 'p',
  size = 'base',
  tone = 'default',
  weight,
  align,
  className,
  children,
  ...rest
}: TextProps) {
  const classes = [
    'text',
    `text--${size}`,
    tone !== 'default' && `text--${tone}`,
    weight && `text--${weight}`,
    align && `text--align-${align}`,
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
