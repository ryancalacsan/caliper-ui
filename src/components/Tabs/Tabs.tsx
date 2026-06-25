'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import './Tabs.scss';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  /** Accessible name for the tab list. */
  label: string;
  tabs: TabItem[];
  /** Controlled active tab id. */
  activeId?: string;
  /** Uncontrolled initial tab id. Defaults to the first enabled tab. */
  defaultId?: string;
  /** Called with the newly selected tab id. */
  onChange?: (id: string) => void;
}

/**
 * Tabs following the ARIA tabs pattern. The tab list uses a roving tabindex:
 * exactly one tab is in the tab order at a time, and the arrow keys move
 * selection (Home and End jump to the ends), skipping disabled tabs. Activation
 * is automatic, so the panel follows focus. Each panel is tied back to its tab
 * with aria-labelledby.
 */
export function Tabs({
  label,
  tabs,
  activeId,
  defaultId,
  onChange,
}: TabsProps) {
  const baseId = useId();
  const firstEnabled = tabs.find((t) => !t.disabled)?.id ?? tabs[0]?.id;
  const [internalId, setInternalId] = useState(defaultId ?? firstEnabled);
  const selectedId = activeId ?? internalId;

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const listRef = useRef<HTMLDivElement>(null);

  // The sliding indicator tracks the selected tab's position and width. We
  // measure the DOM rather than guess, so it stays correct as labels, fonts, or
  // the container width change.
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  function measureIndicator() {
    const node = tabRefs.current.get(selectedId);
    if (node) {
      setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
    }
  }

  // Re-measure synchronously after layout when the selection changes.
  useLayoutEffect(() => {
    measureIndicator();
    // measureIndicator reads refs; selectedId and the tab set are the inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, tabs.length]);

  // And whenever the tab list reflows (resize, font load, content change).
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measureIndicator());
    observer.observe(list);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  function select(id: string) {
    if (activeId == null) setInternalId(id);
    onChange?.(id);
  }

  function focusTab(id: string) {
    tabRefs.current.get(id)?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const enabled = tabs.filter((t) => !t.disabled);
    const currentIndex = enabled.findIndex((t) => t.id === selectedId);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % enabled.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = enabled.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextId = enabled[nextIndex].id;
    select(nextId);
    focusTab(nextId);
  }

  const activeTab = tabs.find((t) => t.id === selectedId);

  return (
    <div className="tabs">
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className="tabs__list"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === selectedId;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                if (node) tabRefs.current.set(tab.id, node);
                else tabRefs.current.delete(tab.id);
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              className="tabs__tab"
              aria-selected={isSelected}
              aria-controls={panelId(tab.id)}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => select(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}

        {indicator && (
          <span
            className="tabs__indicator"
            aria-hidden="true"
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: `${indicator.width}px`,
            }}
          />
        )}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelId(tab.id)}
          className="tabs__panel"
          aria-labelledby={tabId(tab.id)}
          tabIndex={0}
          hidden={tab.id !== selectedId}
        >
          {tab.id === selectedId ? activeTab?.content : null}
        </div>
      ))}
    </div>
  );
}
