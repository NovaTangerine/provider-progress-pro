import { useState } from "react";
import { Provider, Credential, CredentialStatus } from "@/types/recruiting";
import { StatusBadge, STATUS_CONFIG } from "./StatusBadge";
import { CredentialModal } from "./CredentialModal";
import {
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
  Mail,
  Phone,
  ArrowRight,
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

export function ProviderCard({ provider }: ProviderCardProps) {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const currentExp = provider.experience.find((e) => !e.endYear);
  const latestEdu = provider.education[0];

  return (
    <>
      <div className="rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-4">
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

        <div className="px-5 py-4 space-y-5">
          {/* Availability Section */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Availability
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>{provider.availability.startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-[10px] font-normal capitalize">
                  {provider.availability.type.replace("-", " ")}
                </Badge>
              </div>
              {provider.availability.preferredLocations && (
                <div className="flex items-start gap-2 text-sm col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    {provider.availability.preferredLocations.join(", ")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm col-span-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {provider.availability.willingToRelocate ? "Willing to relocate" : "Won't relocate"}
                </span>
              </div>
            </div>
          </div>

          {/* Education & Experience Highlights */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Highlights
            </h4>
            <div className="space-y-2">
              {latestEdu && (
                <div className="flex items-start gap-2 text-sm">
                  <GraduationCap className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    {latestEdu.degree}, {latestEdu.field}
                    <span className="text-muted-foreground"> · {latestEdu.institution}</span>
                  </span>
                </div>
              )}
              {currentExp && (
                <div className="flex items-start gap-2 text-sm">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    {currentExp.title}
                    <span className="text-muted-foreground"> · {currentExp.organization}</span>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3 h-3 shrink-0" />
                {provider.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3 h-3 shrink-0" />
                {provider.phone}
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-2.5">
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
      </div>

      <CredentialModal
        credential={selectedCredential}
        open={!!selectedCredential}
        onOpenChange={(open) => !open && setSelectedCredential(null)}
      />
    </>
  );
}
