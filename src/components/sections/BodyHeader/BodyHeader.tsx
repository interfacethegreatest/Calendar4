"use client";

import React from "react";
import styles from "./style.module.css";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import CalendarEmail from "../calendarEmail/CalendarEmail";
import LyDropdown from "@/components/dropdown/LyDropdown/LyDropdown";



type Props = {
  user: any;
};

const BodyHeader: React.FC<Props> = ({ user }) => {
  const img = user?.image as string | undefined;
  const email = user?.email as string | undefined;
  const id = user?._id as string | undefined;
  console.log(user)
  return (
    <div className={styles.wrap} role="banner">
      <ProfileMenu
        img={img}
        email={email}
        id={id}
      />
      <CalendarEmail/>
      <LyDropdown/>
    </div>
  );
};

export default BodyHeader;
