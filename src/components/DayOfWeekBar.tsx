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
}

export function DayOfWeekBar({ days }: DayOfWeekBarProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-7 gap-2.5">
        {days.map((status, i) => {
          const tooltip = DAY_TOOLTIP[status];
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
                <span className="font-medium">{DAY_FULL[i]}</span>
                <span className="text-muted-foreground"> · {tooltip.label}</span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
