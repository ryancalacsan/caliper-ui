'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';
import './RadioGroup.scss';

export interface RadioOption {
  label: ReactNode;
  value: string;
  /** Optional per-option help text shown under the label. */
  helpText?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Group label, rendered as the fieldset legend. */
  legend: string;
  /** Shared input name. Generated if you do not pass one. */
  name?: string;
  /** The options to render. */
  options: RadioOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** Guidance for the whole group, linked via aria-describedby. */
  helpText?: ReactNode;
  /** Group-level error. Sets aria-invalid and is announced via role="alert". */
  error?: string;
  /** Mark the group required. */
  required?: boolean;
  /** Lay options out in a row instead of a column. */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * A set of radios grouped with a real <fieldset> and <legend>, which is the
 * grouping assistive tech expects. Native radios sharing a name give arrow-key
 * navigation and single-selection for free. Group-level help and error are
 * linked to the fieldset with aria-describedby, and the error is announced.
 */
export function RadioGroup({
  legend,
  name,
  options,
  value,
  defaultValue,
  onChange,
  helpText,
  error,
  required = false,
  orientation = 'vertical',
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const helpId = `${groupName}-help`;
  const errorId = `${groupName}-error`;
  const hasError = Boolean(error);

  const describedBy =
    [helpText ? helpId : null, hasError ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const classes = [
    'radio-group',
    `radio-group--${orientation}`,
    hasError && 'radio-group--invalid',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <fieldset
      className={classes}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
    >
      <legend className="radio-group__legend">
        {legend}
        {required && (
          <span className="radio-group__required" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className="radio-group__options">
        {options.map((option) => {
          const optionId = `${groupName}-${option.value}`;
          const optionHelpId = `${optionId}-help`;
          return (
            <label key={option.value} className="radio-group__option">
              <span className="radio-group__control">
                <input
                  id={optionId}
                  type="radio"
                  className="radio-group__input"
                  name={groupName}
                  value={option.value}
                  checked={value != null ? value === option.value : undefined}
                  defaultChecked={
                    value == null ? defaultValue === option.value : undefined
                  }
                  disabled={option.disabled}
                  aria-describedby={option.helpText ? optionHelpId : undefined}
                  onChange={(event) => onChange?.(event.target.value)}
                />
                <span className="radio-group__dot" aria-hidden="true" />
              </span>
              <span className="radio-group__text">
                <span className="radio-group__label">{option.label}</span>
                {option.helpText && (
                  <span id={optionHelpId} className="radio-group__option-help">
                    {option.helpText}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {helpText && (
        <p id={helpId} className="radio-group__help">
          {helpText}
        </p>
      )}

      {hasError && (
        <p id={errorId} className="radio-group__error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
