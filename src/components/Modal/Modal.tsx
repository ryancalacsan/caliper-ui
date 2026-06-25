'use client';

import { useEffect, useId, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from './useFocusTrap';
import { useScrollLock } from './useScrollLock';
import './Modal.scss';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  /** Whether the dialog is mounted and visible. */
  isOpen: boolean;
  /** Called when the user asks to close: Escape, scrim click, or close button. */
  onClose: () => void;
  /** Accessible name for the dialog, rendered as the heading. */
  title: string;
  /** Dialog body. */
  children: ReactNode;
  /** Optional footer, typically the action buttons. */
  footer?: ReactNode;
  /** Width preset. */
  size?: ModalSize;
  /** Close when the backdrop is clicked. Defaults to true. */
  closeOnOverlayClick?: boolean;
  /** Element to focus first. Defaults to the first focusable child. */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * An accessible modal dialog. It covers the four things that make modals hard
 * to get right:
 *   1. Focus trap   - Tab stays inside the dialog (useFocusTrap).
 *   2. Escape       - Escape calls onClose.
 *   3. Focus restore- on close, focus returns to the trigger (useFocusTrap).
 *   4. Scroll lock  - the page behind cannot scroll (useScrollLock).
 *
 * The dialog is rendered through a portal at the end of <body> so it is not
 * trapped inside a stacking or overflow context. role="dialog" + aria-modal
 * tells assistive tech the rest of the page is inert, and aria-labelledby ties
 * the heading to the dialog as its name.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  initialFocusRef,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const bodyId = useId();

  useFocusTrap(dialogRef, isOpen, initialFocusRef);
  useScrollLock(isOpen);

  // Escape to close. Bound at the document so it works wherever focus sits.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal__overlay"
      onMouseDown={(event) => {
        // Only close on a press that starts and ends on the scrim itself, so a
        // drag that began inside the dialog does not dismiss it.
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
      >
        <header className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg
              className="modal__close-icon"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div id={bodyId} className="modal__body">
          {children}
        </div>

        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
