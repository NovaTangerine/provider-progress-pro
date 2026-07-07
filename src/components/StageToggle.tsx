import { ProviderStage, Provider } from "@/types/recruiting";
import { X, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface StageToggleProps {
  providers: Provider[];
  activeStage: ProviderStage | null;
  onStageChange: (stage: ProviderStage | null) => void;
}

const STAGES: { value: ProviderStage; label: string }[] = [
  { value: "presented", label: "Presented" },
  { value: "awaiting_confirmation", label: "Awaiting Confirmation" },
  { value: "confirmed", label: "Confirmed" },
  { value: "credentialing", label: "Credentialing" },
  { value: "credentialing_complete", label: "Credentialing Complete" },
  { value: "on_assignment", label: "On Assignment" },
];

export function StageToggle({ providers, activeStage, onStageChange }: StageToggleProps) {
  const isMobile = useIsMobile();

  const counts = providers.reduce(
    (acc, p) => {
      acc[p.stage] = (acc[p.stage] || 0) + 1;
      return acc;
    },
    {} as Record<ProviderStage, number>
  );

  const activeLabel = activeStage
    ? STAGES.find((s) => s.value === activeStage)?.label
    : "All Providers";

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-foreground transition-all duration-150">
            {activeLabel}
            <span className="text-[11px] font-medium text-muted-foreground">
              {activeStage ? (counts[activeStage] || 0) : providers.length}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[180px]">
          <DropdownMenuItem
            onClick={() => onStageChange(null)}
            className={`text-xs ${!activeStage ? "font-semibold" : ""}`}
          >
            All Providers
            <span className="ml-auto text-muted-foreground text-[10px]">
              {providers.length}
            </span>
          </DropdownMenuItem>
          {STAGES.map((s) => (
            <DropdownMenuItem
              key={s.value}
              onClick={() => onStageChange(s.value)}
              className={`text-xs ${activeStage === s.value ? "font-semibold" : ""}`}
            >
              {s.label}
              <span className="ml-auto text-muted-foreground text-[10px]">
                {counts[s.value] || 0}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {STAGES.map((s) => {
        const isActive = activeStage === s.value;
        const count = counts[s.value] || 0;
        return (
          <button
            key={s.value}
            onClick={() => onStageChange(isActive ? null : s.value)}
            className={`group/pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
              isActive
                ? "bg-primary text-primary-foreground border-primary hover:bg-destructive hover:border-destructive"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30 hover:bg-[#EAEAEA]"
            }`}
          >
            {s.label}
            <span
              className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold ${
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isActive ? (
                <>
                  <span className="group-hover/pill:hidden">{count}</span>
                  <X className="w-3 h-3 hidden group-hover/pill:block" />
                </>
              ) : (
                count
              )}
            </span>
          </button>
        );
      })}
      {activeStage !== null && (
        <button
          onClick={() => onStageChange(null)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-150 text-muted-foreground hover:text-foreground underline underline-offset-2 decoration-muted-foreground/40 hover:decoration-foreground/50"
        >
          Show all
        </button>
      )}
    </div>
  );
}
