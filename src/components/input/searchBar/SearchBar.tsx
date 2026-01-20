"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SearchBar.module.css";

export type PersonSuggestion = {
  id: string;
  name: string;
  subtitle?: string;
};

type Props = {
  value: string;
  onChange: (next: string) => void;

  // Future hook: call your API/search here
  onSearch?: (query: string) => void;

  // Supply results from parent (API response)
  suggestions?: PersonSuggestion[];
  loading?: boolean;

  onSelectSuggestion?: (s: PersonSuggestion) => void;

  placeholder?: string;
  ariaLabel?: string;
};

const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  onSearch,
  suggestions = [],
  loading = false,
  onSelectSuggestion,
  placeholder = "Search for people...",
  ariaLabel = "Search for people",
}) => {
  const [focused, setFocused] = useState(false);

  const query = value.trim();
  const hasText = query.length > 0;

  // Active = user clicked in OR has typed
  const active = focused || hasText;

  // Only show dropdown once user actually typed something
  const showDropdown = focused && hasText;

  // Debounced search callback (wire to API later)
  useEffect(() => {
    if (!onSearch) return;
    if (!hasText) return;

    const t = window.setTimeout(() => onSearch(query), 250);
    return () => window.clearTimeout(t);
  }, [query, hasText, onSearch]);

  return (
    <div className={styles.container}>
      <div className={`${styles.wrap} ${active ? styles.active : ""}`}>
        
        <input
          className={styles.input}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoComplete="off"
          spellCheck={false}
        />

        <div className={styles.inputCtrlIcon} aria-hidden={active}>
          Ctrl
        </div>
        <div className={styles.inputJIcon} aria-hidden={active}>
          J
        </div>
      </div>

      {showDropdown && (
        <div className={styles.dropdown} role="listbox" aria-label="Search results">
          {loading ? (
            <div className={styles.dropdownRowMuted}>Searching…</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                className={styles.dropdownItem}
                // prevents blur firing before click registers
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelectSuggestion?.(s)}
                role="option"
              >
                <div className={styles.itemName}>{s.name}</div>
                {s.subtitle && <div className={styles.itemSub}>{s.subtitle}</div>}
              </button>
            ))
          ) : (
            <div className={styles.dropdownRowMuted}>
             Search <span className={styles.queryText}>{query}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
