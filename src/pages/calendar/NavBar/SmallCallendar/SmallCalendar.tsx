"use client";

import React from "react";
import style from "./style.module.css";

const SmallCalendar: React.FC = () => {
  return <div className={style.smallCalendar}>
    <div className={style.dayName}>
        S
    </div>
    <div className={style.dayName}>
        M
    </div>
    <div className={style.dayName}>
        T
    </div>
    <div className={style.dayName}>
        W
    </div>
    <div className={style.dayName}>
        T
    </div>
    <div className={style.dayName}>
        F
    </div>
    <div className={style.dayName}>
        S
    </div>
  </div>;
};

export default SmallCalendar;
