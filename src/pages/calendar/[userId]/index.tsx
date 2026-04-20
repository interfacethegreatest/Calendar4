import Scene from "@/components/backgrounds/starsBackground/Scene";
import React, { useEffect, useMemo, useState } from "react";
import style from "./style.module.css";
import NavBar from "@/components/sections/NavBar/NavBar";
import Modal from "@/components/modals/modal/modal";
import BodyHeader from "@/components/sections/BodyHeader/BodyHeader";

import type { InferGetServerSidePropsType, NextPageContext } from "next";
import type { ViewMode } from "@/components/dropdown/LyDropdown/LyDropdown";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { isValidObjectId } from "mongoose";
import BodyMain from "@/components/sections/BodyMain/BodyMain";

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonthsClamped(date: Date, amount: number) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const targetMonthStart = new Date(year, month + amount, 1);
  const targetYear = targetMonthStart.getFullYear();
  const targetMonth = targetMonthStart.getMonth();

  const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

  return new Date(targetYear, targetMonth, Math.min(day, lastDayOfTargetMonth));
}

export default function ComponentName({
  userId,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);

  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [cmdJOpen, setCmdJOpen] = useState(false);

  const shiftMonth = (delta: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const { monthLabel, monthLabelLong, yearLabel } = useMemo(() => {
    return {
      monthLabel: viewDate.toLocaleString("en-GB", { month: "short" }),
      monthLabelLong: viewDate.toLocaleString("en-GB", { month: "long" }),
      yearLabel: viewDate.toLocaleString("en-GB", { year: "numeric" }),
    };
  }, [viewDate]);

  const shiftSelectedDate = (direction: -1 | 1) => {
    const baseDate = selectedDate ?? new Date();
    let nextDate: Date;

    switch (viewMode) {
      case "month":
        nextDate = addMonthsClamped(baseDate, direction);
        break;

      case "4days":
        nextDate = addDays(baseDate, 4 * direction);
        break;

      case "7days":
      case "week":
        nextDate = addDays(baseDate, 7 * direction);
        break;

      case "day":
        nextDate = addDays(baseDate, 1 * direction);
        break;

      default:
        nextDate = addDays(baseDate, 1 * direction);
        break;
    }

    setSelectedDate(nextDate);
    setViewDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (e.key === "Escape") {
        setCmdJOpen(false);
        return;
      }

      if (isEditable) return;

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isJ = e.key.toLowerCase() === "j" || e.code === "KeyJ";

      if (isCtrlOrCmd && isJ) {
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
          onSelectDate={(d) => setSelectedDate(d)}
        />
      )}

      <div className={style.body}>
        <BodyHeader
          monthLabel={monthLabelLong}
          yearLabel={yearLabel}
          user={user}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onShiftPrev={() => shiftSelectedDate(-1)}
          onShiftNext={() => shiftSelectedDate(1)}
        />
        <BodyMain/>
      </div>

      <Modal open={cmdJOpen} onClose={() => setCmdJOpen(false)}>
        {/* modal content */}
      </Modal>
    </main>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const userIdRaw = ctx.query?.userId;
  const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw;

  if (!userId || !isValidObjectId(userId)) {
    return { notFound: true };
  }

  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) return { notFound: true };

    return {
      props: {
        userId,
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { notFound: true };
  }
}