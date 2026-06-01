import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

type CalendarBlock = {
  id: number;
  title: string;
  startSlot: number;
  duration: number;
};

type BodyMainProps = {
  selectedDate: Date | null;
  clearCalendarBlocksSignal?: number;
  onCalendarBlockCreated?: (block: CalendarBlock) => void;
};

type CreateDragState = {
  id: number;

  /**
   * The slot where the user first clicked.
   * This stays as the anchor while the user drags up or down.
   */
  anchorSlot: number;
};

type ResizeDragState = {
  id: number;
  edge: "top" | "bottom";
  startY: number;
  originalStartSlot: number;
  originalDuration: number;
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

const SLOT_HEIGHT = 64;

// 25% of one hour slot.
// 0.25 slot = 15 minutes.
const MIN_DURATION = 0.25;

// Snap every quarter slot.
// 0.25 = 15 minutes.
const SNAP_AMOUNT = 0.25;

const BodyMain: React.FC<BodyMainProps> = ({
  selectedDate,
  clearCalendarBlocksSignal = 0,
  onCalendarBlockCreated,
}) => {
  const bodyRightRef = useRef<HTMLDivElement | null>(null);

  const [calendarBlocks, setCalendarBlocks] = useState<CalendarBlock[]>([]);

  /**
   * This ref always stores the latest blocks immediately.
   * This fixes the issue where React state has not updated yet
   * when pointerup runs.
   */
  const calendarBlocksRef = useRef<CalendarBlock[]>([]);

  const [createDragState, setCreateDragState] =
    useState<CreateDragState | null>(null);

  const [resizeDragState, setResizeDragState] =
    useState<ResizeDragState | null>(null);

  const updateCalendarBlocks = useCallback(
    (updater: (currentBlocks: CalendarBlock[]) => CalendarBlock[]) => {
      const nextBlocks = updater(calendarBlocksRef.current);

      calendarBlocksRef.current = nextBlocks;

      setCalendarBlocks(nextBlocks);
    },
    []
  );

  useEffect(() => {
    if (clearCalendarBlocksSignal === 0) return;

    calendarBlocksRef.current = [];
    setCalendarBlocks([]);

    setCreateDragState(null);
    setResizeDragState(null);
  }, [clearCalendarBlocksSignal]);

  const safeDate = selectedDate ?? new Date();

  const dayNumber = safeDate.getDate().toString();

  const dayName = safeDate
    .toLocaleDateString("en-GB", {
      weekday: "short",
    })
    .toUpperCase();

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function snap(value: number) {
    return Math.round(value / SNAP_AMOUNT) * SNAP_AMOUNT;
  }

  function snapDown(value: number) {
    return Math.floor(value / SNAP_AMOUNT) * SNAP_AMOUNT;
  }

  function snapUp(value: number) {
    return Math.ceil(value / SNAP_AMOUNT) * SNAP_AMOUNT;
  }

  function createId() {
    return Date.now() + Math.random();
  }

  function keepOnlyActiveBlock(
    blocks: CalendarBlock[],
    activeBlockId: number
  ) {
    return blocks.filter((block) => block.id === activeBlockId);
  }

  function formatSlotTime(slot: number) {
    const totalMinutes = Math.round(slot * 60);

    const hours24 = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;

    const period = hours24 >= 12 ? "pm" : "am";

    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

    const paddedMinutes = minutes.toString().padStart(2, "0");

    if (minutes === 0) {
      return `${hours12} ${period}`;
    }

    return `${hours12}:${paddedMinutes} ${period}`;
  }

  function getBlockTimeRange(block: CalendarBlock) {
    const startTime = formatSlotTime(block.startSlot);
    const endTime = formatSlotTime(block.startSlot + block.duration);

    return `${startTime} - ${endTime}`;
  }

  function handleCalendarPointerDown(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (event.button !== 0) return;

    const clickedElement = event.target as HTMLElement;

    /**
     * Do not create a new event when the user is using a resize handle.
     */
    if (clickedElement.closest(`.${styles.resizeHandle}`)) {
      return;
    }

    /**
     * Do not create a new block when clicking an existing block.
     */
    if (clickedElement.closest(`.${styles.calendarBlock}`)) {
      return;
    }

    const bodyRight = bodyRightRef.current;

    if (!bodyRight) return;

    const rect = bodyRight.getBoundingClientRect();

    const yPositionInsideCalendar = event.clientY - rect.top;

    const rawSlot = yPositionInsideCalendar / SLOT_HEIGHT;

    const anchorSlot = clamp(
      snapDown(rawSlot),
      0,
      times.length - MIN_DURATION
    );

    const newBlock: CalendarBlock = {
      id: createId(),
      title: "(No title)",
      startSlot: anchorSlot,
      duration: MIN_DURATION,
    };

    /**
     * Keep the existing block while creating the new one.
     * On pointer release, only the newly-created block remains.
     */
    updateCalendarBlocks((currentBlocks) => [...currentBlocks, newBlock]);

    setCreateDragState({
      id: newBlock.id,
      anchorSlot,
    });
  }

  function handleResizePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    block: CalendarBlock,
    edge: "top" | "bottom"
  ) {
    event.preventDefault();
    event.stopPropagation();

    setResizeDragState({
      id: block.id,
      edge,
      startY: event.clientY,
      originalStartSlot: block.startSlot,
      originalDuration: block.duration,
    });
  }

  useEffect(() => {
    if (!createDragState) return;

    function handlePointerMove(event: PointerEvent) {
      const bodyRight = bodyRightRef.current;

      if (!bodyRight) return;

      const rect = bodyRight.getBoundingClientRect();

      const yPositionInsideCalendar = event.clientY - rect.top;

      const rawCurrentSlot = yPositionInsideCalendar / SLOT_HEIGHT;

      const anchorSlot = createDragState.anchorSlot;

      const isDraggingDown = rawCurrentSlot >= anchorSlot;

      updateCalendarBlocks((currentBlocks) =>
        currentBlocks.map((block) => {
          if (block.id !== createDragState.id) {
            return block;
          }

          if (isDraggingDown) {
            const endSlot = clamp(
              snapUp(rawCurrentSlot),
              anchorSlot + MIN_DURATION,
              times.length
            );

            return {
              ...block,
              startSlot: anchorSlot,
              duration: endSlot - anchorSlot,
            };
          }

          const startSlot = clamp(snapDown(rawCurrentSlot), 0, anchorSlot);

          const endSlot = anchorSlot + MIN_DURATION;

          return {
            ...block,
            startSlot,
            duration: endSlot - startSlot,
          };
        })
      );
    }

    function handlePointerUp() {
      const completedBlock = calendarBlocksRef.current.find(
        (block) => block.id === createDragState.id
      );

      updateCalendarBlocks((currentBlocks) =>
        keepOnlyActiveBlock(currentBlocks, createDragState.id)
      );

      if (completedBlock) {
        onCalendarBlockCreated?.(completedBlock);
      }

      setCreateDragState(null);
    }

    document.body.style.userSelect = "none";

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.body.style.userSelect = "";

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [createDragState, onCalendarBlockCreated, updateCalendarBlocks]);

  useEffect(() => {
    if (!resizeDragState) return;

    function handlePointerMove(event: PointerEvent) {
      const distanceMoved = event.clientY - resizeDragState.startY;

      const movedSlots = snap(distanceMoved / SLOT_HEIGHT);

      updateCalendarBlocks((currentBlocks) =>
        currentBlocks.map((block) => {
          if (block.id !== resizeDragState.id) {
            return block;
          }

          const originalEndSlot =
            resizeDragState.originalStartSlot +
            resizeDragState.originalDuration;

          if (resizeDragState.edge === "bottom") {
            const maxDuration =
              times.length - resizeDragState.originalStartSlot;

            const newDuration = clamp(
              resizeDragState.originalDuration + movedSlots,
              MIN_DURATION,
              maxDuration
            );

            return {
              ...block,
              duration: newDuration,
            };
          }

          const maxStartSlot = originalEndSlot - MIN_DURATION;

          const newStartSlot = clamp(
            resizeDragState.originalStartSlot + movedSlots,
            0,
            maxStartSlot
          );

          const newDuration = originalEndSlot - newStartSlot;

          return {
            ...block,
            startSlot: newStartSlot,
            duration: newDuration,
          };
        })
      );
    }

    function handlePointerUp() {
      updateCalendarBlocks((currentBlocks) =>
        keepOnlyActiveBlock(currentBlocks, resizeDragState.id)
      );

      setResizeDragState(null);
    }

    document.body.style.userSelect = "none";

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.body.style.userSelect = "";

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [resizeDragState, updateCalendarBlocks]);

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

        <div
          ref={bodyRightRef}
          className={styles.bodyRight}
          onPointerDown={handleCalendarPointerDown}
        >
          {times.map((time) => (
            <div key={time} className={styles.bodyRightTimeSlot}>
              {/* background time slot row */}
            </div>
          ))}

          {calendarBlocks.map((block) => {
            const top = block.startSlot * SLOT_HEIGHT;
            const height = block.duration * SLOT_HEIGHT;

            return (
              <div
                key={block.id}
                className={styles.calendarBlock}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                }}
              >
                <div
                  className={`${styles.resizeHandle} ${styles.topResizeHandle}`}
                  onPointerDown={(event) =>
                    handleResizePointerDown(event, block, "top")
                  }
                />

                <div className={styles.calendarBlockTitle}>{block.title}</div>

                <div className={styles.calendarBlockInfo}>
                  {getBlockTimeRange(block)}
                </div>

                <div
                  className={`${styles.resizeHandle} ${styles.bottomResizeHandle}`}
                  onPointerDown={(event) =>
                    handleResizePointerDown(event, block, "bottom")
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BodyMain;