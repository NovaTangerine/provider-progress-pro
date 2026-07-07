import { Provider } from "@/types/recruiting";
import { Check, AlertCircle, AlertTriangle } from "lucide-react";
import { STATUS_CONFIG } from "./StatusBadge";

interface CredentialingProgressBarProps {
  provider: Provider;
  dimProgress?: boolean;
}

const STAGES = [
  "Not Started",
  "App Sent to Provider",
  "Submitted for Review",
  "Completed",
];

export function CredentialingProgressBar({ provider, dimProgress }: CredentialingProgressBarProps) {
  // Derive the active step from the overall status
  let activeStep = 1; // 0-indexed, so 1 = "App Sent"
  const status = provider.overallStatus;
  
  if (status === "completed") {
    activeStep = 3;
  } else if (status === "in_progress") {
    activeStep = 2;
  } else if (status === "incomplete") {
    activeStep = 1;
  } else if (status === "exception" || status === "red_flag") {
    // If it's blocked, we'll assume it's in the review stage or app sent stage.
    // We'll just put it at step 2 (Under Review) for visual purposes.
    activeStep = 2;
  }

  const isError = status === "exception" || status === "red_flag";
  const errorConfig = isError ? STATUS_CONFIG[status] : null;

  return (
    <div className="space-y-2">
      <div className="flex h-2 w-full gap-[2px]">
        <div className={`flex-1 rounded-l-full transition-all ${activeStep >= 1 ? (isError ? errorConfig?.dotClassName : 'bg-primary') : 'bg-muted'} ${dimProgress ? 'opacity-30 saturate-50 duration-75' : 'opacity-100 saturate-100 duration-300'}`} />
        <div className={`flex-1 transition-all ${activeStep >= 2 ? (isError ? errorConfig?.dotClassName : 'bg-primary') : 'bg-muted'} ${dimProgress ? 'opacity-30 saturate-50 duration-75' : 'opacity-100 saturate-100 duration-300'}`} />
        <div className={`flex-1 rounded-r-full transition-all ${activeStep >= 3 ? (isError ? errorConfig?.dotClassName : 'bg-primary') : 'bg-muted'} ${dimProgress ? 'opacity-30 saturate-50 duration-75' : 'opacity-100 saturate-100 duration-300'}`} />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className={`w-2 h-2 rounded-full transition-all ${isError ? errorConfig?.dotClassName : 'bg-primary'} ${dimProgress ? 'opacity-30 saturate-50 duration-75' : 'opacity-100 saturate-100 duration-300'}`} />
          {STAGES[activeStep]}
        </span>
      </div>
    </div>
  );
}
