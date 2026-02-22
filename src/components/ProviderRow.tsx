import { useState } from "react";
import { Provider, Credential, CredentialStatus } from "@/types/recruiting";
import { StatusBadge, STATUS_CONFIG } from "./StatusBadge";
import { CredentialModal } from "./CredentialModal";
import { ProviderExpandedDetail } from "./ProviderExpandedDetail";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

interface ProviderRowProps {
  provider: Provider;
  isExpanded: boolean;
  onToggle: () => void;
  onColumnHover?: (col: number | null) => void;
}

function CredentialSummary({ credentials }: { credentials: Credential[] }) {
  const counts = credentials.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    {} as Record<CredentialStatus, number>
  );

  const order: CredentialStatus[] = ["red_flag", "incomplete", "in_progress", "exception", "completed"];

  return (
    <div className="flex items-center gap-1">
      {order.map((status) => {
        const count = counts[status];
        if (!count) return null;
        const config = STATUS_CONFIG[status];
        return (
          <span
            key={status}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors duration-150 ${config.bgClassName} ${config.borderClassName} group-hover:border-current/30 ${config.className}`}
            title={`${count} ${config.label}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClassName}`} />
            {count}
          </span>
        );
      })}
    </div>
  );
}

const typeColorMap: Record<string, string> = {
  "full-time": "bg-[hsl(210_14%_93%)] text-[hsl(215_12%_35%)] border border-[hsl(210_14%_87%)] group-hover:border-[hsl(210_14%_80%)]",
  "part-time": "bg-[hsl(38_20%_93%)] text-[hsl(38_30%_32%)] border border-[hsl(38_18%_87%)] group-hover:border-[hsl(38_18%_80%)]",
  "locum": "bg-[hsl(262_15%_93%)] text-[hsl(262_18%_38%)] border border-[hsl(262_12%_87%)] group-hover:border-[hsl(262_12%_80%)]",
};

const STATUS_AVATAR_BG: Record<string, string> = {
  incomplete: "hsla(215,12%,65%,0.15)",
  in_progress: "hsla(210,60%,50%,0.14)",
  completed: "hsla(152,60%,40%,0.14)",
  red_flag: "hsla(0,72%,51%,0.12)",
  exception: "hsla(262,52%,50%,0.12)",
};
const STATUS_AVATAR_TEXT: Record<string, string> = {
  incomplete: "hsl(215,12%,45%)",
  in_progress: "hsl(210,60%,40%)",
  completed: "hsl(152,55%,32%)",
  red_flag: "hsl(0,65%,42%)",
  exception: "hsl(262,45%,42%)",
};

export function ProviderRow({ provider, isExpanded, onToggle, onColumnHover }: ProviderRowProps) {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);

  const currentExp = provider.experience.find((e) => !e.endYear);

  return (
    <>
      {/* Main row */}
      <tr
        onClick={onToggle}
        className={`group cursor-pointer border-b border-t border-t-transparent transition-colors duration-100 ${
          isExpanded
            ? "border-border bg-card"
            : "border-grid-border bg-background hover:border-y-foreground/25 hover:bg-grid-row-hover"
        }`}
      >
        <td className="pl-3 pr-1 md:px-4 py-3 w-8 sticky left-0 z-10 bg-inherit" onMouseEnter={() => onColumnHover?.(0)}>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-150" />
          )}
        </td>
        <td className="px-2 md:px-4 py-3 sticky left-[32px] md:left-[40px] z-10 bg-inherit" onMouseEnter={() => onColumnHover?.(1)}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary/70 group-hover:text-primary shrink-0 transition-[background-color,color] duration-200"
              style={{ '--avatar-hover-bg': STATUS_AVATAR_BG[provider.overallStatus] ?? STATUS_AVATAR_BG.incomplete, '--avatar-hover-text': STATUS_AVATAR_TEXT[provider.overallStatus] ?? STATUS_AVATAR_TEXT.incomplete } as React.CSSProperties}
            >
              {provider.firstName[0]}
              {provider.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className={`text-sm truncate transition-colors duration-150 tracking-[-0.01em] ${
                isExpanded ? "font-semibold text-foreground" : "font-normal text-foreground/80 group-hover:font-semibold group-hover:text-foreground"
              }`}>
                {provider.lastName}, {provider.firstName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{provider.specialty}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3" onMouseEnter={() => onColumnHover?.(2)}>
          <StatusBadge status={provider.overallStatus} />
        </td>
        <td className="px-4 py-3" onMouseEnter={() => onColumnHover?.(3)}>
          <CredentialSummary credentials={provider.credentials} />
        </td>
        <td className="px-4 py-3" onMouseEnter={() => onColumnHover?.(4)}>
          <div className="text-sm">
            <Badge variant="secondary" className={`text-xs font-normal capitalize transition-colors duration-150 ${typeColorMap[provider.availability.type] ?? ""}`}>
              {provider.availability.type.replace("-", " ")}
            </Badge>
          </div>
        </td>
        <td className="px-4 py-3" onMouseEnter={() => onColumnHover?.(5)}>
          <span className="text-sm text-muted-foreground group-hover:text-foreground/50 group-hover:[text-shadow:0_0_0.5px_currentColor] transition-all duration-150 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {provider.availability.startDate}
          </span>
        </td>
        <td className="px-4 py-3" onMouseEnter={() => onColumnHover?.(6)}>
          {currentExp && (
            <p className="text-sm text-muted-foreground group-hover:text-foreground/50 group-hover:[text-shadow:0_0_0.5px_currentColor] transition-all duration-150 truncate max-w-[200px]">
              {currentExp.organization}
            </p>
          )}
        </td>
      </tr>

      {/* Expanded detail */}
      <tr className={`bg-grid-row-expanded touch-pan-y ${isExpanded ? "border-b border-grid-border" : ""}`}>
        <td colSpan={7} className="p-0">
          <Collapsible open={isExpanded}>
            <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
              <div className="max-w-[100vw] overflow-hidden">
                <ProviderExpandedDetail
                  provider={provider}
                  onSelectCredential={setSelectedCredential}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </td>
      </tr>

      <CredentialModal
        credential={selectedCredential}
        open={!!selectedCredential}
        onOpenChange={(open) => !open && setSelectedCredential(null)}
      />
    </>
  );
}
