'use client';

import { cloneElement, useId, useRef, useState } from 'react';
import type {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
} from 'react';
import './Tooltip.scss';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface TriggerProps {
  'aria-describedby'?: string;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
}

export interface TooltipProps {
  /** Tooltip text. Kept to short, non-interactive content by design. */
  content: string;
  /** Which side of the trigger to show on. */
  placement?: TooltipPlacement;
  /** Delay before showing on hover, in ms. */
  delay?: number;
  /**
   * The trigger. Must be a single focusable element (a button or a link) so the
   * tooltip is reachable by keyboard, not just by hover.
   */
  children: ReactElement<TriggerProps>;
}

/**
 * A tooltip that appears on both hover and keyboard focus, and dismisses on
 * blur, mouse leave, or Escape (WAI-ARIA practice 1.4.13). The bubble is always
 * in the DOM with role="tooltip" and the trigger always points at it with
 * aria-describedby, so a screen reader announces it on focus whether or not it
 * is visually shown. Content is text only and never interactive, so focus has
 * nowhere unexpected to land.
 */
export function Tooltip({
  content,
  placement = 'top',
  delay = 200,
  children,
}: TooltipProps) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function show(immediate = false) {
    clearTimer();
    if (immediate || delay === 0) {
      setOpen(true);
    } else {
      timer.current = setTimeout(() => setOpen(true), delay);
    }
  }

  function hide() {
    clearTimer();
    setOpen(false);
  }

  const trigger = cloneElement(children, {
    'aria-describedby': tooltipId,
    onMouseEnter: (event: MouseEvent) => {
      show();
      children.props.onMouseEnter?.(event);
    },
    onMouseLeave: (event: MouseEvent) => {
      hide();
      children.props.onMouseLeave?.(event);
    },
    // Focus shows immediately: a keyboard user has no hover intent to wait on.
    onFocus: (event: FocusEvent) => {
      show(true);
      children.props.onFocus?.(event);
    },
    onBlur: (event: FocusEvent) => {
      hide();
      children.props.onBlur?.(event);
    },
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
      children.props.onKeyDown?.(event);
    },
  });

  return (
    <span className="tooltip">
      {trigger}
      <span
        id={tooltipId}
        role="tooltip"
        className={`tooltip__bubble tooltip__bubble--${placement}`}
        data-open={open || undefined}
      >
        {content}
      </span>
    </span>
  );
}
