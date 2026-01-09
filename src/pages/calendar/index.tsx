"use client";

import Scene from "@/components/backgrounds/starsBackground/Scene";
import React, { useState } from "react";
import style from "./style.module.css";
import { LuPanelRight } from "react-icons/lu";
import Tooltip from "@/components/misc/Tooltip/Tooltip";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
const ComponentName: React.FC = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);

  return (
    <main className={style.main}>
      <Scene />

      {!navCollapsed && (
        <div className={style.navBar}>
          <div className={style.navBanner}>
            <Tooltip label="Hide panel" symbol="]">
              <button
                type="button"
                className={style.iconButton}
                onClick={() => setNavCollapsed(true)}
                aria-label="Hide panel"
              >
                <LuPanelRight className={style.Icon} size={18} />
              </button>
            </Tooltip>
            <MdOutlineKeyboardArrowRight className={style.Icon} style={{marginRight:"60px", marginLeft:"2px"}} size={20}/>
            <MdOutlineKeyboardArrowLeft className={style.Icon} size={20}/>
          </div>
          

          {/* other navbar children go here */}
        </div>
      )}

      <div className={style.body}>
        
      </div>
    </main>
  );
};

export default ComponentName;
