"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

type TooltipProps = {
  label: string;
  symbol?: string;
  children: React.ReactNode;
  offset?: number;
};

export default function Tooltip({
  label,
  symbol,
  children,
  offset = 10,
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => setMounted(true), []);

  const updatePosition = () => {
    const el = wrapRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();

    // center tooltip over trigger and place below it
    setPos({
      left: r.left + r.width / 2,
      top: r.bottom + offset,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();

    window.addEventListener("scroll", onScroll, true); // true = catch scroll in containers
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, offset]);

  return (
    <span
      ref={wrapRef}
      className={styles.wrap}
      onMouseEnter={() => {
        setOpen(true);
        // compute immediately
        queueMicrotask(updatePosition);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        setOpen(true);
        queueMicrotask(updatePosition);
      }}
      onBlur={() => setOpen(false)}
    >
      <span className={styles.trigger} aria-describedby={open ? id : undefined}>
        {children}
      </span>

      {mounted && open && pos
        ? createPortal(
            <span
              id={id}
              role="tooltip"
              className={`${styles.tooltip} ${styles.open}`}
              style={{
                position: "fixed",
                left: pos.left,
                top: pos.top,
                transform: "translateX(-50%) translateY(-2px)",
                zIndex: 100000, // ✅ guaranteed above modal
              }}
            >
              <span className={styles.tooltipText}>{label}</span>
              <span className={styles.bracketBox} aria-hidden="true">
                {symbol}
              </span>
            </span>,
            document.body
          )
        : null}
    </span>
  );
}
