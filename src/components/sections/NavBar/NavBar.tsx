"use client";

import React, { useCallback, useRef, useState } from "react";
import style from "./style.module.css";
import Tooltip from "@/components/misc/Tooltip/Tooltip";
import { LuPanelRight } from "react-icons/lu";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import SmallCalendar from "./SmallCallendar/SmallCalendar";
import SearchBar, { PersonSuggestion } from "@/components/input/searchBar/SearchBar"; // ✅ import type
import router from "next/router";

// ... your NavBarProps stays the same

const NavBar: React.FC<NavBarProps> = ({
  onCollapse,
  onNextMonth,
  onPrevMonth,
  monthLabel,
  yearLabel,
  monthMenuOpen,
  onToggleMonthMenu,
  viewDate,
  children,
  selectedDate,
  onSelectDate,
}) => {
  const [query, setQuery] = useState("");

  // ✅ NEW: suggestions state
  const [suggestions, setSuggestions] = useState<PersonSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // ✅ NEW: called by SearchBar's debounce
  const onSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(trimmed)}`, {
        signal: ac.signal,
      });
      console.log(res)
      if (!res.ok) throw new Error("Bad response");
      const data = (await res.json()) as PersonSuggestion[];
      setSuggestions(data);
      console.log(data)
    } catch (err: any) {
      if (err?.name !== "AbortError") setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSelectSuggestion = (s: PersonSuggestion) => {
    setQuery(s.name);
    console.log("Selected user:", s.id, s.name, s.subtitle);

    router.push({
      pathname: `/user/${s.id}/calendar`,
      query: {
        userId: s.id,
      },
    });
  };

  return (
    <div className={style.navBar}>
      <div className={style.navBanner}>
        <Tooltip label="Hide panel" symbol="]">
          <button type="button" className={style.iconButton} onClick={onCollapse} aria-label="Hide panel">
            <LuPanelRight className={style.Icon} size={17} />
          </button>
        </Tooltip>

        <button type="button" className={style.iconButton} onClick={onNextMonth} aria-label="Next month"
          style={{ marginRight: "60px", marginLeft: "2px" }}>
          <MdOutlineKeyboardArrowRight className={style.Icon} size={20} />
        </button>

        <button type="button" className={style.iconButton} onClick={onPrevMonth} aria-label="Previous month">
          <MdOutlineKeyboardArrowLeft className={style.Icon} size={20} />
        </button>

        <p className={style.monthYear}>{monthLabel} {yearLabel}</p>

        <button type="button" className={style.iconButton} onClick={onToggleMonthMenu}
          aria-label="Toggle month menu" aria-expanded={monthMenuOpen} style={{ marginRight: "5px" }}>
          <MdOutlineKeyboardArrowDown
            className={`${style.Icon} ${monthMenuOpen ? style.arrowRotatedCCW : ""}`}
            size={20}
            style={{ marginRight: "10px" }}
          />
        </button>
      </div>

      {!monthMenuOpen && (
        <SmallCalendar viewDate={viewDate} selectedDate={selectedDate} onSelectDate={onSelectDate} />
      )}

      {children}
      <p className={style.clearSchedule}>Your schedule is clear!</p>
      <p className={style.meetWith}>Meet With</p>
      
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={onSearch}
        suggestions={suggestions}
        loading={loading}
        onSelectSuggestion={onSelectSuggestion}
        placeholder="Search for people..."
        ariaLabel="Search for people"
      />
      <hr />
    </div>
  );
};

export default NavBar;
