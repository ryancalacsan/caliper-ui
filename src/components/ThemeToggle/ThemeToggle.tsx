'use client';

import { useEffect, useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import './ThemeToggle.scss';

type Theme = 'light' | 'dark';

export interface ThemeToggleProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> {
  /** localStorage key the choice is persisted under (uncontrolled mode). Defaults to `theme`. */
  storageKey?: string;
  /** Label shown in the light theme. Defaults to `Light`. */
  lightLabel?: string;
  /** Label shown in the dark theme. Defaults to `Dev`. */
  darkLabel?: string;
  /**
   * Controlled theme. Pair with `onThemeChange` to drive the toggle from an
   * external store (e.g. next-themes); the toggle then reflects this value and
   * does not touch the document or localStorage itself.
   */
  theme?: Theme;
  /** Called with the next theme on click. Providing it puts the toggle in controlled mode. */
  onThemeChange?: (next: Theme) => void;
}

/**
 * Toggles the theme between light and dark. Uncontrolled by default: it writes
 * `data-theme` on the document and persists the choice, reading the real theme
 * only after mount so server and first client render match. Provide
 * `onThemeChange` (with `theme`) to run it controlled - it then defers to your
 * store (next-themes, say) instead of managing the document itself.
 */
export function ThemeToggle({
  storageKey = 'theme',
  lightLabel = 'Light',
  darkLabel = 'Dev',
  theme,
  onThemeChange,
  className,
  ...rest
}: ThemeToggleProps) {
  const isControlled = onThemeChange !== undefined;
  const [mounted, setMounted] = useState(false);
  const [internalTheme, setInternalTheme] = useState<Theme>('light');

  useEffect(() => {
    if (isControlled) return;
    setMounted(true);
    const current = document.documentElement.dataset.theme as Theme | undefined;
    setInternalTheme(
      current ??
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'),
    );
  }, [isControlled]);

  const current = isControlled ? theme : internalTheme;
  const isDark = current === 'dark';
  // The pressed state is known once we have a theme: a defined `theme` prop
  // (controlled) or after mount (uncontrolled). Until then it stays undefined so
  // server and first client render match.
  const known = isControlled ? theme !== undefined : mounted;

  function toggle() {
    const next: Theme = isDark ? 'light' : 'dark';
    if (isControlled) {
      onThemeChange?.(next);
      return;
    }
    setInternalTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // storage may be unavailable (private mode); the toggle still works.
    }
  }

  const classes = ['theme-toggle', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={known ? isDark : undefined}
      aria-label="Dark theme"
      onClick={toggle}
      {...rest}
    >
      <span className="theme-toggle__label">
        {isDark ? darkLabel : lightLabel}
      </span>
    </button>
  );
}
