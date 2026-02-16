import { ProviderStage, Provider } from "@/types/recruiting";

interface StageToggleProps {
  providers: Provider[];
  activeStage: ProviderStage | null;
  onStageChange: (stage: ProviderStage | null) => void;
}

const STAGES: { value: ProviderStage; label: string }[] = [
  { value: "presented", label: "Presented" },
  { value: "confirmed", label: "Confirmed" },
  { value: "credentialing", label: "Credentialing" },
  { value: "on_assignment", label: "On Assignment" },
];

export function StageToggle({ providers, activeStage, onStageChange }: StageToggleProps) {
  const counts = providers.reduce(
    (acc, p) => {
      acc[p.stage] = (acc[p.stage] || 0) + 1;
      return acc;
    },
    {} as Record<ProviderStage, number>
  );

  return (
    <div className="flex items-center gap-1">
      {activeStage !== null && (
        <button
          onClick={() => onStageChange(null)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30 hover:bg-[#EAEAEA]"
        >
          All Providers
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">
            {providers.length}
          </span>
        </button>
      )}
      {STAGES.map((s) => {
        const isActive = activeStage === s.value;
        const count = counts[s.value] || 0;
        return (
          <button
            key={s.value}
            onClick={() => onStageChange(isActive ? null : s.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
              isActive
                ? "bg-primary text-primary-foreground border-primary"
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
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
