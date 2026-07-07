import { DayAvailability } from "@/types/recruiting";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DAY_STYLES: Record<DayAvailability, string> = {
  on: "bg-[hsl(225,40%,92%)] text-[hsl(225,40%,45%)] border-[hsl(225,35%,82%)] hover:bg-[hsl(225,40%,88%)] hover:border-[hsl(225,40%,72%)]",
  off: "bg-muted text-muted-foreground/40 border-muted-foreground/10 hover:bg-muted/80 hover:text-muted-foreground/60 hover:border-muted-foreground/20",
  preferred: "bg-[hsl(225,50%,88%)] text-[hsl(225,45%,40%)] border-[hsl(225,40%,75%)] ring-1 ring-[hsl(225,40%,80%)] hover:bg-[hsl(225,50%,84%)] hover:border-[hsl(225,45%,68%)]",
};

const DAY_TOOLTIP: Record<DayAvailability, { label: string; sublabel: string }> = {
  on: { label: "Available", sublabel: "Works this day" },
  off: { label: "Unavailable", sublabel: "Does not work this day" },
  preferred: { label: "Preferred", sublabel: "Prefers working this day" },
};

interface DayOfWeekBarProps {
  days: [DayAvailability, DayAvailability, DayAvailability, DayAvailability, DayAvailability, DayAvailability, DayAvailability];
  shiftTime?: string;
  startDate?: string;
}

export function DayOfWeekBar({ days, shiftTime, startDate }: DayOfWeekBarProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-7 gap-2.5">
        {days.map((status, i) => {
          const tooltip = DAY_TOOLTIP[status];
          const displayLabel = shiftTime 
            ? (status === "on" ? shiftTime : status === "off" ? "Not scheduled" : tooltip.label)
            : tooltip.label;
            
          let displayDay = DAY_FULL[i];
          if (startDate) {
            const d = new Date(startDate + "T00:00:00");
            d.setDate(d.getDate() + i);
            const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
            const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
            displayDay = `${dayName}, ${monthDay}`;
          }
            
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-center aspect-square rounded-md border-[1.5px] text-xs font-semibold transition-all duration-150 cursor-default ${DAY_STYLES[status]}`}
                >
                  {DAY_LABELS[i]}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <span className="font-medium">{displayDay}</span>
                <span className="text-muted-foreground"> · {displayLabel}</span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
