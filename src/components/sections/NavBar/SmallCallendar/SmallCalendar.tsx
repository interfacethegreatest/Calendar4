"use client";

import React, { useCallback, useMemo } from "react";
import style from "./style.module.css";

type SmallCalendarProps = {
  viewDate: Date; // first of month
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
};

const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"] as const;

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const monthIndex = (d: Date) => d.getFullYear() * 12 + d.getMonth();

const SmallCalendar: React.FC<SmallCalendarProps> = ({
  viewDate,
  selectedDate,
  onSelectDate,
  onNextMonth,
  onPrevMonth,
}) => {
  const { cells, monthStart, today } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthStart = new Date(year, month, 1);
    const firstDayIndex = monthStart.getDay(); // 0=Sun..6=Sat
    const today = new Date();

    const totalCells = 42;

    // Start grid on Sunday before (or equal to) the 1st
    const gridStart = new Date(year, month, 1 - firstDayIndex);

    const cells = Array.from({ length: totalCells }, (_, i) => {
      return new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + i
      );
    });

    return { cells, monthStart, today };
  }, [viewDate]);

  const handleSelect = useCallback(
    (dateObj: Date) => {
      const current = monthIndex(monthStart);
      const clicked = monthIndex(dateObj);

      const diff = clicked - current;

      // If user clicked outside the visible month, move the main month first
      if (diff > 0) {
        for (let i = 0; i < diff; i++) onNextMonth();
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) onPrevMonth();
      }

      // Always select the clicked date
      onSelectDate(dateObj);
    },
    [monthStart, onNextMonth, onPrevMonth, onSelectDate]
  );

  return (
    <div className={style.smallCalendar}>
      {/* header row */}
      {DAY_NAMES.map((d, idx) => (
        <div key={`h-${idx}`} className={style.dayName}>
          {d}
        </div>
      ))}

      {/* day grid */}
      {cells.map((dateObj, idx) => {
        const inCurrentMonth = dateObj.getMonth() === monthStart.getMonth();

        const isToday = isSameDay(dateObj, today);
        const isSelected = !!selectedDate && isSameDay(dateObj, selectedDate);

        return (
          <button
            key={`c-${idx}`}
            type="button"
            className={[
              style.dayCell,
              !inCurrentMonth ? style.outsideMonth : "",
              isToday ? style.today : "",
              isSelected ? style.selected : "",
            ].join(" ")}
            onClick={() => handleSelect(dateObj)}
            aria-label={dateObj.toDateString()}
            aria-pressed={isSelected}
          >
            {dateObj.getDate()}
          </button>
        );
      })}
    </div>
  );
};

export default SmallCalendar;
