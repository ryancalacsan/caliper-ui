import { cloneElement, isValidElement } from 'react';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { mergeProps } from '../mergeProps';
import './NavLink.scss';

export interface NavLinkProps extends ComponentPropsWithoutRef<'a'> {
  /** Marks the current page: styles it active and sets `aria-current="page"`. */
  active?: boolean;
  /** Render as the single child element (a framework `<Link>`) instead of `<a>`. */
  asChild?: boolean;
  children?: ReactNode;
}

/**
 * A navigation link in the mono voice, with an active state that draws a signal
 * underline and sets `aria-current="page"`. For a whole-card link use `Link`
 * with `stretch` - NavLink's own positioned underline prevents it from
 * stretching past itself.
 */
export function NavLink({
  active = false,
  asChild = false,
  className,
  children,
  ...rest
}: NavLinkProps) {
  const classes = ['nav-link', active && 'nav-link--active', className]
    .filter(Boolean)
    .join(' ');
  const ariaCurrent = active ? ('page' as const) : undefined;

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ children?: ReactNode }>;
    const merged = mergeProps(
      { className: classes, 'aria-current': ariaCurrent, ...rest },
      child.props as Record<string, unknown>,
    );
    return cloneElement(child, merged);
  }

  return (
    <a className={classes} aria-current={ariaCurrent} {...rest}>
      {children}
    </a>
  );
}
