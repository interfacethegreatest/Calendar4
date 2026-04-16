"use client";

import React from "react";
import styles from "./style.module.css";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import CalendarEmail from "../calendarEmail/CalendarEmail";
import LyDropdown, { type ViewMode } from "@/components/dropdown/LyDropdown/LyDropdown";
import WeeklyShift from "@/components/misc/WeeklyShift/WeeklyShift";
import Tooltip from "@/components/misc/Tooltip/Tooltip";

type Props = {
  user: any;
  monthLabel: string;
  yearLabel: string;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onShiftPrev: () => void;
  onShiftNext: () => void;
};

const BodyHeader: React.FC<Props> = ({
  user,
  monthLabel,
  yearLabel,
  viewMode,
  onChangeViewMode,
  onShiftPrev,
  onShiftNext,
}) => {
  const img = user?.image as string | undefined;
  const email = user?.email as string | undefined;
  const id = user?._id as string | undefined;

  return (
    <div className={styles.wrap} role="banner">
      <ProfileMenu img={img} email={email} id={id} />

      <CalendarEmail />

      <LyDropdown value={viewMode} onChange={onChangeViewMode} />

      <div className={styles.shiftLeft}>
        <div className={styles.dateContainer}>
          <div className={styles.dateHeader}>
            {monthLabel} {yearLabel}
          </div>
          <div className={styles.dateHeaderLower}>
            (BST)Europe/London
          </div>
        </div>

        <Tooltip label={"Today"} symbol="T">
          <div className={styles.today}>Today</div>
        </Tooltip>

        <WeeklyShift
          mode={viewMode}
          onPrev={onShiftPrev}
          onNext={onShiftNext}
        />
      </div>
    </div>
  );
};

export default BodyHeader;