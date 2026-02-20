import { ShiftPreference, ShiftType, ShiftStance } from "@/types/recruiting";
import { CalendarDays, Moon, Sunset, Repeat } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SHIFT_META: Record<ShiftType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  weekends: { label: "Weekends", icon: CalendarDays },
  nights: { label: "Nights", icon: Moon },
  overnights: { label: "Overnights", icon: Sunset },
  back_to_back: { label: "Back-to-Back", icon: Repeat },
};

const STANCE_STYLES: Record<ShiftStance, { bg: string; border: string; text: string; label: string }> = {
  works: {
    bg: "bg-[hsl(var(--status-completed-bg))]",
    border: "border-[hsl(var(--status-completed-border))]",
    text: "text-[hsl(var(--status-completed))]",
    label: "Works",
  },
  does_not_work: {
    bg: "bg-[hsl(var(--status-red-flag-bg))]",
    border: "border-[hsl(var(--status-red-flag-border))]",
    text: "text-[hsl(var(--status-red-flag))]",
    label: "Does Not Work",
  },
  prefers: {
    bg: "bg-[hsl(var(--status-in-progress-bg))]",
    border: "border-[hsl(var(--status-in-progress-border))]",
    text: "text-[hsl(var(--status-in-progress))]",
    label: "Prefers",
  },
  higher_rate: {
    bg: "bg-[hsl(var(--status-exception-bg))]",
    border: "border-[hsl(var(--status-exception-border))]",
    text: "text-[hsl(var(--status-exception))]",
    label: "Higher Rate",
  },
};

interface ShiftPreferenceIconsProps {
  preferences: ShiftPreference[];
}

export function ShiftPreferenceIcons({ preferences }: ShiftPreferenceIconsProps) {
  if (!preferences.length) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-2 pt-1">
        {preferences.map((pref) => {
          const shift = SHIFT_META[pref.shift];
          const stance = STANCE_STYLES[pref.stance];
          const Icon = shift.icon;

          return (
            <Tooltip key={pref.shift}>
              <TooltipTrigger asChild>
                <div
                  className={`w-8 h-8 rounded-md border flex items-center justify-center cursor-default transition-all duration-150 hover:scale-[1.1] hover:shadow-sm ${stance.bg} ${stance.border} ${stance.text}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <span className="font-medium">{shift.label}</span>
                <span className="text-muted-foreground"> · {stance.label}</span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
