import Link from '@docusaurus/Link';
import clsx from 'clsx';
import React, {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {CloseIcon, SearchIcon} from './icons';
import type {SearchResult} from './search';
import styles from './styles.module.css';

type SearchDialogProps = {
  query: string;
  results: SearchResult[];
  activeIndex: number;
  onQueryChange: (value: string) => void;
  onActiveIndexChange: (index: number) => void;
  onNavigate: (path: string) => void;
  onClose: (restoreFocus?: boolean) => void;
};

export default function SearchDialog({
  query,
  results,
  activeIndex,
  onQueryChange,
  onActiveIndexChange,
  onNavigate,
  onClose,
}: SearchDialogProps): React.JSX.Element | null {
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const trimmed = query.trim();
  const showHint = trimmed.length < 2;
  const showEmpty = !showHint && results.length === 0;
  const activeId = results.length > 0 ? `docs-search-option-${activeIndex}` : undefined;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!activeId) {
      return;
    }
    document.getElementById(activeId)?.scrollIntoView({block: 'nearest'});
  }, [activeId]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (results.length === 0) {
        return;
      }
      onActiveIndexChange((activeIndex + 1) % results.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (results.length === 0) {
        return;
      }
      onActiveIndexChange((activeIndex - 1 + results.length) % results.length);
      return;
    }

    if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      onNavigate(results[activeIndex].path);
    }
  }

  function onDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab') {
      return;
    }

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, input, a[href]',
    );
    if (!focusable || focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={() => onClose()}>
      <div
        ref={dialogRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Search docs"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={onDialogKeyDown}
      >
        <div className={styles.header}>
          <SearchIcon size={20} />
          <input
            ref={inputRef}
            id="docs-search-input"
            className={styles.input}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="docs-search-results"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            placeholder="Search docs..."
            value={query}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={onInputKeyDown}
          />
          {query.length > 0 && (
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Clear search"
              onClick={() => {
                onQueryChange('');
                inputRef.current?.focus();
              }}
            >
              <CloseIcon />
            </button>
          )}
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Close search"
            onClick={() => onClose()}
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.srOnly} aria-live="polite">
          {showHint ? '' : `${results.length} results`}
        </div>

        {showHint && (
          <p className={styles.status}>Type to search, or press / on the page</p>
        )}
        {showEmpty && <p className={styles.status}>No results</p>}

        {results.length > 0 && (
          <ul id="docs-search-results" className={styles.results} role="listbox">
            {results.map((item, index) => (
              <li
                key={item.path}
                id={`docs-search-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <Link
                  className={clsx(styles.result, index === activeIndex && styles.resultActive)}
                  to={item.path}
                  onMouseEnter={() => onActiveIndexChange(index)}
                  onClick={() => onClose(false)}
                >
                  <div className={styles.resultTitle}>{item.title}</div>
                  {item.description && (
                    <div className={styles.resultDescription}>{item.description}</div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}
