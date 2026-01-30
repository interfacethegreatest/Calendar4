"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Tooltip from "@/components/misc/Tooltip/Tooltip";
import styles from "./EntrySearch.module.css";
import { IoSearch } from "react-icons/io5";

type EntrySearchProps = {
  shortcutKey?: string;
  tooltipLabel?: string;
  tooltipSymbol?: string;
  iconSize?: number;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  title?: string;
};

function isTypingInField(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;

  const tag = el.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;

  if (el.isContentEditable) return true;
  const role = el.getAttribute?.("role");
  if (role === "textbox" || role === "searchbox") return true;

  return false;
}

const EntrySearch: React.FC<EntrySearchProps> = ({
  shortcutKey = "/",
  tooltipLabel = "Search",
  tooltipSymbol = "/",
  iconSize = 20,
  iconClassName,
  iconStyle,
  title = "Search",
}) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ when true, modal covers entire screen (left: 0)
  const [coverFullScreen, setCoverFullScreen] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Global shortcut: "/"
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (open) return;
      if (e.key !== shortcutKey) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingInField(e.target)) return;

      e.preventDefault();
      setOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, shortcutKey]);

  // ✅ Listen for "]" to toggle full-screen coverage
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "]") return;

      // don’t steal typing inside inputs/editors
      if (isTypingInField(e.target)) return;

      // IMPORTANT: do NOT preventDefault/stopPropagation so your nav toggle still works
      setCoverFullScreen((v) => !v);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Escape to close + lock scroll while open
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    queueMicrotask(() => {
      inputRef.current?.focus();
      if (!inputRef.current) closeBtnRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const modal = useMemo(() => {
    if (!open || !mounted) return null;

    return createPortal(
      <div
        className={`${styles.backdrop} ${
          coverFullScreen ? styles.backdropFull : ""
        }`}
        aria-hidden={false}
      >
        <div
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.split}>
            <div className={styles.body}>{/* left */}
             <div className={styles.searchContainer}>
                <div className={styles.searchContainerUpper}>
                    <div className={styles.indicator} />

                    <input
                        ref={inputRef}
                        className={styles.input}
                        type="search"
                        placeholder="Search"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <Tooltip label={"Close"} symbol="Esc">
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={() => {
                        setOpen(false);
                        }}
                        aria-label="Close search"
                    >
                        ✕
                    </button>
                    </Tooltip>
                    </div>
                <div className={styles.searchContainerLower}>Search by event title, location, or attendees.</div>

             </div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.searchResultPopulate}>{/* right */}</div>
          </div>
        </div>
      </div>,
      document.body
    );
  }, [open, mounted, title, coverFullScreen]);

  return (
    <>
      <Tooltip label={tooltipLabel} symbol={tooltipSymbol}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setOpen(true)}
          aria-label="Open search"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <IoSearch className={iconClassName} style={iconStyle} size={iconSize} />
        </button>
      </Tooltip>

      {modal}
    </>
  );
};

export default EntrySearch;
