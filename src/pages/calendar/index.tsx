"use client";

import Scene from "@/components/backgrounds/starsBackground/Scene";
import React, { useEffect, useMemo, useState } from "react";
import style from "./style.module.css";
import NavBar from "@/components/sections/NavBar/NavBar";
import Modal from "@/components/modals/modal/modal";


const ComponentName: React.FC = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);

  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const shiftMonth = (delta: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const { monthLabel, yearLabel } = useMemo(() => {
    return {
      monthLabel: viewDate.toLocaleString("en-GB", { month: "short" }),
      yearLabel: viewDate.toLocaleString("en-GB", { year: "numeric" }),
    };
  }, [viewDate]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // ✅ NEW: modal open state
  const [cmdJOpen, setCmdJOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      // allow Esc to close modal even while focused in inputs
      if (e.key === "Escape") {
        setCmdJOpen(false);
        return;
      }

      if (isEditable) return;

      // ✅ Ctrl/⌘ + J opens modal
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isJ = e.key.toLowerCase() === "j" || e.code === "KeyJ";

      if (isCtrlOrCmd && isJ) {
        // may not override browser (Ctrl+J downloads), but this is correct to try
        e.preventDefault();
        setCmdJOpen(true);
        return;
      }

      if (e.key === "]" || e.code === "BracketRight") {
        setNavCollapsed((v) => !v);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className={style.main}>
      <Scene />

      {!navCollapsed && (
        <NavBar
          onCollapse={() => setNavCollapsed(true)}
          onNextMonth={() => shiftMonth(1)}
          onPrevMonth={() => shiftMonth(-1)}
          monthLabel={monthLabel}
          yearLabel={yearLabel}
          monthMenuOpen={monthMenuOpen}
          onToggleMonthMenu={() => setMonthMenuOpen((v) => !v)}
          viewDate={viewDate}
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setSelectedDate(d);
            console.log("clicked:", d);
          }}
        />
      )}

      <div className={style.body} />

      {/* ✅ Modal invoked by Ctrl/⌘ + J */}
      <Modal open={cmdJOpen} onClose={() => setCmdJOpen(false)}>

        {/* put your “modal object component” content here */}
      </Modal>
    </main>
  );
};

export default ComponentName;