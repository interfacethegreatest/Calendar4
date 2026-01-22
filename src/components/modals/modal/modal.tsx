"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import styles from "./Modal.module.css";

export type PersonSuggestion = {
  id: string;
  name: string;
  subtitle?: string; // e.g. email
};

export type ModalProps = {
  open: boolean;
  onClose: () => void;

  /** Close when clicking the dimmed backdrop */
  closeOnBackdrop?: boolean;

  /** Close when pressing Escape */
  closeOnEsc?: boolean;

  /** Optional: override stacking */
  zIndex?: number;

  /** Optional input text */
  placeholder?: string;
  ariaLabel?: string;

  /** Optional hook if you want to do something extra on select */
  onSelectSuggestion?: (s: PersonSuggestion) => void;
};

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return nodes.filter((el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  closeOnBackdrop = true,
  closeOnEsc = true,
  zIndex = 9999,
  placeholder = "Search by first name, last name, or email",
  ariaLabel = "Search by first name, last name, or email",
  onSelectSuggestion,
}) => {
  const router = useRouter();

  const cardRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const titleId = useId();
  const descId = useId();

  // ✅ mirrors NavBar state
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<PersonSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const trimmed = query.trim();
  const hasText = trimmed.length > 0;
  const showDropdown = focused && hasText;

  // ✅ mirrors NavBar onSearch (AbortController + fetch)
  const fetchSuggestions = useCallback(async (q: string) => {
    const qTrim = q.trim();
    if (!qTrim) {
      setSuggestions([]);
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(qTrim)}`, {
        signal: ac.signal,
      });

      if (!res.ok) throw new Error("Bad response");
      const data = (await res.json()) as PersonSuggestion[];
      setSuggestions(data);
    } catch (err: any) {
      if (err?.name !== "AbortError") setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ mirrors SearchBar debounce (Modal has it internally)
  useEffect(() => {
    if (!open) return;
    if (!hasText) {
      setSuggestions([]);
      return;
    }

    const t = window.setTimeout(() => fetchSuggestions(trimmed), 250);
    return () => window.clearTimeout(t);
  }, [open, trimmed, hasText, fetchSuggestions]);

  // Scroll lock + restore focus + focus input
  useEffect(() => {
    if (!open) return;

    lastActiveElRef.current = document.activeElement as HTMLElement | null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => {
      inputRef.current?.focus?.();
    }, 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;

      abortRef.current?.abort();
      abortRef.current = null;

      setFocused(false);
      setSuggestions([]);
      setLoading(false);

      lastActiveElRef.current?.focus?.();
      lastActiveElRef.current = null;
    };
  }, [open]);

  // ESC + focus trap
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = getFocusable(cardRef.current);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active) return;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, onClose]);

  const handleSelect = (s: PersonSuggestion) => {
    setQuery(s.name);

    router.push({
      pathname: `/user/${s.id}/calendar`,
      query: { userId: s.id },
    });
    onClose();
  };

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={styles.overlay}
      style={{ zIndex }}
      role="presentation"
      onMouseDown={(e) => {
        if (!closeOnBackdrop) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <h5 id={titleId} className={styles.title}>
          Meet With
        </h5>

        <div className={styles.searchContainer}>
          <div className={styles.searchIndicator} />
          <input
            ref={inputRef}
            className={styles.searchInput}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            aria-label={ariaLabel}
            autoComplete="off"
            spellCheck={false}
          />
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
                  onMouseDown={(e) => e.preventDefault()} // ✅ same trick as SearchBar
                  onClick={() => handleSelect(s)}
                  role="option"
                >
                  <div className={styles.itemName}>{s.name}</div>
                  {s.subtitle && <div className={styles.itemSub}>{s.subtitle}</div>}
                </button>
              ))
            ) : (
              <div className={styles.dropdownRowMuted}>
                Search <span className={styles.queryText}>{trimmed}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
