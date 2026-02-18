import { DayAvailability } from "@/types/recruiting";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_STYLES: Record<DayAvailability, string> = {
  on: "bg-primary/15 text-primary border-primary/25",
  off: "bg-muted/60 text-muted-foreground/40 border-border/50",
  preferred: "bg-primary/25 text-primary border-primary/40 ring-1 ring-primary/20",
};

interface DayOfWeekBarProps {
  days: [DayAvailability, DayAvailability, DayAvailability, DayAvailability, DayAvailability, DayAvailability, DayAvailability];
}

export function DayOfWeekBar({ days }: DayOfWeekBarProps) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((status, i) => (
        <div
          key={i}
          title={`${DAY_FULL[i]}: ${status === "on" ? "Available" : status === "preferred" ? "Preferred" : "Unavailable"}`}
          className={`flex items-center justify-center rounded-md border text-xs font-semibold py-1.5 transition-colors duration-150 ${DAY_STYLES[status]}`}
        >
          {DAY_LABELS[i]}
        </div>
      ))}
    </div>
  );
}
