import { DayAvailability } from "@/types/recruiting";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_STYLES: Record<DayAvailability, string> = {
  on: "bg-[hsl(225,40%,92%)] text-[hsl(225,40%,45%)] border-[hsl(225,35%,82%)]",
  off: "bg-muted text-muted-foreground/40 border-muted-foreground/10",
  preferred: "bg-[hsl(225,50%,88%)] text-[hsl(225,45%,40%)] border-[hsl(225,40%,75%)] ring-1 ring-[hsl(225,40%,80%)]",
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
