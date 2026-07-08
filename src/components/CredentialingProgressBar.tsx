import { Provider } from "@/types/recruiting";
import { Check, Clock, AlertTriangle, CircleDashed } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CredentialingProgressBarProps {
  provider: Provider;
  dimProgress?: boolean;
}

export function CredentialingProgressBar({ provider, dimProgress }: CredentialingProgressBarProps) {
  const credentials = provider.credentials || [];
  const total = credentials.length;
  
  if (total === 0) {
    return null;
  }

  let completedCount = 0;
  let inProgressCount = 0;
  let blockedCount = 0;
  let incompleteCount = 0;
  let score = 0;
  let hasError = false;

  credentials.forEach(cred => {
    if (cred.status === 'completed') {
      completedCount++;
      score += 100;
    }
    else if (cred.status === 'red_flag' || cred.status === 'exception') {
      blockedCount++;
      score += 50;
      hasError = true;
    }
    else if (cred.status === 'in_progress') {
      inProgressCount++;
      score += 50;
    }
    else {
      incompleteCount++;
    }
  });

  const progressPercent = Math.round(score / total);

  return (
    <div className={`space-y-3 pt-1 pb-1 transition-all ${dimProgress ? 'opacity-30 saturate-50' : 'opacity-100'}`}>
      {/* Overall Progress Bar */}
      <Progress 
        value={progressPercent} 
        className="h-1.5" 
        indicatorClassName={hasError ? "bg-destructive" : progressPercent === 100 ? "bg-[hsl(152,60%,40%)]" : "bg-blue-500"} 
      />

      {/* Status Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {completedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-full text-[11px] font-medium">
            <Check className="w-3.5 h-3.5" />
            {completedCount} Cleared
          </div>
        )}
        {inProgressCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-full text-[11px] font-medium">
            <Clock className="w-3.5 h-3.5" />
            {inProgressCount} In Progress
          </div>
        )}
        {blockedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-[11px] font-medium cursor-pointer hover:bg-destructive/20 transition-colors">
            <AlertTriangle className="w-3.5 h-3.5" />
            {blockedCount} Action Required
          </div>
        )}
        {incompleteCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary text-secondary-foreground border border-border rounded-full text-[11px] font-medium">
            <CircleDashed className="w-3.5 h-3.5 opacity-70" />
            {incompleteCount} Not Started
          </div>
        )}
      </div>
    </div>
  );
}
