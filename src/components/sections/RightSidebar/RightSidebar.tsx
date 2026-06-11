import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { VscSmiley } from "react-icons/vsc";

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
const ADD_TEXT_FLASH_MS = 420;
const ADD_TEXT_UPDATE_DELAY_MS = 220;

const RightSidebar: React.FC<RightSidebarProps> = ({ onClose }) => {
  const [textBoxClicked, setTextBoxClicked] = useState(true);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const [addTextValue, setAddTextValue] = useState("");
  const [addTextFocused, setAddTextFocused] = useState(false);
  const [addTextFlash, setAddTextFlash] = useState(false);

  const addTextFlashTimeoutRef = useRef<ReturnType<
    typeof window.setTimeout
  > | null>(null);

  const addTextUpdateDelayRef = useRef<ReturnType<
    typeof window.setTimeout
  > | null>(null);

  const currentPlaceholder = rotatingPlaceholders[placeholderIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((currentIndex) => {
        return (currentIndex + 1) % rotatingPlaceholders.length;
      });
    }, PLACEHOLDER_DURATION_MS);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (addTextFlashTimeoutRef.current) {
        window.clearTimeout(addTextFlashTimeoutRef.current);
      }

      if (addTextUpdateDelayRef.current) {
        window.clearTimeout(addTextUpdateDelayRef.current);
      }
    };
  }, []);

  const flashAddTextBox = () => {
    setAddTextFlash(false);

    window.requestAnimationFrame(() => {
      setAddTextFlash(true);

      if (addTextFlashTimeoutRef.current) {
        window.clearTimeout(addTextFlashTimeoutRef.current);
      }

      addTextFlashTimeoutRef.current = window.setTimeout(() => {
        setAddTextFlash(false);
      }, ADD_TEXT_FLASH_MS);
    });
  };

  const handleTopTextBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextValue = event.target.value;

    // Top textbox updates instantly.
    setInputValue(nextValue);

    // Add text box updates after a slight delay.
    if (addTextUpdateDelayRef.current) {
      window.clearTimeout(addTextUpdateDelayRef.current);
    }

    addTextUpdateDelayRef.current = window.setTimeout(() => {
      setAddTextValue(nextValue);
      flashAddTextBox();
    }, ADD_TEXT_UPDATE_DELAY_MS);
  };

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
          onChange={handleTopTextBoxChange}
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
        <div className={styles.rightSidebarBannerTwoBookmark} />

        <VscSmiley className={styles.smiley} size={19} />

        <div className={styles.rightSidebarAddTextWrapper}>
          <input
            type="text"
            value={addTextValue}
            placeholder="Add text"
            className={`${styles.rightSidebarAddTextBox} ${
              addTextFlash ? styles.rightSidebarAddTextBoxFlash : ""
            }`}
            onChange={(event) => setAddTextValue(event.target.value)}
            onClick={() => setAddTextFocused(true)}
            onFocus={() => setAddTextFocused(true)}
            onBlur={() => setAddTextFocused(false)}
          />

          <div
            className={`${styles.rightSidebarAddTextUnderline} ${
              addTextFocused || addTextFlash
                ? styles.rightSidebarAddTextUnderlineActive
                : ""
            }`}
          />
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;