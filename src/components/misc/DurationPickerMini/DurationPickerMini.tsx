import React from "react";

type Theme = Partial<{
  primary: string;
  bg: string;
  text: string;
  border: string;
  ring: string;
  muted: string;
  card: string;
}>;

export default function DurationPickerMini({
  valueMinutes,
  onChange,
  maxHours = 12,
  minuteStep = 5,
  label = "Duration",
  theme,
  className,
  style,
}: {
  valueMinutes: number;
  onChange: (minutes: number) => void;
  maxHours?: number;      // inclusive (0..maxHours)
  minuteStep?: number;    // 1, 5, 10, 15...
  label?: string;
  theme?: Theme;          // color overrides
  className?: string;
  style?: React.CSSProperties;
}) {
  const total = clamp(valueMinutes, 0, maxHours * 60 + 59);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  const minuteOptions = React.useMemo(() => {
    const step = Math.max(1, Math.min(30, Math.floor(minuteStep)));
    const arr: number[] = [];
    for (let m = 0; m < 60; m += step) arr.push(m);
    if (!arr.includes(minutes)) arr.push(minutes);
    return Array.from(new Set(arr)).sort((a, b) => a - b);
  }, [minuteStep, minutes]);

  const cssVars: React.CSSProperties = {
    ["--dpm-primary" as any]: theme?.primary ?? "#10b981",
    ["--dpm-bg" as any]: theme?.bg ?? "transparent",
    ["--dpm-card" as any]: theme?.card ?? "transparent",
    ["--dpm-text" as any]: theme?.text ?? "inherit",
    ["--dpm-muted" as any]: theme?.muted ?? "#6b7280",
    ["--dpm-border" as any]: theme?.border ?? "#334155",
    ["--dpm-ring" as any]: theme?.ring ?? theme?.primary ?? "#10b981",
    ...style,
  } as React.CSSProperties;

  const setHM = (h: number, m: number) => {
    const clamped = clamp(h * 60 + m, 0, maxHours * 60 + 59);
    onChange(clamped);
  };

  return (
    <div
      className={`inline-flex items-center gap-2 p-2 rounded-xl border bg-[var(--dpm-bg)] border-[var(--dpm-border)] ${className ?? ""}`}
      style={cssVars}
    >
      <span className="text-xs text-[var(--dpm-muted)]">{label}</span>

      {/* Hours */}
      <div className="flex items-center gap-1">
        <select
          aria-label="Hours"
          className="rounded-lg border px-2 py-1 bg-transparent text-[var(--dpm-text)] border-[var(--dpm-border)] focus:outline-none focus:ring-2 focus:ring-[var(--dpm-ring)]"
          value={hours}
          onChange={(e) => setHM(Number(e.target.value), minutes)}
        >
          {Array.from({ length: maxHours + 1 }, (_, i) => i).map((h) => (
            <option key={h} value={h} className="bg-[var(--dpm-bg)]">
              {h}
            </option>
          ))}
        </select>
        <span className="text-sm text-[var(--dpm-muted)]">hr</span>
      </div>

      <span className="text-[var(--dpm-muted)]">:</span>

      {/* Minutes */}
      <div className="flex items-center gap-1">
        <select
          aria-label="Minutes"
          className="rounded-lg border px-2 py-1 bg-transparent text-[var(--dpm-text)] border-[var(--dpm-border)] focus:outline-none focus:ring-2 focus:ring-[var(--dpm-ring)]"
          value={minutes}
          onChange={(e) => setHM(hours, Number(e.target.value))}
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m} className="bg-[var(--dpm-bg)]">
              {m.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="text-sm text-[var(--dpm-muted)]">min</span>
      </div>

      {/* Quick +/- step */}
      <div className="flex items-center gap-1 ml-1">
        <button
          type="button"
          className="px-2 py-1 rounded-lg border border-[var(--dpm-border)] hover:bg-[var(--dpm-primary)]/10 transition"
          onClick={() => setHM(hours, Math.max(0, minutes - minuteStep))}
          aria-label={`Decrease ${minuteStep} minutes`}
        >
          −{minuteStep}
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded-lg border border-[var(--dpm-border)] hover:bg-[var(--dpm-primary)]/10 transition"
          onClick={() => setHM(hours, Math.min(59, minutes + minuteStep))}
          aria-label={`Increase ${minuteStep} minutes`}
        >
          +{minuteStep}
        </button>
      </div>

      {/* Display */}
      <div className="ml-2 text-sm text-[var(--dpm-text)] font-medium tabular-nums">
        {hours}hr:{minutes.toString().padStart(2, "0")}m
      </div>

      <style>{`select option { color: var(--dpm-text); }`}</style>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
