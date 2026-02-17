"use client";

import React, { useState } from "react";
import styles from "./style.module.css";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import CalendarEmail from "../calendarEmail/CalendarEmail";
import LyDropdown, { type ViewMode } from "@/components/dropdown/LyDropdown/LyDropdown";
import WeeklyShift from "@/components/misc/WeeklyShift/WeeklyShift";
import Tooltip from "@/components/misc/Tooltip/Tooltip";

type Props = {
  user: any;
};

const BodyHeader: React.FC<Props> = ({ user }) => {
  const img = user?.image as string | undefined;
  const email = user?.email as string | undefined;
  const id = user?._id as string | undefined;

  // ✅ single source of truth for the current view mode
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  return (
    <div className={styles.wrap} role="banner">
      <ProfileMenu img={img} email={email} id={id} />

      <CalendarEmail /> {/* search function */}
      
      {/* ✅ Controlled dropdown */}
      <LyDropdown value={viewMode} onChange={setViewMode} />

      <div className={styles.shiftLeft}>
        <Tooltip label={"Today"} symbol="T">
          <div className={styles.today}>Today</div>
        </Tooltip>

        {/* ✅ WeeklyShift now reacts to dropdown selection */}
        <WeeklyShift mode={viewMode} />
      </div>
    </div>
  );
};

export default BodyHeader;
