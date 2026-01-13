"use client";

import Scene from "@/components/backgrounds/starsBackground/Scene";
import React, { useEffect, useMemo, useState } from "react";
import style from "./style.module.css";
import NavBar from "./NavBar/NavBar";

const ComponentName: React.FC = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);

  // ✅ moved out of NavBar so it survives unmount/remount
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);

  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if (isEditable) return;

      if (e.key === "]" || e.code === "BracketRight") {
        setNavCollapsed((v) => !v);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const shiftMonth = (delta: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const { monthLabel, yearLabel } = useMemo(() => {
    return {
      monthLabel: viewDate.toLocaleString("en-GB", { month: "short" }),
      yearLabel: viewDate.toLocaleString("en-GB", { year: "numeric" }),
    };
  }, [viewDate]);
  console.log(viewDate)
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
          viewDate={viewDate}   // ✅ add this
        >
          {/* other navbar children go here */}
        </NavBar>
      )}

      <div className={style.body}></div>
    </main>
  );
};

export default ComponentName;
