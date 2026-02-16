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

interface ProviderRowProps {
  provider: Provider;
  isExpanded: boolean;
  onToggle: () => void;
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
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${config.bgClassName} ${config.className}`}
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

export function ProviderRow({ provider, isExpanded, onToggle }: ProviderRowProps) {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);

  const currentExp = provider.experience.find((e) => !e.endYear);

  return (
    <>
      {/* Main row */}
      <tr
        onClick={onToggle}
        className={`group cursor-pointer border-b border-grid-border transition-colors duration-100 ${
          isExpanded ? "bg-grid-row-expanded" : "hover:bg-grid-row-hover"
        }`}
      >
        <td className="px-4 py-3 w-8">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
              {provider.firstName[0]}
              {provider.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className={`text-sm truncate transition-colors duration-150 ${
                isExpanded ? "font-semibold text-foreground" : "font-normal text-foreground/70 group-hover:font-semibold group-hover:text-foreground"
              }`}>
                {provider.lastName}, {provider.firstName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{provider.specialty}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={provider.overallStatus} />
        </td>
        <td className="px-4 py-3">
          <CredentialSummary credentials={provider.credentials} />
        </td>
        <td className="px-4 py-3">
          <div className="text-sm">
            <Badge variant="outline" className="text-xs font-normal capitalize">
              {provider.availability.type.replace("-", " ")}
            </Badge>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {provider.availability.startDate}
          </span>
        </td>
        <td className="px-4 py-3">
          {currentExp && (
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {currentExp.organization}
            </p>
          )}
        </td>
      </tr>

      {/* Expanded detail */}
      {isExpanded && (
        <tr className="bg-grid-row-expanded border-b border-grid-border">
          <td colSpan={7} className="p-0">
            <ProviderExpandedDetail
              provider={provider}
              onSelectCredential={setSelectedCredential}
            />
          </td>
        </tr>
      )}

      <CredentialModal
        credential={selectedCredential}
        open={!!selectedCredential}
        onOpenChange={(open) => !open && setSelectedCredential(null)}
      />
    </>
  );
}
