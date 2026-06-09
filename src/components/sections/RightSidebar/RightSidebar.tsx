import React, { useEffect, useState } from "react";
import styles from "./style.module.css";

type RightSidebarProps = {
  onClose: () => void;
};

const rotatingPlaceholders = [
  "Try: team lunch at noon for 45mins",
  "Try: Coffee at tomorrow at 3pm",
  "Try: Offsite at blue bottle at 3pm for an hour",
  "Launch sync with John at 5pm pt",
  "Launch review at 4pm pt over zoom",
  "Try: 1:1 with John over zoom",
  "",
];

const PLACEHOLDER_DURATION_MS = 5200;

const RightSidebar: React.FC<RightSidebarProps> = ({ onClose }) => {
  const [textBoxClicked, setTextBoxClicked] = useState(true);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const currentPlaceholder = rotatingPlaceholders[placeholderIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((currentIndex) => {
        return (currentIndex + 1) % rotatingPlaceholders.length;
      });
    }, PLACEHOLDER_DURATION_MS);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <aside className={styles.rightSidebar}>
      <div
        className={`${styles.rightSidebarBanner} ${
          textBoxClicked ? styles.rightSidebarBannerActive : ""
        }`}
      >
        <input
          type="text"
          className={styles.rightSidebarTextBox}
          value={inputValue}
          autoFocus
          onChange={(event) => setInputValue(event.target.value)}
          onClick={() => setTextBoxClicked(true)}
          onFocus={() => setTextBoxClicked(true)}
        />

        {!inputValue && currentPlaceholder && (
          <span
            key={placeholderIndex}
            className={styles.rightSidebarPlaceholder}
          >
            {currentPlaceholder}
          </span>
        )}

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
      <div className={styles.rightSidebarBannerTwo}>
        <div className={styles.rightSidebarBannerTwoBookmark}>
          
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;