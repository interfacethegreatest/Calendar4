"use client";

import React from "react";
import style from "./style.module.css";
import Tooltip from "@/components/misc/Tooltip/Tooltip";
import { LuPanelRight } from "react-icons/lu";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import SmallCalendar from "./SmallCallendar/SmallCalendar";

type NavBarProps = {
  onCollapse: () => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  monthLabel: string;
  yearLabel: string;

  // ✅ lifted state
  monthMenuOpen: boolean;
  onToggleMonthMenu: () => void;

  children?: React.ReactNode;
};

const NavBar: React.FC<NavBarProps> = ({
  onCollapse,
  onNextMonth,
  onPrevMonth,
  monthLabel,
  yearLabel,
  monthMenuOpen,
  onToggleMonthMenu,
  children,
}) => {
  return (
    <div className={style.navBar}>
      <div className={style.navBanner}>
        <Tooltip label="Hide panel" symbol="]">
          <button
            type="button"
            className={style.iconButton}
            onClick={onCollapse}
            aria-label="Hide panel"
          >
            <LuPanelRight className={style.Icon} size={17} />
          </button>
        </Tooltip>

        <button
          type="button"
          className={style.iconButton}
          onClick={onNextMonth}
          aria-label="Next month"
          style={{ marginRight: "60px", marginLeft: "2px" }}
        >
          <MdOutlineKeyboardArrowRight className={style.Icon} size={20} />
        </button>

        <button
          type="button"
          className={style.iconButton}
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          <MdOutlineKeyboardArrowLeft className={style.Icon} size={20} />
        </button>

        <p className={style.monthYear}>
          {monthLabel} {yearLabel}
        </p>

        <button
          type="button"
          className={style.iconButton}
          onClick={onToggleMonthMenu}
          aria-label="Toggle month menu"
          aria-expanded={monthMenuOpen}
          style={{ marginRight: "5px" }}
        >
          <MdOutlineKeyboardArrowDown
            className={`${style.Icon} ${monthMenuOpen ? style.arrowRotatedCCW : ""}`}
            size={20}
            style={{marginRight:"10px"}}
          />
        </button>
      </div>
      {/* ✅ smallCalendar toggles with the arrow */}
      {!monthMenuOpen && <SmallCalendar />}

      {children}
    </div>
  );
};

export default NavBar;
