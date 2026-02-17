import { useState } from "react";
import { Provider, Credential, CredentialStatus } from "@/types/recruiting";
import { ShiftPreferenceIcons } from "./ShiftPreferenceIcons";
import { StatusBadge, STATUS_CONFIG } from "./StatusBadge";
import { CredentialModal } from "./CredentialModal";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Syringe,
  Building2,
  ShieldCheck,
  Award,
  Languages,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProviderCardProps {
  provider: Provider;
}

function CredentialPill({ credential, onClick }: { credential: Credential; onClick: (c: Credential) => void }) {
  const config = STATUS_CONFIG[credential.status];
  return (
    <button
      onClick={() => onClick(credential)}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 hover:shadow-sm cursor-pointer ${config.bgClassName} ${config.className} border-transparent hover:border-current/20`}
      title={`${credential.name} — ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClassName} shrink-0`} />
      <span className="truncate max-w-[140px]">{credential.name}</span>
    </button>
  );
}

function StatusLegendBar({ credentials }: { credentials: Credential[] }) {
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
              style={{ width: `${(count / total) * 100}%` }}
              title={`${config.label}: ${count}/${total}`}
            />
          );
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
            </span>
          );
        })}
      </div>
    </div>
  );
}

const HIGHLIGHT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  procedure: Syringe,
  site: Building2,
  credential: ShieldCheck,
  award: Award,
  language: Languages,
  research: FlaskConical,
};

function HighlightItem({ text, icon }: { text: string; icon?: string }) {
  const Icon = icon ? HIGHLIGHT_ICONS[icon] ?? Sparkles : Sparkles;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="w-3.5 h-3.5 text-primary/70 shrink-0 mt-0.5" />
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}

function formatDateRange(startDate: string, endDate?: string) {
  const fmt = (d: string) => {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  if (endDate) return `${fmt(startDate)} – ${fmt(endDate)}`;
  return `Starting ${fmt(startDate)}`;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [highlightsExpanded, setHighlightsExpanded] = useState(false);
  const [availabilityExpanded, setAvailabilityExpanded] = useState(false);
  const highlights = provider.highlights ?? [];
  const visibleHighlights = highlightsExpanded ? highlights : highlights.slice(0, 3);
  const hasMore = highlights.length > 3;

  return (
    <>
      <div className="rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden grid grid-rows-subgrid row-span-4">
        {/* Header */}
        <div className="px-7 py-4 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {provider.firstName[0]}
              {provider.lastName[0]}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {provider.firstName} {provider.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{provider.specialty}</p>
            </div>
          </div>
          <StatusBadge status={provider.overallStatus} />
        </div>

        {/* Availability Section */}
        <div className="px-7 pt-6 pb-4 space-y-3.5 border-b border-dashed border-border/50">
          <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Availability
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>{formatDateRange(provider.availability.startDate, provider.availability.endDate)}</span>
              <span className="text-muted-foreground/40">·</span>
              <button
                onClick={() => setAvailabilityExpanded(!availabilityExpanded)}
                className="text-xs text-primary/80 hover:text-primary underline underline-offset-2 transition-colors"
              >
                {availabilityExpanded ? "Hide details" : "View details"}
              </button>
            </div>
            {availabilityExpanded && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-[10px] font-normal capitalize">
                    {provider.availability.type.replace("-", " ")}
                  </Badge>
                </div>
                {provider.availability.recurringDays && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{provider.availability.recurringDays}</span>
                  </div>
                )}
                {provider.availability.scheduleNotes?.map((note, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs text-muted-foreground italic">{note.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-muted-foreground text-xs">
                    {provider.availability.willingToRelocate ? "Willing to relocate" : "Won't relocate"}
                  </span>
                </div>
                {provider.availability.shiftPreferences && provider.availability.shiftPreferences.length > 0 && (
                  <ShiftPreferenceIcons preferences={provider.availability.shiftPreferences} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Provider Highlights */}
        <div className="px-7 py-4 space-y-3.5 border-b border-dashed border-border/50">
          {highlights.length > 0 ? (
            <>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Provider Highlights
              </h4>
              <div className="space-y-2">
                {visibleHighlights.map((h, i) => (
                  <HighlightItem key={i} text={h.text} icon={h.icon} />
                ))}
              </div>
              {hasMore && (
                <button
                  onClick={() => setHighlightsExpanded(!highlightsExpanded)}
                  className="flex items-center gap-1 text-xs text-primary/80 hover:text-primary font-medium transition-colors"
                >
                  {highlightsExpanded ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>+{highlights.length - 3} more <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="h-0" />
          )}
        </div>

        {/* Credentials */}
        <div className="px-7 py-4 space-y-3.5">
          <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Credentials
          </h4>
          <StatusLegendBar credentials={provider.credentials} />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {provider.credentials.map((cred) => (
              <CredentialPill key={cred.id} credential={cred} onClick={setSelectedCredential} />
            ))}
          </div>
        </div>
      </div>

      <CredentialModal
        credential={selectedCredential}
        open={!!selectedCredential}
        onOpenChange={(open) => !open && setSelectedCredential(null)}
      />
    </>
  );
}
