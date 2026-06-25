'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { useTypeahead } from './useTypeahead';
import './Select.scss';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** Visible label, linked to the combobox via aria-labelledby. */
  label: string;
  options: SelectOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** Shown when nothing is selected. */
  placeholder?: string;
  /** Guidance shown under the control and linked via aria-describedby. */
  helpText?: ReactNode;
  /** Error message. Sets aria-invalid and is announced via role="alert". */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}

function nextEnabledIndex(
  options: SelectOption[],
  from: number,
  direction: 1 | -1,
): number {
  const count = options.length;
  for (let step = 1; step <= count; step++) {
    const i = (from + direction * step + count * step) % count;
    if (!options[i].disabled) return i;
  }
  return from;
}

/**
 * A custom single-select built on the ARIA select-only combobox pattern. A
 * <button role="combobox"> opens a <ul role="listbox">. Focus stays on the
 * button the whole time; the active option is tracked with
 * aria-activedescendant rather than by moving DOM focus, which is what the
 * pattern calls for. Full keyboard support is here: Up/Down, Home/End,
 * Enter/Space to select, Escape to close, and type-ahead. We reach for this
 * over a native <select> only to show the pattern; a native select is the
 * better default when custom option styling is not needed.
 */
export function Select({
  label,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  helpText,
  error,
  required = false,
  disabled = false,
  id,
}: SelectProps) {
  const baseId = useId();
  const fieldId = id ?? baseId;
  const labelId = `${fieldId}-label`;
  const listId = `${fieldId}-list`;
  const helpId = `${fieldId}-help`;
  const errorId = `${fieldId}-error`;
  const optionId = (index: number) => `${fieldId}-option-${index}`;

  const isControlled = value != null;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const selectedValue = isControlled ? value : internalValue;
  const selectedIndex = options.findIndex((o) => o.value === selectedValue);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0,
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const hasError = Boolean(error);
  const describedBy =
    [helpText ? helpId : null, hasError ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const matchTypeahead = useTypeahead(
    options,
    (o) => o.label,
    (o) => Boolean(o.disabled),
  );

  function openList() {
    if (disabled) return;
    setActiveIndex(
      selectedIndex >= 0 ? selectedIndex : nextEnabledIndex(options, -1, 1),
    );
    setOpen(true);
  }

  function closeList(focusButton = true) {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  }

  function commit(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value);
    closeList();
  }

  // Close when focus or a click leaves the component.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keep the active option scrolled into view as it moves.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      `#${CSS.escape(optionId(activeIndex))}`,
    );
    node?.scrollIntoView({ block: 'nearest' });
    // optionId is stable for a given fieldId; activeIndex is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) {
          openList();
        } else if (event.key === 'ArrowDown') {
          setActiveIndex((i) => nextEnabledIndex(options, i, 1));
        } else if (event.key === 'ArrowUp') {
          setActiveIndex((i) => nextEnabledIndex(options, i, -1));
        } else {
          commit(activeIndex);
        }
        break;
      case 'Home':
        if (open) {
          event.preventDefault();
          setActiveIndex(nextEnabledIndex(options, -1, 1));
        }
        break;
      case 'End':
        if (open) {
          event.preventDefault();
          setActiveIndex(nextEnabledIndex(options, options.length, -1));
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          closeList();
        }
        break;
      case 'Tab':
        if (open) setOpen(false);
        break;
      default:
        // Type-ahead for single printable characters.
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
          const match = matchTypeahead(
            event.key,
            open ? activeIndex : selectedIndex,
          );
          if (match != null) {
            if (!open) {
              setOpen(true);
              setActiveIndex(match);
            } else {
              setActiveIndex(match);
            }
          }
        }
    }
  }

  const selectedOption = options[selectedIndex];
  const classes = [
    'select',
    hasError && 'select--invalid',
    disabled && 'select--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} ref={rootRef}>
      <span id={labelId} className="select__label">
        {label}
        {required && (
          <span className="select__required" aria-hidden="true">
            *
          </span>
        )}
      </span>

      <button
        ref={buttonRef}
        type="button"
        className="select__trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${fieldId}-value`}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        aria-required={required || undefined}
        disabled={disabled}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={onButtonKeyDown}
      >
        <span
          id={`${fieldId}-value`}
          className={
            selectedOption
              ? 'select__value'
              : 'select__value select__value--placeholder'
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className="select__chevron"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M5 7.5l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        className="select__list"
        aria-labelledby={labelId}
        tabIndex={-1}
        hidden={!open}
      >
        {options.map((option, index) => {
          const isSelected = option.value === selectedValue;
          const isActive = index === activeIndex;
          return (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              className={[
                'select__option',
                isActive && 'select__option--active',
                option.disabled && 'select__option--disabled',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-selected={isSelected}
              aria-disabled={option.disabled || undefined}
              // Use pointerdown so selection beats the outside-click handler.
              onPointerDown={(event) => {
                event.preventDefault();
                if (!option.disabled) commit(index);
              }}
              onMouseEnter={() => !option.disabled && setActiveIndex(index)}
            >
              <span className="select__option-label">{option.label}</span>
              {isSelected && (
                <svg
                  className="select__check"
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
              )}
            </li>
          );
        })}
      </ul>

      {helpText && (
        <p id={helpId} className="select__help">
          {helpText}
        </p>
      )}

      {hasError && (
        <p id={errorId} className="select__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
