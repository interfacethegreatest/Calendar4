"use client";

import React from "react";
import styles from "./style.module.css";

type Props = {
  user: any; // replace with your User type when ready
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "");
};

const BodyHeader: React.FC<Props> = ({ user }) => {
  const img = user?.image as string | undefined;
  const initials = getInitials(user?.name);

  return (
    <div className={styles.wrap} role="banner">
      <div className={styles.profile}>
        <div className={styles.avatar} aria-label="Profile picture">
          {img && (
            <div
              className={styles.avatarImg}
              style={{ backgroundImage: `url("${img}")` }}
            />
          )} 
        </div>
      </div>
    </div>
  );
};

export default BodyHeader;
