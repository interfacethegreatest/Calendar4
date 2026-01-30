"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import router from "next/router";

type Props = {
  img?: string;
  email?: string;
  id?:string;
};

const ProfileMenu: React.FC<Props> = ({ img,email,id,}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (rootRef.current && t && !rootRef.current.contains(t)) setOpen(false);
    };

    document.addEventListener("mousedown", handleDown);
    document.addEventListener("touchstart", handleDown, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("touchstart", handleDown);
    };
  }, [open]);

  return (
    <div className={styles.profileRoot} ref={rootRef}>
      <button
        type="button"
        className={styles.avatarButton}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className={styles.avatar} aria-label="Profile picture">
          {img ? (
            <div
              className={styles.avatarImg}
              style={{ backgroundImage: `url("${img}")` }}
            />
          ) : (
            <div className={styles.avatarFallback}>?</div>
          )}
        </div>
      </button>

      {open && (
            <div
            className={styles.dropdown}
            role="menu"
            onClick={(e) => {
                e.stopPropagation();

                router.push({
                pathname: `/user/${id}/`,
                query: { userId: id },
                });
            }}
            >
            Account
            <hr />
            <button className={styles.dropdownItem}>
             <div
              className={styles.avatarImg}
              style={{ backgroundImage: `url("${img}")` , height:"22px", width:"22px" ,borderRadius:"50%"}}
              />
              {email}
            </button>
            <hr />
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
