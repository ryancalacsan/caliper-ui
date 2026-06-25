import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import './SheetHeader.scss';

export interface SheetHeaderProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. Defaults to a `div`. */
  as?: ElementType;
  /** Left cell - typically a brand or title. */
  left?: ReactNode;
  /** Right cell - typically a sheet index or controls. */
  right?: ReactNode;
  /** Draw a ruler tick strip filling the space between the cells. */
  ruler?: boolean;
  /** Custom center content (used instead of, or alongside, the ruler). */
  children?: ReactNode;
}

/**
 * The Spec Sheet meta bar - the "BESPOKE ... SHEET 01 / 04 ... LIGHT" strip. A
 * mono, uppercase rule across the top of a sheet, with left and right cells and
 * an optional ruler between them.
 */
export function SheetHeader({
  as: Tag = 'div',
  left,
  right,
  ruler = false,
  className,
  children,
  ...rest
}: SheetHeaderProps) {
  const classes = ['sheet-header', className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} {...rest}>
      {left != null && <div className="sheet-header__cell">{left}</div>}
      {ruler && <div className="sheet-header__ruler" aria-hidden="true" />}
      {children}
      {right != null && <div className="sheet-header__cell">{right}</div>}
    </Tag>
  );
}
