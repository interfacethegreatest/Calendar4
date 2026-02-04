"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./style.module.css";

export type ViewMode = "day" | "week" | "7days" | "4days" | "month";

type Option = {
  value: ViewMode;
  label: string;
  badge: string;
};

type Props = {
  value?: ViewMode;
  defaultValue?: ViewMode;
  onChange?: (next: ViewMode) => void;
  disabled?: boolean;
};

const DEFAULT_OPTIONS: Option[] = [
  { value: "day", label: "Day", badge: "D" },
  { value: "week", label: "Week", badge: "W" },
  { value: "7days", label: "7 days", badge: "7" },
  { value: "4days", label: "4 days", badge: "4" },
  { value: "month", label: "Month", badge: "M" },
];

const ArrowDown: React.FC<{ open?: boolean }> = ({ open }) => (
  <svg
    className={`${styles.triggerArrow} ${open ? styles.triggerArrowOpen : ""}`}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const LyDropdown: React.FC<Props> = ({
  value,
  defaultValue = "month",
  onChange,
  disabled = false,
}) => {
  const options = useMemo(() => DEFAULT_OPTIONS, []);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<ViewMode>(defaultValue);
  const currentValue = isControlled ? value! : internalValue;

  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const currentLabel =
    options.find((o) => o.value === currentValue)?.label ?? "Month";

  const setNext = (next: ViewMode) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  // Close on ESC + outside click
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;

      // If click is outside root (trigger + panel), close.
      if (!root.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Focus first option on open
  useEffect(() => {
    if (!open) return;
    const firstBtn = panelRef.current?.querySelector<HTMLButtonElement>(
      `button[data-option="true"]`
    );
    firstBtn?.focus();
  }, [open]);

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className={styles.triggerLabel}>{currentLabel}</span>
        <ArrowDown open={open} />
      </button>

      {open && (
        <div
          ref={panelRef}
          className={styles.popover}
          role="menu"
          aria-label="Select view mode"
        >
          <div className={styles.options}>
            {options.map((opt) => {
              const active = opt.value === currentValue;

              return (
                <button
                  key={opt.value}
                  type="button"
                  data-option="true"
                  className={`${styles.option} ${
                    active ? styles.optionActive : ""
                  }`}
                  onClick={() => {
                    setNext(opt.value);
                    setOpen(false);
                  }}
                  role="menuitem"
                >
                  <span className={styles.optionLabel}>{opt.label}</span>

                  <span className={styles.optionBadgeWrap}>
                    <span className={styles.optionBadgeText}>{opt.badge}</span>
                  </span>
                </button>
              );
            })}

            <hr className={styles.divider} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LyDropdown;
