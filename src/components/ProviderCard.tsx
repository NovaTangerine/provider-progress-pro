import { useState, useRef, useEffect, useCallback } from "react";
import { Provider, Credential, CredentialStatus } from "@/types/recruiting";
import { ShiftPreferenceIcons } from "./ShiftPreferenceIcons";
import { StatusBadge, STATUS_CONFIG } from "./StatusBadge";
import { CredentialModal } from "./CredentialModal";
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
  Sparkles } from
"lucide-react";
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

function StatusLegendBar({ credentials }: {credentials: Credential[];}) {
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
              className={`${config.dotClassName} transition-all duration-300`}
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
              <span className={`w-2 h-2 rounded-full ${config.dotClassName}`} />
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

export function ProviderCard({ provider, highlightsExpanded, onHighlightsToggle, availabilityExpanded, onAvailabilityToggle }: ProviderCardProps) {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const highlights = provider.highlights ?? [];
  const visibleHighlights = highlightsExpanded ? highlights : highlights.slice(0, 3);
  const hasMore = highlights.length > 3;

  const STATUS_SHADOW: Record<string, string> = {
    incomplete: "0 4px 20px -1px hsla(215,12%,65%,0.30), 0 2px 10px -2px hsla(215,12%,65%,0.22)",
    in_progress: "0 4px 20px -1px hsla(210,60%,50%,0.30), 0 2px 10px -2px hsla(210,60%,50%,0.22)",
    completed: "0 4px 20px -1px hsla(152,60%,40%,0.30), 0 2px 10px -2px hsla(152,60%,40%,0.22)",
    red_flag: "0 4px 20px -1px hsla(0,72%,51%,0.30), 0 2px 10px -2px hsla(0,72%,51%,0.22)",
    exception: "0 4px 20px -1px hsla(262,52%,50%,0.30), 0 2px 10px -2px hsla(262,52%,50%,0.22)",
  };
  const STATUS_GRADIENT: Record<string, string> = {
    incomplete: "hsla(215,12%,65%,0.07)",
    in_progress: "hsla(210,60%,50%,0.08)",
    completed: "hsla(152,60%,40%,0.08)",
    red_flag: "hsla(0,72%,51%,0.07)",
    exception: "hsla(262,52%,50%,0.07)",
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
  const gradientColor = STATUS_GRADIENT[provider.overallStatus] ?? STATUS_GRADIENT.incomplete;
  const hoverShadow = STATUS_SHADOW[provider.overallStatus] ?? STATUS_SHADOW.incomplete;
  const avatarBg = STATUS_AVATAR_BG[provider.overallStatus] ?? STATUS_AVATAR_BG.incomplete;
  const avatarText = STATUS_AVATAR_TEXT[provider.overallStatus] ?? STATUS_AVATAR_TEXT.incomplete;

  return (
    <>
      <div
        className="group/card rounded-lg border border-border bg-card shadow-sm hover:border-foreground/20 outline outline-0 hover:outline-[1px] outline-foreground/10 -outline-offset-1 transition-[box-shadow,border-color,outline-width] duration-200 overflow-hidden grid grid-rows-subgrid row-span-4 gap-0 provider-card-shadow"
        style={{ '--card-hover-shadow': hoverShadow } as React.CSSProperties}
      >
        {/* Header */}
        <div className="relative pl-5 pr-7 py-4 border-b border-border group-hover/card:border-foreground/20 flex items-center justify-between gap-4 transition-[background-color,border-color] duration-200 group-hover/card:bg-muted/50">
          <div
            className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ backgroundImage: `linear-gradient(135deg, transparent 40%, ${gradientColor})` }}
          />
          <div className="flex items-center gap-3 relative">
            <div
              className="w-11 h-11 rounded-full bg-primary/10 transition-[background-color,color] duration-200 flex items-center justify-center text-sm font-bold text-primary shrink-0"
              style={{ '--avatar-hover-bg': avatarBg, '--avatar-hover-text': avatarText } as React.CSSProperties}
            >
              {provider.firstName[0]}
              {provider.lastName[0]}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground transition-colors duration-200 provider-dim-name">
                {provider.firstName} {provider.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{provider.specialty}</p>
            </div>
          </div>
          <StatusBadge status={provider.overallStatus} />
        </div>

        {/* Availability Section */}
        <div className="px-7 space-y-1 pt-[24px] pb-[20px]">
          <h4 className="text-[10px] uppercase tracking-widest font-medium text-[#909cad]">
            Availability
          </h4>
          <div className="space-y-2">
            <div
              onClick={onAvailabilityToggle}
              className="group/avail flex items-center gap-3 text-sm cursor-pointer rounded-md pl-1 py-1.5 transition-colors duration-200 hover:bg-[hsl(0,0%,97%)]">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-colors duration-200 group-hover/card:text-[hsl(252,56%,57%)]" />
              <span className="text-lg tracking-tight text-[#333333] transition-[color] duration-200 font-medium provider-dim-date">{formatDateRange(provider.availability.startDate, provider.availability.endDate)}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs text-primary/80 underline underline-offset-2 transition-colors group-hover/avail:text-primary">
                {availabilityExpanded ? "Hide details" : "View details"}
              </span>
            </div>
            <Collapsible open={availabilityExpanded}>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <div className="rounded-md bg-[hsl(0,0%,97.5%)] p-6 space-y-4 mt-1">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
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
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Provider Highlights */}
        <div className={`px-7 ${highlights.length > 0 ? 'border-t border-dashed border-border/[0.72] relative' : ''} pt-[24px] pb-[16px]`}>
          {highlights.length > 0 ?
          <>
              <h4 className="text-[10px] uppercase tracking-widest font-medium text-[#909cad] bg-card px-3 absolute -top-[8px] left-4">
                Provider Highlights
              </h4>
              <div
              onClick={hasMore ? onHighlightsToggle : undefined}
              className={`rounded-md bg-[hsl(0,0%,97.5%)] group-hover/card:bg-[hsl(230,15%,96.5%)] p-3 py-5 space-y-2 transition-[background-color] duration-[480ms] ${hasMore ? "cursor-pointer hover:!bg-[hsl(230,15%,95%)]" : ""}`}>

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
                    <span className="flex items-center gap-1 text-xs text-primary/80 font-medium pt-1">
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

        {/* Credentials */}
        <div className="px-7 space-y-2 border-t border-dashed border-border/[0.72] relative pt-[16px] pb-[24px] mt-5">
          <h4 className="text-[10px] uppercase tracking-widest font-medium text-[#909cad] bg-card px-3 absolute -top-[8px] left-4">
            Credentials
          </h4>
          <StatusLegendBar credentials={provider.credentials} />
          <div className="flex flex-wrap gap-1.5 pt-2.5">
            {provider.credentials.map((cred) =>
            <CredentialPill key={cred.id} credential={cred} onClick={setSelectedCredential} />
            )}
          </div>
        </div>
      </div>

      <CredentialModal
        credential={selectedCredential}
        open={!!selectedCredential}
        onOpenChange={(open) => !open && setSelectedCredential(null)} />

    </>);

}