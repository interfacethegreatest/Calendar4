import React from "react";
import styles from "./style.module.css";

type BodyMainProps = {
  selectedDate: Date | null;
};

const times = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

const BodyMain: React.FC<BodyMainProps> = ({ selectedDate }) => {
  const safeDate = selectedDate ?? new Date();

  const dayNumber = safeDate.getDate().toString();
  const dayName = safeDate
    .toLocaleDateString("en-GB", {
      weekday: "short",
    })
    .toUpperCase();

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

      <div className={styles.body}>
        <div className={styles.bodyLeft}>
          {times.map((time) => (
            <div key={time} className={styles.timeSlot}>
              {time}
            </div>
          ))}
        </div>

        <div className={styles.bodyRight}>
          {/* main content */}
        </div>
      </div>
    </div>
  );
};

export default BodyMain;