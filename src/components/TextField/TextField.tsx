'use client';

import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './TextField.scss';

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id'
> {
  /** Visible, programmatically associated label. Always required. */
  label: string;
  /** Optional id. One is generated if you do not pass it. */
  id?: string;
  /** Guidance shown under the field and linked via aria-describedby. */
  helpText?: ReactNode;
  /**
   * Error message. When set, the field is marked aria-invalid and the message
   * is announced. Passing a string switches the field into its error state.
   */
  error?: string;
  /** Mark the field required, both visually and for assistive tech. */
  required?: boolean;
}

/**
 * A labelled text input with help text and an error state. The accessibility
 * wiring is the point of this component:
 *   - the <label> is tied to the input with htmlFor / id
 *   - help and error text are linked through aria-describedby
 *   - aria-invalid flips on in the error state
 *   - the error is in a role="alert" region so it is announced when it appears
 */
export function TextField({
  label,
  id,
  helpText,
  error,
  required = false,
  className,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helpId = `${fieldId}-help`;
  const errorId = `${fieldId}-error`;
  const hasError = Boolean(error);

  // Point the input at whichever descriptions exist, in reading order.
  const describedBy =
    [helpText ? helpId : null, hasError ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const wrapperClasses = [
    'text-field',
    hasError && 'text-field--invalid',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <label className="text-field__label" htmlFor={fieldId}>
        <span className="text-field__label-text">{label}</span>
        {required && (
          <span className="text-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={fieldId}
        className="text-field__input"
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        aria-required={required || undefined}
        required={required}
        {...rest}
      />

      {helpText && (
        <p id={helpId} className="text-field__help">
          {helpText}
        </p>
      )}

      {hasError && (
        <p id={errorId} className="text-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
