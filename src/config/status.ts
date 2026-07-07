import { CredentialStatus } from "@/types/recruiting";
import {
  Circle,
  Loader2,
  Check,
  AlertTriangle,
  ShieldAlert,
  RefreshCw,
  Clock,
} from "lucide-react";

export interface StatusConfig {
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
    icon: Check,
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
  on_assignment: {
    label: "On Assignment",
    icon: RefreshCw,
    className: "text-status-completed",
    bgClassName: "bg-status-completed-bg",
    dotClassName: "bg-status-completed",
    borderClassName: "border-status-completed-border",
  },
  assignment_completed: {
    label: "Assignment Completed",
    icon: Check,
    className: "text-status-completed",
    bgClassName: "bg-status-completed-bg",
    dotClassName: "bg-status-completed",
    borderClassName: "border-status-completed-border",
  },
  awaiting_confirmation: {
    label: "Awaiting Confirmation",
    icon: Clock,
    className: "text-status-in-progress",
    bgClassName: "bg-status-in-progress-bg",
    dotClassName: "bg-status-in-progress",
    borderClassName: "border-status-in-progress-border",
  },
  confirmed: {
    label: "Confirmed",
    icon: Check,
    className: "text-status-completed",
    bgClassName: "bg-status-completed-bg",
    dotClassName: "bg-status-completed",
    borderClassName: "border-status-completed-border",
  },
};
