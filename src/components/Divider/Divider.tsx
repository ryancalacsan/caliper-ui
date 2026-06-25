import type { ComponentPropsWithoutRef } from 'react';
import './Divider.scss';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerTone = 'subtle' | 'strong';

export interface DividerProps extends ComponentPropsWithoutRef<'hr'> {
  /** Direction of the rule. Defaults to `horizontal`. */
  orientation?: DividerOrientation;
  /** `subtle` is a hairline; `strong` is the Spec Sheet rule. Defaults to `subtle`. */
  tone?: DividerTone;
}

/**
 * A separator rule. Horizontal renders a real `<hr>`; vertical renders a
 * `separator` with the right orientation so assistive tech reads it correctly.
 */
export function Divider({
  orientation = 'horizontal',
  tone = 'subtle',
  className,
  ...rest
}: DividerProps) {
  const classes = [
    'divider',
    `divider--${orientation}`,
    `divider--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (orientation === 'vertical') {
    // Spread first, then set the load-bearing a11y attributes so they can't be
    // clobbered: a vertical divider must always announce as an oriented separator.
    return (
      <div
        className={classes}
        {...rest}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  return <hr className={classes} {...rest} />;
}
