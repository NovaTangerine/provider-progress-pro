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
  const credentials = provider.credentials || [];
  const total = credentials.length;
  
  let score = 0;
  let hasError = false;
  let primaryErrorStatus: "red_flag" | "exception" | null = null;
  
  credentials.forEach(cred => {
    if (cred.status === 'completed') score += 100;
    else if (cred.status === 'in_progress') score += 50;
    else if (cred.status === 'red_flag' || cred.status === 'exception') {
      score += 50;
      hasError = true;
      if (!primaryErrorStatus) primaryErrorStatus = cred.status;
    }
  });

  const progressPercent = total === 0 ? 0 : Math.round(score / total);
  
  let activeStep = 0; // Not Started
  if (progressPercent === 100) activeStep = 3;
  else if (progressPercent >= 34) activeStep = 2;
  else if (progressPercent > 0) activeStep = 1;

  const isError = hasError;
  const errorConfig = isError && primaryErrorStatus ? STATUS_CONFIG[primaryErrorStatus] : null;

  let label = STAGES[activeStep];
  if (isError) {
    label = "Action Required";
  }

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
          {label}
        </span>
      </div>
    </div>
  );
}
