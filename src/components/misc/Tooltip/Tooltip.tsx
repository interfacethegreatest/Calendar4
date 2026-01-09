"use client";

import React, { useId, useState } from "react";
import styles from "./Tooltip.module.css";

type TooltipProps = {
  label: string;
  symbol?: string;          // ✅ allow user to pass it
  children: React.ReactNode;
  offset?: number;
};

export default function Tooltip({
  label,
  symbol = "]",            // ✅ default if user doesn’t pass one
  children,
  offset = 10,
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={styles.wrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span className={styles.trigger} aria-describedby={open ? id : undefined}>
        {children}
      </span>

      <span
        id={id}
        role="tooltip"
        className={`${styles.tooltip} ${open ? styles.open : ""}`}
        style={{ top: `calc(100% + ${offset}px)` }}
      >
        <span className={styles.tooltipText}>{label}</span>

        <span className={styles.bracketBox} aria-hidden="true">
          {symbol}
        </span>
      </span>
    </span>
  );
}
