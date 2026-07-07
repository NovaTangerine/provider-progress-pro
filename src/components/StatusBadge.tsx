import { CredentialStatus } from "@/types/recruiting";
import { STATUS_CONFIG } from "@/config/status";

interface StatusBadgeProps {
  status: CredentialStatus;
  compact?: boolean;
}

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full border ${config.bgClassName} ${config.borderClassName}`}
        title={config.label}
      >
        <Icon className={`w-3.5 h-3.5 ${config.className}`} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded text-xs font-medium whitespace-nowrap overflow-hidden border ${config.bgClassName} ${config.borderClassName} ${config.className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span className="truncate">{config.label}</span>
    </span>
  );
}
