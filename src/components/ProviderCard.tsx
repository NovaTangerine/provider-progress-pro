import { useState, useRef, useEffect, useCallback } from "react";
import { Provider, Credential, CredentialStatus } from "@/types/recruiting";
import { ShiftPreferenceIcons } from "./ShiftPreferenceIcons";
import { StatusBadge, STATUS_CONFIG } from "./StatusBadge";
import { CredentialModal } from "./CredentialModal";
import { CredentialingProgressBar } from "./CredentialingProgressBar";
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Syringe,
  Building2,
  ShieldCheck,
  Award,
  Languages,
  FlaskConical,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Check,
  X,
  Info
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DayOfWeekBar } from "./DayOfWeekBar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

interface ProviderCardProps {
  provider: Provider;
  highlightsExpanded: boolean;
  onHighlightsToggle: () => void;
  availabilityExpanded: boolean;
  onAvailabilityToggle: () => void;
  constrainHeight?: boolean;
  focusModeActive?: boolean;
  isFocused?: boolean;
  anyCardFocused?: boolean;
  onFocus?: (id: string) => void;
  onExitFocus?: () => void;
}

function MarqueeText({ children, className }: {children: string;className?: string;}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [distance, setDistance] = useState(0);

  const measure = useCallback(() => {
    if (containerRef.current && textRef.current) {
      const overflow = textRef.current.scrollWidth - containerRef.current.clientWidth;
      setIsOverflowing(overflow > 2);
      setDistance(overflow > 2 ? overflow : 0);
    }
  }, []);

  useEffect(() => {measure();}, [measure, children]);

  return (
    <div ref={containerRef} className={`min-w-0 overflow-hidden whitespace-nowrap ${className ?? ""}`}>
      <span
        ref={textRef}
        className={`inline-block ${isOverflowing ? "hover:animate-marquee" : ""}`}
        style={isOverflowing ? { "--marquee-distance": `-${distance}px` } as React.CSSProperties : undefined}>

        {children}
      </span>
    </div>);

}

function getLastUpdate(credential: Credential): {label: string;date?: string;} | null {
  const steps = credential.workflow?.steps;
  if (!steps) return null;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].status === "completed" || steps[i].status === "in_progress" || steps[i].status === "blocked") {
      return { label: steps[i].label, date: steps[i].completedDate || steps[i].estimatedDate };
    }
  }
  return null;
}

function getNextStep(credential: Credential): string | null {
  const steps = credential.workflow?.steps;
  if (!steps) return null;
  const next = steps.find((s) => s.status === "pending" || s.status === "in_progress" || s.status === "blocked");
  return next?.label ?? null;
}

