"use client";

import Scene from "@/components/backgrounds/starsBackground/Scene";
import React, { useEffect, useMemo, useRef, useState } from "react";
import style from "./style.module.css";
import { Poppins } from "next/font/google";
import { RxTriangleRight } from "react-icons/rx";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

type Props = {};

const ComponentName: React.FC<Props> = () => {
  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());

  const monthWrapRef = useRef<HTMLDivElement | null>(null);
  const yearWrapRef = useRef<HTMLDivElement | null>(null);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleString("en-GB", { month: "long" })),
    []
  );

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const start = current - 10;
    const end = current + 10;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, []);

  // click-outside to close
  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;

      if (openMonth && monthWrapRef.current && !monthWrapRef.current.contains(t)) setOpenMonth(false);
      if (openYear && yearWrapRef.current && !yearWrapRef.current.contains(t)) setOpenYear(false);
    }

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openMonth, openYear]);

  return (
    <main id={style.main}>
      <Scene />
      <h1 id={style.mainBannerText} className={font.className}>
        Make the most of your professional career.
      </h1>

      <div id={style.calendar}>
        <div id={style.calendarHeader}>
          {/* Month dropdown */}
          <div className={style.dropdownWrap} ref={monthWrapRef}>
            <div className={style.headerRow}>
              <p id={style.calendarMonth} className={font.className}>
                {months[selectedMonth]}
              </p>

              <button
                type="button"
                className={style.triangleBtn}
                aria-label="Toggle month dropdown"
                aria-expanded={openMonth}
                onClick={() => {
                  setOpenMonth((v) => !v);
                  setOpenYear(false);
                }}
              >
                <RxTriangleRight className={`${style.triangleIcon} ${openMonth ? style.triangleOpen : ""}`} />
              </button>
            </div>

            {openMonth && (
              <ul className={style.dropdownMenu} role="listbox" aria-label="Select month">
                {months.map((m, i) => (
                  <li key={m}>
                    <button
                      type="button"
                      className={`${style.dropdownItem} ${i === selectedMonth ? style.dropdownItemActive : ""}`}
                      onClick={() => {
                        setSelectedMonth(i);
                        setOpenMonth(false);
                      }}
                      role="option"
                      aria-selected={i === selectedMonth}
                    >
                      {m}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Year dropdown */}
          <div className={style.dropdownWrap} ref={yearWrapRef}>
            <div className={style.headerRow}>
              <p id={style.calendarYear}>{selectedYear}</p>

              <button
                type="button"
                className={style.triangleBtn}
                aria-label="Toggle year dropdown"
                aria-expanded={openYear}
                onClick={() => {
                  setOpenYear((v) => !v);
                  setOpenMonth(false);
                }}
              >
                <RxTriangleRight className={`${style.triangleIcon} ${openYear ? style.triangleOpen : ""}`} />
              </button>
            </div>

            {openYear && (
              <ul className={style.dropdownMenu} role="listbox" aria-label="Select year">
                {years.map((y) => (
                  <li key={y}>
                    <button
                      type="button"
                      className={`${style.dropdownItem} ${y === selectedYear ? style.dropdownItemActive : ""}`}
                      onClick={() => {
                        setSelectedYear(y);
                        setOpenYear(false);
                      }}
                      role="option"
                      aria-selected={y === selectedYear}
                    >
                      {y}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ComponentName;
