import {useHistory} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {SearchIcon} from './icons';
import SearchDialog from './SearchDialog';
import {searchDocs, type SearchIndexEntry} from './search';
import styles from './styles.module.css';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

export default function SearchBar(): React.JSX.Element {
  const {entries} = usePluginData('docs-search') as {entries?: SearchIndexEntry[]};
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  const index = entries ?? [];
  const results = useMemo(() => searchDocs(index, query), [index, query]);
  const safeActiveIndex = results.length === 0 ? 0 : Math.min(activeIndex, results.length - 1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function closeSearch(restoreFocus = true) {
    setOpen(false);
    setQuery('');
    if (restoreFocus) {
      buttonRef.current?.focus();
    }
  }

  function openSearch() {
    setOpen(true);
  }

  function toggleSearch() {
    if (openRef.current) {
      closeSearch();
      return;
    }
    openSearch();
  }

  function navigate(path: string) {
    setOpen(false);
    setQuery('');
    history.push(path);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault();
        event.stopPropagation();
        if (openRef.current) {
          setOpen(false);
          setQuery('');
          buttonRef.current?.focus();
          return;
        }
        setOpen(true);
        return;
      }

      if (
        key === '/' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (key === 'escape' && openRef.current) {
        event.preventDefault();
        setOpen(false);
        setQuery('');
        buttonRef.current?.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-label="Search docs"
        aria-keyshortcuts="/ Control+K"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggleSearch}
      >
        <SearchIcon />
        <span className={styles.triggerLabel}>Search docs...</span>
        <kbd className={styles.kbd}>/</kbd>
      </button>
      {open && mounted && (
        <SearchDialog
          query={query}
          results={results}
          activeIndex={safeActiveIndex}
          onQueryChange={setQuery}
          onActiveIndexChange={setActiveIndex}
          onNavigate={navigate}
          onClose={closeSearch}
        />
      )}
    </>
  );
}
