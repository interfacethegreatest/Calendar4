import React, { useState } from "react";
import styles from "./style.module.css";

type RightSidebarProps = {
  onClose: () => void;
};

const RightSidebar: React.FC<RightSidebarProps> = ({ onClose }) => {
  const [bannerClicked, setBannerClicked] = useState(false);

  return (
    <aside className={styles.rightSidebar}>
      <div
        className={`${styles.rightSidebarBanner} ${
          bannerClicked ? styles.rightSidebarBannerActive : ""
        }`}
        onClick={() => setBannerClicked(true)}
      >
        <button
          type="button"
          className={styles.closeRightSidebarButton}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        >
          ×
        </button>
      </div>
    </aside>
  );
};

export default RightSidebar;