function CredentialPill({ credential, onClick }: {credential: Credential;onClick: (c: Credential) => void;}) {
  const config = STATUS_CONFIG[credential.status];
  const workflow = credential.workflow;
  const completedSteps = workflow?.steps.filter((s) => s.status === "completed").length ?? 0;
  const totalSteps = workflow?.steps.length ?? 0;
  const lastUpdate = getLastUpdate(credential);
  const nextStep = getNextStep(credential);

  const pill =
  <button
    onClick={() => onClick(credential)}
    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 cursor-pointer ${config.bgClassName} ${config.className} border-transparent hover:border-current/20 hover:shadow-sm hover:scale-[1.04] hover:brightness-[0.97] active:scale-100`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${workflow ? config.dotClassName : `border-[1.5px] ${config.dotClassName.replace('bg-', 'border-')}`}`} />
      <span className="truncate max-w-[140px]">{credential.name}</span>
    </button>;


  if (!workflow) {
    return pill;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{pill}</HoverCardTrigger>
      <HoverCardContent side="top" align="center" className="w-72 pt-5 px-6 pb-6 space-y-4 text-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-foreground truncate text-base leading-relaxed">{credential.name}</p>
          <StatusBadge status={credential.status} compact />
        </div>

        {lastUpdate &&
        <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-[#909cad] font-medium">Last Update</p>
            <div className="flex items-baseline gap-1.5 min-w-0">
              {lastUpdate.date &&
            <span className="text-muted-foreground text-xs shrink-0">{new Date(lastUpdate.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            }
              {lastUpdate.date && <span className="text-muted-foreground/50 shrink-0">·</span>}
              <MarqueeText className="text-foreground/80 leading-relaxed">{lastUpdate.label}</MarqueeText>
            </div>
          </div>
        }

        {nextStep &&
        <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-[#909cad] font-medium">Next Step</p>
            <p className="text-foreground/80 leading-relaxed">{nextStep}</p>
          </div>
        }

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-[#909cad] font-medium">Progress</p>
            <p className="text-muted-foreground">{completedSteps}/{totalSteps} steps</p>
          </div>
          <Progress value={totalSteps > 0 ? completedSteps / totalSteps * 100 : 0} className="h-1.5" indicatorClassName={config.dotClassName} />
        </div>
      </HoverCardContent>
    </HoverCard>);

}

function StatusLegendBar({ credentials, dimProgress }: {credentials: Credential[]; dimProgress?: boolean;}) {
  const total = credentials.length;
  const counts = credentials.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    {} as Record<CredentialStatus, number>
  );

  const order: CredentialStatus[] = ["completed", "in_progress", "incomplete", "exception", "red_flag"];

  return (
    <div className="space-y-2">
      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
        {order.map((status) => {
          const count = counts[status];
          if (!count) return null;
          const config = STATUS_CONFIG[status];
          return (
            <div
              key={status}
              className={`transition-all ${config.dotClassName} ${dimProgress ? 'opacity-30 saturate-50 duration-75' : 'opacity-100 saturate-100 duration-300'}`}
              style={{ width: `${count / total * 100}%` }}
              title={`${config.label}: ${count}/${total}`} />);

        })}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {order.map((status) => {
          const count = counts[status];
          if (!count) return null;
          const config = STATUS_CONFIG[status];
          return (
            <span key={status} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className={`w-2 h-2 rounded-full transition-all ${config.dotClassName} ${dimProgress ? 'opacity-30 saturate-50 duration-75' : 'opacity-100 saturate-100 duration-300'}`} />
              {config.label} ({count})
            </span>);

        })}
      </div>
    </div>);

}

const HIGHLIGHT_ICONS: Record<string, React.ComponentType<{className?: string;}>> = {
  procedure: Syringe,
  site: Building2,
  credential: ShieldCheck,
  award: Award,
  language: Languages,
  research: FlaskConical
};

function HighlightItem({ text, icon }: {text: string;icon?: string;}) {
  const Icon = icon ? HIGHLIGHT_ICONS[icon] ?? Sparkles : Sparkles;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="w-3.5 h-3.5 text-primary/70 shrink-0 mt-0.5" />
      <span className="text-foreground/70">{text}</span>
    </div>);

}

function formatDateRange(startDate: string, endDate?: string) {
  const start = new Date(startDate + "T00:00:00");
  const yearClass = "text-[#999] provider-dim-year";
  if (!endDate) {
    return <>Starting<span className="inline-block">&nbsp;{start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}<span className={yearClass}>, {start.getFullYear()}</span></span></>;
  }
  const end = new Date(endDate + "T00:00:00");
  const sameYear = start.getFullYear() === end.getFullYear();
  const startFmt = start.toLocaleDateString("en-US", { month: "short", day: "numeric", ...(!sameYear && { year: "numeric" }) });
  const endFmt = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return <><span className="inline-block">{startFmt} – {endFmt}<span className={yearClass}>, {end.getFullYear()}</span></span></>;
}

function formatSingleDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  const yearClass = "text-[#999] provider-dim-year";
  return <span className="inline-block">{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}<span className={yearClass}>, {date.getFullYear()}</span></span>;
}

function getClearanceOutlook(provider: Provider) {
  if (provider.overallStatus === "completed" && provider.stage !== "confirmed") {
    return { 
      message: "This provider has cleared all credentialing requirements and is ready to start.", 
      window: "Ready",
      color: "text-emerald-500", 
      bg: "bg-emerald-50/50 border-emerald-100/50", 
      icon: CheckCircle2 
    };
  }

  // Parse dates
  const submittedDateStr = provider.submittedDate || "2026-01-01"; // Fallback if missing
  const submitted = new Date(submittedDateStr + "T00:00:00");
  const target = new Date(provider.availability.startDate + "T00:00:00");
  
  // Diff in days
  const diffTime = target.getTime() - submitted.getTime();
  const daysAvailable = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Baseline
  let requiredMinimum = 60;
  let maxDays = 90;
  let windowText = "60–90 Days";
  
  if (provider.overallStatus === "red_flag") {
    requiredMinimum = 120;
    maxDays = 180;
    windowText = "4–6 Months";
  } else if (provider.overallStatus === "exception") {
    requiredMinimum = 90;
    maxDays = 120;
    windowText = "90–120 Days";
  }

  const completionDate = new Date(submitted.getTime() + maxDays * 24 * 60 * 60 * 1000);
  const estimatedDateFmt = completionDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (daysAvailable >= requiredMinimum) {
    return { 
      message: "Credentialing is on track. This provider is expected to be cleared before the target start date.", 
      window: windowText, 
      estimatedDate: estimatedDateFmt, 
      color: "text-emerald-500", 
      bg: "bg-emerald-50/50 border-emerald-100/50", 
      icon: CheckCircle2 
    };
  } else if (daysAvailable >= requiredMinimum - 30) {
    return { 
      message: "The current timeline is tight. This provider is at risk of not being credentialed before the start date.", 
      window: windowText, 
      estimatedDate: estimatedDateFmt, 
      color: "text-amber-500", 
      bg: "bg-amber-50 border-amber-200/50", 
      icon: AlertTriangle 
    };
  } else {
    return { 
      message: "Based on current progress, this provider may not be credentialed before the target start date.", 
      window: windowText, 
      estimatedDate: estimatedDateFmt, 
      color: "text-red-500", 
      bg: "bg-red-50 border-red-200/50", 
      icon: AlertCircle 
    };
  }
}

function BinaryCredentialPill({ credential }: {credential: Credential}) {
  const isCompleted = credential.status === "completed";
  
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border mix-blend-multiply ${isCompleted ? 'bg-[hsl(152,60%,40%,0.08)] text-[hsl(152,55%,32%)] border-[hsl(152,60%,40%,0.15)]' : 'bg-muted/50 text-muted-foreground border-foreground/[0.06]'}`}>
      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 opacity-50" />}
      <span className="truncate max-w-[140px]">{credential.name}</span>
    </div>
  );
}

export function ProviderCard({ provider, highlightsExpanded, onHighlightsToggle, availabilityExpanded, onAvailabilityToggle, constrainHeight, focusModeActive, isFocused, anyCardFocused, onFocus, onExitFocus }: ProviderCardProps) {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [showCredentialPills, setShowCredentialPills] = useState(false);
  const [showMonthSchedule, setShowMonthSchedule] = useState(false);
  const highlights = provider.highlights ?? [];
  const visibleHighlights = highlightsExpanded ? highlights : highlights.slice(0, 3);
  const hasMore = highlights.length > 3;

  const isExpanded = availabilityExpanded || highlightsExpanded;
  const useSubgrid = !constrainHeight;

  const [hasFadedHover, setHasFadedHover] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setHasFadedHover(false);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHasFadedHover(true);
    }, 1250);
  };

  const handleMouseLeave = () => {
    setHasFadedHover(false);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const STATUS_GRADIENT: Record<string, string> = {
    incomplete: "hsla(215,12%,65%,0.07)",
    in_progress: "hsla(210,60%,50%,0.08)",
    completed: "hsla(152,60%,40%,0.08)",
    red_flag: "hsla(0,72%,51%,0.07)",
    exception: "hsla(262,52%,50%,0.07)",
    on_assignment: "hsla(152,60%,40%,0.08)",
    assignment_completed: "hsla(152,60%,40%,0.08)",
  };
  const STATUS_AVATAR_BG: Record<string, string> = {
    incomplete: "hsla(215,12%,65%,0.15)",
    in_progress: "hsla(210,60%,50%,0.14)",
    completed: "hsla(152,60%,40%,0.14)",
    red_flag: "hsla(0,72%,51%,0.12)",
    exception: "hsla(262,52%,50%,0.12)",
    on_assignment: "hsla(152,60%,40%,0.14)",
    assignment_completed: "hsla(152,60%,40%,0.14)",
  };
  const STATUS_AVATAR_TEXT: Record<string, string> = {
    incomplete: "hsl(215,12%,45%)",
    in_progress: "hsl(210,60%,40%)",
    completed: "hsl(152,55%,32%)",
    red_flag: "hsl(0,65%,42%)",
    exception: "hsl(262,45%,42%)",
    on_assignment: "hsl(152,55%,32%)",
    assignment_completed: "hsl(152,55%,32%)",
  };
  const STATUS_BORDER_HOVER: Record<string, string> = {
    incomplete: "hsla(215,12%,45%,0.35)",
    in_progress: "hsla(210,60%,40%,0.35)",
    completed: "hsla(152,55%,32%,0.35)",
    red_flag: "hsla(0,65%,42%,0.35)",
    exception: "hsla(262,45%,42%,0.35)",
    on_assignment: "hsla(152,55%,32%,0.35)",
    assignment_completed: "hsla(152,55%,32%,0.35)",
  };
  const STATUS_OUTLINE: Record<string, string> = {
    incomplete: "hsla(215,12%,45%,0.15)",
    in_progress: "hsla(210,60%,40%,0.15)",
    completed: "hsla(152,55%,32%,0.15)",
    red_flag: "hsla(0,65%,42%,0.15)",
    exception: "hsla(262,45%,42%,0.15)",
    on_assignment: "hsla(152,55%,32%,0.15)",
    assignment_completed: "hsla(152,55%,32%,0.15)",
  };
  const STATUS_SHADOW: Record<string, string> = {
    incomplete: "hsla(215,12%,45%,0.12)",
    in_progress: "hsla(210,60%,40%,0.12)",
    completed: "hsla(152,55%,32%,0.12)",
    red_flag: "hsla(0,65%,42%,0.12)",
    exception: "hsla(262,45%,42%,0.12)",
    on_assignment: "hsla(152,55%,32%,0.12)",
    assignment_completed: "hsla(152,55%,32%,0.12)",
  };
  const gradientColor = provider.stage === "presented" ? "hsla(215,12%,50%,0.1)" : (STATUS_GRADIENT[provider.overallStatus] ?? STATUS_GRADIENT.incomplete);
  const avatarBg = STATUS_AVATAR_BG[provider.overallStatus] ?? STATUS_AVATAR_BG.incomplete;
  const avatarText = STATUS_AVATAR_TEXT[provider.overallStatus] ?? STATUS_AVATAR_TEXT.incomplete;
  const hoverBorder = hasFadedHover ? STATUS_BORDER_HOVER.incomplete : (STATUS_BORDER_HOVER[provider.overallStatus] ?? STATUS_BORDER_HOVER.incomplete);
  const hoverOutline = hasFadedHover ? STATUS_OUTLINE.incomplete : (STATUS_OUTLINE[provider.overallStatus] ?? STATUS_OUTLINE.incomplete);
  const hoverShadow = hasFadedHover ? STATUS_SHADOW.incomplete : (STATUS_SHADOW[provider.overallStatus] ?? STATUS_SHADOW.incomplete);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.ctrlKey || e.metaKey) && onFocus) {
      e.preventDefault();
      e.stopPropagation();
      onFocus(provider.id);
    } else if (focusModeActive && !isFocused && onFocus) {
      onFocus(provider.id);
    }
  };

  return (
    <>
      <div id={`provider-card-${provider.id}`} className={`${useSubgrid ? 'grid grid-rows-subgrid row-span-4 pb-6' : 'self-start'} gap-0`} onClick={focusModeActive && !isFocused ? handleCardClick : undefined}>
      <div
        style={{ '--hover-border': hoverBorder, '--hover-outline': hoverOutline, '--hover-shadow': hoverShadow } as React.CSSProperties}
        onClick={focusModeActive && !isFocused ? undefined : handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      className={`group/card ${isFocused ? 'group/card--focused' : ''} rounded-lg border border-transparent bg-card shadow-sm ${anyCardFocused && !isFocused ? 'pointer-events-none' : 'hover:shadow-[0_4px_20px_-1px_var(--hover-shadow),0_2px_10px_-2px_var(--hover-shadow)] hover:border-[var(--hover-border)] outline outline-0 hover:outline-[2px] outline-[var(--hover-outline)] -outline-offset-1'} transition-[box-shadow,border-color,outline-width] duration-500 ${isFocused ? 'relative z-[60] ring-2 ring-[var(--hover-border)]' : 'relative'}`}>
        {/* Gradient Border Overlay */}
        <div className={`absolute -inset-[1px] rounded-lg pointer-events-none transition-opacity duration-200 ${isFocused ? 'opacity-0' : 'group-hover/card:opacity-0'} z-10`} 
             style={{
               padding: '1px',
               background: 'linear-gradient(to bottom, hsl(var(--border)) 45%, hsl(var(--border) / 0.55))',
               WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               WebkitMaskComposite: 'xor',
               maskComposite: 'exclude',
             }} 
        />
        {/* Header */}
        <div className={`relative rounded-t-[7px] pl-5 pr-7 py-4 border-b border-border bg-muted/30 ${anyCardFocused && !isFocused ? '' : 'group-hover/card:border-foreground/20'} flex items-center justify-between gap-4 transition-[background-color,border-color] duration-200 ${anyCardFocused && !isFocused ? '' : 'group-hover/card:bg-muted/50'} ${isFocused ? 'bg-muted/50 border-foreground/20' : ''} z-20`}>
          <div
            className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${isFocused ? 'opacity-100' : anyCardFocused ? 'opacity-0' : 'opacity-0 group-hover/card:opacity-100'}`}
            style={{ backgroundImage: `linear-gradient(135deg, transparent 40%, ${gradientColor})` }}
          />
          <div className="flex items-center gap-3 relative">
            <div
              className="w-11 h-11 rounded-full bg-primary/10 shadow-[0_0_0_0.5px_hsl(var(--primary)/0.4)] transition-[background-color,color] duration-200 flex items-center justify-center text-sm font-bold text-primary shrink-0"
              style={{ '--avatar-hover-bg': avatarBg, '--avatar-hover-text': avatarText } as React.CSSProperties}
            >
              {provider.firstName[0]}
              {provider.lastName[0]}
            </div>
            <div>
              <p className="text-base font-medium text-foreground transition-colors duration-200 provider-dim-name tracking-[-0.01em]">
                {provider.firstName} {provider.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{provider.specialty}</p>
            </div>
          </div>
          <div className="relative z-30">
            {provider.stage === "presented" && provider.firstName === "Kimberly" && provider.lastName === "Pine" ? (
              <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-8 h-8 rounded-full bg-[hsl(152,55%,32%,0.1)] hover:bg-[hsl(152,55%,32%,0.18)] border border-[hsl(152,55%,32%,0.2)] text-[hsl(152,55%,32%)] flex items-center justify-center transition-colors mix-blend-multiply">
                        <Check className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="text-xs font-medium">
                      Request confirmation
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-8 h-8 rounded-full bg-[hsl(346,85%,55%,0.1)] hover:bg-[hsl(346,85%,55%,0.18)] border border-[hsl(346,85%,55%,0.2)] text-[hsl(346,85%,55%)] flex items-center justify-center transition-colors mix-blend-multiply">
                        <X className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="text-xs font-medium">
                      Reject provider
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <StatusBadge status={provider.overallStatus} />
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div className="px-7 space-y-1 pt-[28px] pb-[20px]">
          <h4 className="text-[10px] uppercase tracking-widest font-medium text-[#909cad]">
            {provider.stage === "credentialing" || provider.stage === "confirmed" ? "Target Start Date" : provider.stage === "credentialing_complete" ? "Start Date" : provider.stage === "on_assignment" ? "Next Shift" : "Availability"}
          </h4>
          <div className="space-y-2">
            <div
              onClick={onAvailabilityToggle}
              className="group/avail flex items-center gap-3 text-sm cursor-pointer rounded-md pl-1 py-1.5 transition-colors duration-200 hover:bg-[hsl(0,0%,97%)]">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-colors duration-200 group-hover/card:text-[hsl(346,85%,55%)]" />
              <span className="text-lg tracking-tight text-[#333333] transition-[color] duration-200 font-medium provider-dim-date">
                {provider.stage === "credentialing" || provider.stage === "credentialing_complete" || provider.stage === "confirmed"
                  ? formatSingleDate(provider.availability.startDate) 
                  : provider.stage === "on_assignment"
                  ? <>{formatSingleDate(provider.availability.startDate)}<span className="text-muted-foreground ml-2 font-normal tracking-normal text-[14px]">0700 - 1900</span></>
                  : formatDateRange(provider.availability.startDate, provider.availability.endDate)}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs text-primary/80 underline underline-offset-2 transition-colors group-hover/avail:text-primary">
                {availabilityExpanded ? "Hide details" : "View details"}
              </span>
            </div>
            

            
            {(provider.stage === "credentialing" || provider.stage === "credentialing_complete") && (() => {
              if (provider.stage === "credentialing") {
                const outlook = getClearanceOutlook(provider);
                return (
                  <div className={`mt-2 flex items-start gap-2.5 p-3 rounded-md border ${outlook.bg} text-[12.5px] text-muted-foreground leading-snug transition-all`}>
                    <outlook.icon className={`w-4 h-4 shrink-0 mt-0.5 ${outlook.color}`} />
                    <p>
                      {outlook.message}
                    </p>
                  </div>
                );
              } else {
                const target = new Date(provider.availability.startDate + "T00:00:00");
                const today = new Date("2026-07-06T00:00:00");
                const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                if (diffDays > 14) return null;

                return (
                  <div className="mt-2 flex items-start gap-2.5 p-3 rounded-md bg-blue-50/50 border border-blue-100/50 text-[12.5px] text-muted-foreground leading-snug transition-all">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                    <p>
                      <span className="font-semibold text-foreground tracking-tight">Assignment begins in {diffDays} days.</span> Make sure your provider knows their primary contact and completes their day-one checklist.
                    </p>
                  </div>
                );
              }
            })()}

            <Collapsible open={availabilityExpanded}>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <div className="rounded-md bg-[hsl(0,0%,97.5%)] border-[1.5px] border-[hsl(0,0%,93.5%)] p-6 space-y-4 mt-1 shadow-[0_6px_12px_-6px_hsla(0,0%,0%,0.06)]">

                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    {provider.stage === "on_assignment" && provider.availability.endDate && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Assignment Ends</p>
                        <p className="text-sm text-foreground/80 mt-0.5">{formatSingleDate(provider.availability.endDate)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Coverage</p>
                      <p className="text-sm text-foreground/80 capitalize mt-0.5">{provider.availability.type.replace("-", " ")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Relocation</p>
                      <p className="text-sm text-foreground/80 mt-0.5">{provider.availability.willingToRelocate ? "Yes" : "No"}</p>
                    </div>
                    {provider.availability.scheduleNotes?.map((note, i) =>
                    <div key={i} className="col-span-2">
                        <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Schedule Note</p>
                        <p className="text-sm text-foreground/80 mt-0.5">{note.label}</p>
                      </div>
                    )}
                  </div>
                  
                  {provider.stage !== "on_assignment" && (
                    <>
                      <div className="border-t border-dashed border-foreground/[0.06] my-4" />
                      <div className="space-y-2.5">
                        <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Scheduling Preferences</p>
                        {provider.availability.availableDays &&
                        <DayOfWeekBar days={provider.availability.availableDays} />
                        }
                        {provider.availability.shiftPreferences && provider.availability.shiftPreferences.length > 0 &&
                        <ShiftPreferenceIcons preferences={provider.availability.shiftPreferences} />
                        }
                      </div>
                    </>
                  )}
                </div>
                <div className="h-[20px]" />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Provider Highlights */}
        {provider.stage !== "credentialing" && provider.stage !== "credentialing_complete" && provider.stage !== "confirmed" && (
          <div className={`px-7 ${highlights.length > 0 ? 'border-t border-dashed border-border/[0.72] relative' : ''} pt-[24px] pb-[16px]`}>
            {highlights.length > 0 ?
            <>
                <h4 className="text-[10px] uppercase tracking-widest font-medium text-[#909cad] bg-card px-3 absolute -top-[8px] left-4">
                  {provider.stage === "on_assignment" ? "Assignment Details" : "Provider Highlights"}
                </h4>
                <div
                onClick={hasMore ? onHighlightsToggle : undefined}
                className={`rounded-md bg-[hsl(0,0%,97.5%)] border-[1.5px] border-[hsl(0,0%,93.5%)] group-hover/card:bg-[hsl(230,12%,97.5%)] group-hover/card:border-[hsl(230,12%,93.5%)] px-3 pt-5 pb-3 space-y-2 transition-[background-color,border-color] duration-[480ms] shadow-[0_6px_12px_-6px_hsla(0,0%,0%,0.06)] ${hasMore ? "cursor-pointer hover:!bg-[hsl(230,12%,96%)] hover:!border-[hsl(230,12%,91%)]" : ""}`}>
  
                  {highlights.slice(0, 3).map((h, i) =>
                <HighlightItem key={i} text={h.text} icon={h.icon} />
                )}
                  {hasMore &&
                <Collapsible open={highlightsExpanded}>
                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                        <div className="space-y-2 pt-1">
                          {highlights.slice(3).map((h, i) =>
                      <HighlightItem key={i + 3} text={h.text} icon={h.icon} />
                      )}
                        </div>
                      </CollapsibleContent>
                      <div className="border-t border-dashed border-foreground/[0.08] mt-4 mb-2.5 -mx-1" />
                      <span className="flex items-center gap-1 pl-[22px] text-xs text-primary/80 font-medium pb-0">
                        {highlightsExpanded ?
                    <>Show less <ChevronUp className="w-3 h-3" /></> :
                    <>+{highlights.length - 3} more <ChevronDown className="w-3 h-3" /></>
                    }
                      </span>
                    </Collapsible>
                }
                </div>
              </> :
  
            <div className="h-0" />
            }
          </div>
        )}

        {/* Clearance Outlook (Confirmed / Credentialing Stages Only) */}
        {(provider.stage === "credentialing" || provider.stage === "confirmed") && (() => {
          const outlook = getClearanceOutlook(provider);
          return (
            <div className="px-7 space-y-3 border-t border-dashed border-border/[0.72] relative pt-[24px] pb-[16px]">
              <h4 className="text-[10px] uppercase tracking-widest font-medium text-[#909cad] bg-card px-3 absolute -top-[8px] left-4">
                Clearance Outlook
              </h4>
              {provider.stage === "confirmed" && (
                <div className="flex items-start gap-2.5 p-3 mb-2 rounded-md bg-blue-50/50 border border-blue-100/50 text-[12.5px] text-muted-foreground leading-snug">
                  <Info className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
                  <p>Provider is confirmed and awaiting credentialing. The clearance process should be starting soon.</p>
                </div>
              )}
              <div className="flex items-center justify-between rounded-md bg-[hsl(0,0%,97.5%)] border-[1.5px] border-[hsl(0,0%,93.5%)] p-4 shadow-[0_6px_12px_-6px_hsla(0,0%,0%,0.06)]">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Est. Timeline</p>
                  <p className="text-[13px] font-semibold text-foreground tracking-tight mt-0.5">
                    {outlook.window}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Target Date</p>
                  <p className={`text-[13px] font-semibold tracking-tight mt-0.5 ${provider.stage === "confirmed" ? "text-muted-foreground" : "text-foreground"}`}>
                    {provider.stage === "confirmed" ? "Pending" : (outlook.estimatedDate || "Ready")}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Clearance Summary (Credentialing Complete Stage Only) */}
        {provider.stage === "credentialing_complete" && (
          <div className="px-7 space-y-3 border-t border-dashed border-border/[0.72] relative pt-[24px] pb-[16px]">
            <h4 className="text-[10px] uppercase tracking-widest font-medium text-[#909cad] bg-card px-3 absolute -top-[8px] left-4">
              Clearance Summary
            </h4>
            <div className="flex items-center justify-between rounded-md bg-[hsl(0,0%,97.5%)] border-[1.5px] border-[hsl(0,0%,93.5%)] p-4 shadow-[0_6px_12px_-6px_hsla(0,0%,0%,0.06)]">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Status</p>
                <p className="text-[13px] font-semibold text-[hsl(152,55%,32%)] tracking-tight mt-0.5">
                  {provider.credentials.length}/{provider.credentials.length} items verified
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground mb-1">Cleared On</p>
                <p className="text-[13px] font-semibold text-foreground tracking-tight">
                  Jul 6, 2026
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Credentials / Credentialing Progress */}
        {(provider.stage === "credentialing" || provider.stage === "credentialing_complete" || provider.stage === "confirmed") ? (
          <div className={`mt-5 px-7 py-5 border-t border-border bg-muted/30 rounded-b-[7px] transition-[background-color,border-color] duration-200 ${anyCardFocused && !isFocused ? '' : 'group-hover/card:bg-muted/50 group-hover/card:border-foreground/20'} ${isFocused ? 'bg-muted/50 border-foreground/20' : ''}`}>
            <h4 className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground mb-3">
              Credentialing Progress
            </h4>
            <CredentialingProgressBar provider={provider} dimProgress={anyCardFocused && !isFocused} />
          </div>
        ) : (
          <div className="px-7 space-y-2 border-t border-dashed border-border/[0.72] relative pt-[16px] pb-[32px] mt-5">
            <h4 className="text-[10px] uppercase tracking-widest font-medium text-[#909cad] bg-card px-3 absolute -top-[8px] left-4">
              {provider.stage === "on_assignment" ? "Schedule" : "Required Credentials"}
            </h4>
            
            {provider.stage === "on_assignment" ? (
              <div className="pt-2">
                <div className="rounded-md bg-[hsl(0,0%,97.5%)] border-[1.5px] border-[hsl(0,0%,93.5%)] group-hover/card:bg-[hsl(230,12%,97.5%)] group-hover/card:border-[hsl(230,12%,93.5%)] px-5 py-4 transition-[background-color,border-color] duration-[480ms] shadow-[0_6px_12px_-6px_hsla(0,0%,0%,0.06)]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">This Week</p>
                    <span className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">
                      Jul 5 - 11, 2026
                    </span>
                  </div>
                  {provider.availability.availableDays && (
                    <DayOfWeekBar days={provider.availability.availableDays} shiftTime="0700 - 1900" startDate="2026-07-05" />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {provider.credentials.map((cred) =>
                  <BinaryCredentialPill key={cred.id} credential={cred} />
                )}
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      <CredentialModal
        credential={selectedCredential}
        open={!!selectedCredential}
        onOpenChange={(open) => !open && setSelectedCredential(null)} />

    </>);

}

function MonthlyScheduleGrid({ assignedShifts = [] }: { assignedShifts?: number[] }) {
  const days = Array.from({ length: 28 }, (_, i) => i);
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  
  return (
    <div className="space-y-2 mt-1">
      <div className="grid grid-cols-7 gap-3 px-3">
        {weekDays.map((d, i) => (
          <div key={i} className="text-[10px] text-center font-medium text-muted-foreground/60">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3 px-3">
        {days.map((day) => {
          const isShift = assignedShifts.includes(day);
          return (
            <div 
              key={day} 
              className={`aspect-square rounded-[3px] border ${isShift ? 'bg-primary border-primary/20 shadow-sm' : 'bg-muted/40 border-border/50'}`} 
            />
          );
        })}
      </div>
    </div>
  );
}