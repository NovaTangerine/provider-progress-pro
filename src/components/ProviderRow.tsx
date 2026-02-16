import { useState } from "react";
import { Provider, Credential, CredentialStatus } from "@/types/recruiting";
import { StatusBadge, STATUS_CONFIG } from "./StatusBadge";
import { CredentialCard } from "./CredentialCard";
import { CredentialModal } from "./CredentialModal";
import {
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProviderRowProps {
  provider: Provider;
  isExpanded: boolean;
  onToggle: () => void;
}

function CredentialSummary({ credentials }: { credentials: Credential[] }) {
  const counts = credentials.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    {} as Record<CredentialStatus, number>
  );

  const order: CredentialStatus[] = ["red_flag", "incomplete", "in_progress", "exception", "completed"];

  return (
    <div className="flex items-center gap-1">
      {order.map((status) => {
        const count = counts[status];
        if (!count) return null;
        const config = STATUS_CONFIG[status];
        return (
          <span
            key={status}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${config.bgClassName} ${config.className}`}
            title={`${count} ${config.label}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClassName}`} />
            {count}
          </span>
        );
      })}
    </div>
  );
}

export function ProviderRow({ provider, isExpanded, onToggle }: ProviderRowProps) {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);

  const currentExp = provider.experience.find((e) => !e.endYear);

  return (
    <>
      {/* Main row */}
      <tr
        onClick={onToggle}
        className={`group cursor-pointer border-b border-grid-border transition-colors duration-100 ${
          isExpanded ? "bg-grid-row-expanded" : "hover:bg-grid-row-hover"
        }`}
      >
        <td className="px-4 py-3 w-8">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
              {provider.firstName[0]}
              {provider.lastName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {provider.lastName}, {provider.firstName}
              </p>
              <p className="text-xs text-muted-foreground">{provider.specialty}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={provider.overallStatus} />
        </td>
        <td className="px-4 py-3">
          <CredentialSummary credentials={provider.credentials} />
        </td>
        <td className="px-4 py-3">
          <div className="text-sm">
            <Badge variant="outline" className="text-xs font-normal capitalize">
              {provider.availability.type.replace("-", " ")}
            </Badge>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {provider.availability.startDate}
          </span>
        </td>
        <td className="px-4 py-3">
          {currentExp && (
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {currentExp.organization}
            </p>
          )}
        </td>
      </tr>

      {/* Expanded detail */}
      {isExpanded && (
        <tr className="bg-grid-row-expanded border-b border-grid-border">
          <td colSpan={7} className="p-0">
            <div className="px-8 py-6 animate-fade-in">
              <div className="grid grid-cols-3 gap-8">
                {/* Contact & Availability */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact & Availability
                  </h4>
                  <div className="space-y-2.5">
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      {provider.email}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {provider.phone}
                    </p>
                    <p className="text-sm flex items-center gap-2 font-mono text-xs">
                      NPI: {provider.npiNumber}
                    </p>
                    {provider.availability.preferredLocations && (
                      <p className="text-sm flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <span>{provider.availability.preferredLocations.join(", ")}</span>
                      </p>
                    )}
                    <p className="text-sm flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {provider.availability.willingToRelocate ? "Will relocate" : "Won't relocate"}
                    </p>
                  </div>
                </div>

                {/* Education & Experience */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Education
                  </h4>
                  <div className="space-y-2">
                    {provider.education.map((edu, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {edu.degree}, {edu.field}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {edu.institution} · {edu.graduationYear}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2">
                    Experience
                  </h4>
                  <div className="space-y-2">
                    {provider.experience.map((exp, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{exp.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {exp.organization} · {exp.startYear}–{exp.endYear ?? "Present"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credentials */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Licenses & Certifications
                  </h4>
                  <div className="space-y-2">
                    {provider.credentials.map((cred) => (
                      <CredentialCard
                        key={cred.id}
                        credential={cred}
                        onClick={setSelectedCredential}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}

      <CredentialModal
        credential={selectedCredential}
        open={!!selectedCredential}
        onOpenChange={(open) => !open && setSelectedCredential(null)}
      />
    </>
  );
}
