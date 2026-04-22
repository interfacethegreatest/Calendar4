import React from "react";
import styles from "./style.module.css";

type BodyMainProps = {
  selectedDate: Date | null;
};

const BodyMain: React.FC<BodyMainProps> = ({ selectedDate }) => {
  const safeDate = selectedDate ?? new Date();

  const dayNumber = safeDate.getDate().toString();
  const dayName = safeDate.toLocaleDateString("en-GB", {
    weekday: "short",
  }).toUpperCase();

  return (
    <div className={styles.main}>
      <div className={styles.bodyMainHeader}>
        <div className={styles.bodyMainHeaderLeft}>
          <div className={styles.timeZone}>
            <h5>BST</h5>
          </div>
        </div>

        <div className={styles.bodyMainHeaderRight}>
          <div className={styles.dayName}>{dayName}</div>
          <div className={styles.dayNumber}>{dayNumber}</div>
        </div>
      </div>
    </div>
  );
};

export default BodyMain;