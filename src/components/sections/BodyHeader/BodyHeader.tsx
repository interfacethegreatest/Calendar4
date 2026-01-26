"use client";

import React from "react";
import styles from "./style.module.css";
import ProfileMenu from "../ProfileMenu/ProfileMenu";


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
        onProfile={() => console.log("profile")}
        onSettings={() => console.log("settings")}
        onSignOut={() => console.log("sign out")}
      />
    </div>
  );
};

export default BodyHeader;
