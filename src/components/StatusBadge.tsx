import { CredentialStatus } from "@/types/recruiting";
import {
  Circle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  bgClassName: string;
  dotClassName: string;
  borderClassName: string;
}

export const STATUS_CONFIG: Record<CredentialStatus, StatusConfig> = {
  incomplete: {
    label: "Incomplete",
    icon: Circle,
    className: "text-status-incomplete",
    bgClassName: "bg-status-incomplete-bg",
    dotClassName: "bg-status-incomplete",
    borderClassName: "border-status-incomplete-border",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    className: "text-status-in-progress",
    bgClassName: "bg-status-in-progress-bg",
    dotClassName: "bg-status-in-progress",
    borderClassName: "border-status-in-progress-border",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "text-status-completed",
    bgClassName: "bg-status-completed-bg",
    dotClassName: "bg-status-completed",
    borderClassName: "border-status-completed-border",
  },
  red_flag: {
    label: "Red Flag",
    icon: AlertTriangle,
    className: "text-status-red-flag",
    bgClassName: "bg-status-red-flag-bg",
    dotClassName: "bg-status-red-flag",
    borderClassName: "border-status-red-flag-border",
  },
  exception: {
    label: "Exception",
    icon: ShieldAlert,
    className: "text-status-exception",
    bgClassName: "bg-status-exception-bg",
    dotClassName: "bg-status-exception",
    borderClassName: "border-status-exception-border",
  },
};

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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap overflow-hidden border ${config.bgClassName} ${config.borderClassName} ${config.className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span className="truncate">{config.label}</span>
    </span>
  );
}
