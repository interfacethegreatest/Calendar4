"use client";

import React, { useMemo } from "react";
import style from "./style.module.css";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import Tooltip from "../Tooltip/Tooltip";
import type { ViewMode } from "@/components/dropdown/LyDropdown/LyDropdown";

type Props = {
  mode: ViewMode;

  // optional hooks if you want the arrows to actually shift the view
  onPrev?: () => void;
  onNext?: () => void;

  // keep your existing shortcuts by default
  prevSymbol?: string;
  nextSymbol?: string;
};

const WeeklyShift: React.FC<Props> = ({
  mode,
  onPrev,
  onNext,
  prevSymbol = "U",
  nextSymbol = "I",
}) => {
  const { prevLabel, nextLabel } = useMemo(() => {
    // ✅ Map dropdown view mode -> tooltip wording
    switch (mode) {
      case "month":
        return { prevLabel: "Previous Month", nextLabel: "Next Month" };
      case "4days":
        return { prevLabel: "Previous Period", nextLabel: "Next Period" };
      case "7days":
        return { prevLabel: "Previous Week", nextLabel: "Next Week" };
      case "week":
        return { prevLabel: "Previous Week", nextLabel: "Next Week" };
      case "day":
        return { prevLabel: "Previous Day", nextLabel: "Next Day" };
      default:
        return { prevLabel: "Previous", nextLabel: "Next" };
    }
  }, [mode]);

  return (
    <div className={style.panel}>
      <Tooltip label={prevLabel} symbol={prevSymbol}>
        <button
          type="button"
          className={style.iconBtn}
          onClick={onPrev}
          aria-label={prevLabel}
        >
          <MdOutlineChevronLeft className={style.arrow} size={19} />
        </button>
      </Tooltip>

      <Tooltip label={nextLabel} symbol={nextSymbol}>
        <button
          type="button"
          className={style.iconBtn}
          onClick={onNext}
          aria-label={nextLabel}
        >
          <MdOutlineChevronRight className={style.secondArrow} size={19} />
        </button>
      </Tooltip>
    </div>
  );
};

export default WeeklyShift;
