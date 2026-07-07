import React from "react";
import { mockProviders } from "@/data/mockData";
import { AlertTriangle, CheckCircle2, Clock, Check, ChevronRight } from "lucide-react";

// Get Sarah Chen
const sarah = mockProviders.find(p => p.id === "p1")!;
const credentials = sarah.credentials || [];
const total = credentials.length;

// Summarize her statuses
let completedCount = 0;
let inProgressCount = 0;
let blockedCount = 0;

credentials.forEach(cred => {
  if (cred.status === 'completed') completedCount++;
  else if (cred.status === 'red_flag' || cred.status === 'exception') blockedCount++;
  else inProgressCount++; // treating 'incomplete' and 'in_progress' both as just not-done but not-blocked
});

const isHealthy = blockedCount === 0;

// 1. Exception-First Banner
const ExceptionBannerMockup = () => (
  <div className="border border-border rounded-xl p-6 bg-card flex flex-col gap-4">
    <h3 className="font-semibold text-lg border-b pb-2">1. Exception-First Banner</h3>
    <div className="text-sm text-muted-foreground mb-2">
      If everything is fine, this is nearly invisible. If there's an error, it screams for attention.
    </div>
    
    <div className="border rounded-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium">Credentialing</span>
        <span className="text-sm text-muted-foreground">{completedCount} of {total} items cleared</span>
      </div>
      
      {/* The quiet progress line */}
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden mb-4">
        <div className="h-full bg-primary rounded-full" style={{ width: `${(completedCount/total)*100}%` }} />
      </div>

      {/* The loud exception banner */}
      {!isHealthy && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">{blockedCount} Action Required</span>
            <span className="opacity-90">Hospital Privileges – Boston Med is missing peer references.</span>
          </div>
          <button className="text-xs font-semibold uppercase tracking-wider flex items-center hover:underline opacity-90 mt-0.5">
            Review <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      )}
    </div>
  </div>
);

// 2. Health Meter Bar
const HealthMeterMockup = () => (
  <div className="border border-border rounded-xl p-6 bg-card flex flex-col gap-4">
    <h3 className="font-semibold text-lg border-b pb-2">2. Health Meter Bar</h3>
    <div className="text-sm text-muted-foreground mb-2">
      Shows the proportion of healthy vs. blocked items in a standard bar format.
    </div>
    
    <div className="border rounded-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Credentialing Health</span>
        {!isHealthy && <span className="text-xs font-medium text-destructive cursor-pointer hover:underline">{blockedCount} action required</span>}
      </div>
      
      <div className="flex h-2 w-full gap-0.5 rounded-full overflow-hidden">
        {/* Render proportional blocks */}
        {Array.from({length: total}).map((_, i) => {
          let bg = "bg-muted";
          if (i < completedCount) bg = "bg-green-500";
          else if (i < completedCount + inProgressCount) bg = "bg-primary/50";
          else bg = "bg-destructive";

          return <div key={i} className={`flex-1 ${bg}`} />
        })}
      </div>
      <div className="mt-2 text-xs text-muted-foreground flex gap-3">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> {completedCount} Cleared</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary/50" /> {inProgressCount} In Progress</span>
      </div>
    </div>
  </div>
);

// 3. Ring of Health
const RingOfHealthMockup = () => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const completedOffset = circumference - (completedCount / total) * circumference;
  const inProgressOffset = circumference - ((completedCount + inProgressCount) / total) * circumference;

  return (
    <div className="border border-border rounded-xl p-6 bg-card flex flex-col gap-4">
      <h3 className="font-semibold text-lg border-b pb-2">3. Ring of Health</h3>
      <div className="text-sm text-muted-foreground mb-2">
        A compact, elegant donut chart summarizing the overall status ratio.
      </div>
      
      <div className="border rounded-lg p-4 max-w-md flex items-center gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
            {/* Background Ring */}
            <circle cx="24" cy="24" r={radius} strokeWidth="4" stroke="hsl(var(--destructive))" fill="none" className="opacity-20" />
            
            {/* Blocked/Error Ring (Red) - Actually we just let background be red if there are errors, or we draw it explicitly */}
            {blockedCount > 0 && (
              <circle cx="24" cy="24" r={radius} strokeWidth="4" stroke="hsl(var(--destructive))" fill="none" />
            )}

            {/* In Progress Ring (Blue) */}
            {(inProgressCount > 0 || completedCount > 0) && (
              <circle 
                cx="24" cy="24" r={radius} strokeWidth="4" stroke="hsl(var(--primary))" fill="none" 
                strokeDasharray={circumference} strokeDashoffset={blockedCount > 0 ? circumference - ((total - blockedCount)/total)*circumference : 0} 
                className="transition-all"
              />
            )}

            {/* Completed Ring (Green) */}
            {completedCount > 0 && (
              <circle 
                cx="24" cy="24" r={radius} strokeWidth="4" stroke="#22c55e" fill="none" 
                strokeDasharray={circumference} strokeDashoffset={completedOffset} 
                className="transition-all"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {blockedCount > 0 ? (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            ) : completedCount === total ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Clock className="w-5 h-5 text-primary" />
            )}
          </div>
        </div>

        <div>
          <div className="font-medium mb-0.5">Credentialing</div>
          {blockedCount > 0 ? (
            <div className="text-xs text-destructive font-medium hover:underline cursor-pointer">
              Attention needed ({blockedCount} item blocked)
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              On track ({completedCount} of {total} cleared)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 4. Status Counters / Pills
const StatusCountersMockup = () => (
  <div className="border border-border rounded-xl p-6 bg-card flex flex-col gap-4">
    <h3 className="font-semibold text-lg border-b pb-2">4. Status Counters / Pills</h3>
    <div className="text-sm text-muted-foreground mb-2">
      No graphs. Just actionable numbers in pill format.
    </div>
    
    <div className="border rounded-lg p-4 max-w-md">
      <div className="font-medium mb-3">Credentialing Status</div>
      <div className="flex items-center gap-2 flex-wrap">
        {completedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completedCount} Cleared
          </div>
        )}
        {inProgressCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            {inProgressCount} In Progress
          </div>
        )}
        {blockedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-xs font-medium cursor-pointer hover:bg-destructive/20 transition-colors">
            <AlertTriangle className="w-3.5 h-3.5" />
            {blockedCount} Action Required
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function Sandbox() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Credentialing UI Sandbox</h1>
          <p className="text-muted-foreground">
            Comparing high-level summary approaches using data for <strong>Sarah Chen</strong> ({total} total credentials, {blockedCount} blocked).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ExceptionBannerMockup />
          <HealthMeterMockup />
          <RingOfHealthMockup />
          <StatusCountersMockup />
        </div>
      </div>
    </div>
  );
}
