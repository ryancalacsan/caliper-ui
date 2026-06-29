import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import './AspectRatio.scss';

export type AspectRatioFit = 'cover' | 'contain';

export interface AspectRatioProps extends ComponentPropsWithoutRef<'div'> {
  /** Width-to-height ratio, e.g. `16 / 9` or `1`. Defaults to `16 / 9`. */
  ratio?: number;
  /** How the child fills the box. `contain` suits diagrams; `cover` photos. Defaults to `cover`. */
  fit?: AspectRatioFit;
  children?: ReactNode;
}

/**
 * Holds a fixed width-to-height ratio for its content - images, video, map
 * embeds - so media never causes layout shift. The child fills the box, cropped
 * (`cover`) or fitted whole (`contain`).
 */
export function AspectRatio({
  ratio = 16 / 9,
  fit = 'cover',
  className,
  style,
  children,
  ...rest
}: AspectRatioProps) {
  const classes = ['aspect-ratio', `aspect-ratio--${fit}`, className]
    .filter(Boolean)
    .join(' ');
  const vars = { '--aspect-ratio': String(ratio), ...style } as CSSProperties;

  return (
    <div className={classes} style={vars} {...rest}>
      {children}
    </div>
  );
}
