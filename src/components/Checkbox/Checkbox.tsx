'use client';

import { useEffect, useId, useRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './Checkbox.scss';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'id'
> {
  /** Visible label, tied to the input by nesting it in the same <label>. */
  label: ReactNode;
  /** Optional id. Generated if you do not pass one. */
  id?: string;
  /** Guidance shown under the control and linked via aria-describedby. */
  helpText?: ReactNode;
  /** Error message. Sets aria-invalid and is announced via role="alert". */
  error?: string;
  /**
   * Mixed state for a parent of a group of checkboxes. Driven onto the DOM node
   * so the native :indeterminate pseudo-class does the styling.
   */
  indeterminate?: boolean;
}

/**
 * A single checkbox built on a real <input type="checkbox">, so the keyboard,
 * the focus, and the checked state come from the platform. The box is drawn
 * with appearance: none and CSS; the check and the mixed-state dash are toggled
 * with the :checked and :indeterminate pseudo-classes, no JS-driven classes.
 */
export function Checkbox({
  label,
  id,
  helpText,
  error,
  indeterminate = false,
  className,
  disabled,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);
  const inputRef = useRef<HTMLInputElement>(null);

  // indeterminate is a DOM property, not an attribute, so it has to be set here.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const describedBy =
    [helpText ? helpId : null, hasError ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const wrapperClasses = [
    'checkbox',
    hasError && 'checkbox--invalid',
    disabled && 'checkbox--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <label className="checkbox__row">
        <span className="checkbox__control">
          <input
            ref={inputRef}
            id={inputId}
            type="checkbox"
            className="checkbox__input"
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            disabled={disabled}
            {...rest}
          />
          <svg
            className="checkbox__icon checkbox__icon--check"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M3.5 8.5l3 3 6-6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="checkbox__icon checkbox__icon--dash"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4 8h8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="checkbox__label">{label}</span>
      </label>

      {helpText && (
        <p id={helpId} className="checkbox__help">
          {helpText}
        </p>
      )}

      {hasError && (
        <p id={errorId} className="checkbox__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
