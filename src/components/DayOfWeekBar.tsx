import { DayAvailability } from "@/types/recruiting";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_STYLES: Record<DayAvailability, string> = {
  on: "bg-primary/10 text-primary border-primary/20",
  off: "bg-muted text-muted-foreground/50 border-muted-foreground/15",
  preferred: "bg-primary/20 text-primary border-primary/35 ring-1 ring-primary/15",
};

interface DayOfWeekBarProps {
  days: [DayAvailability, DayAvailability, DayAvailability, DayAvailability, DayAvailability, DayAvailability, DayAvailability];
}

export function DayOfWeekBar({ days }: DayOfWeekBarProps) {
  return (
    <div className="grid grid-cols-7 gap-2.5">
      {days.map((status, i) => (
        <div
          key={i}
          title={`${DAY_FULL[i]}: ${status === "on" ? "Available" : status === "preferred" ? "Preferred" : "Unavailable"}`}
          className={`flex items-center justify-center aspect-square rounded-md border-[1.5px] text-xs font-semibold transition-colors duration-150 ${DAY_STYLES[status]}`}
        >
          {DAY_LABELS[i]}
        </div>
      ))}
    </div>
  );
}
