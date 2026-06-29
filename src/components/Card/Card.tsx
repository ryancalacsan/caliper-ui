import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './Card.scss';

export type CardOrientation = 'vertical' | 'horizontal';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Full-bleed media region (an image or `AspectRatio`). */
  media?: ReactNode;
  /** Optional header region above the body. */
  header?: ReactNode;
  /** Optional footer region, divided from the body. */
  footer?: ReactNode;
  /** Fill the height of a stretched grid/flex cell and pin the footer to the bottom. */
  fill?: boolean;
  /** Layout. `horizontal` puts media beside the body, reflowing to vertical when narrow. */
  orientation?: CardOrientation;
  /**
   * Make the whole card a clickable surface (hover + focus-within ring). Put a
   * `<Link stretch>` in the header to set the target; footer actions stay
   * independently clickable.
   */
  interactive?: boolean;
  children?: ReactNode;
}

/**
 * A bordered surface with optional media, header, body, and footer regions, the
 * neutral container project cards and case-study blocks compose from. `fill`
 * gives equal-height cards in a grid; `orientation="horizontal"` sets media
 * beside the body; `interactive` plus a stretched `Link` makes the whole card a
 * link.
 */
export function Card({
  as: Tag = 'div',
  media,
  header,
  footer,
  fill = false,
  orientation = 'vertical',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  const classes = [
    'card',
    `card--${orientation}`,
    fill && 'card--fill',
    interactive && 'card--interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {media && <div className="card__media">{media}</div>}
      {(header || children) && (
        <div className="card__body">
          {header && <div className="card__header">{header}</div>}
          {children}
        </div>
      )}
      {footer && <div className="card__footer">{footer}</div>}
    </Tag>
  );
}
