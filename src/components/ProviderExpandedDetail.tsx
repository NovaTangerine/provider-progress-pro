import { Provider, Credential, CredentialStatus, CredentialCategory } from "@/types/recruiting";
import { STATUS_CONFIG } from "./StatusBadge";
import { CredentialCard } from "./CredentialCard";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Clock,
} from "lucide-react";

interface ProviderExpandedDetailProps {
  provider: Provider;
  onSelectCredential: (credential: Credential) => void;
}

const CATEGORY_LABELS: Record<CredentialCategory, string> = {
  identity_verification: "Identity Verification",
  state_license: "State Licenses",
  board_certification: "Board Certifications",
  other: "Other",
};

const CATEGORY_ORDER: CredentialCategory[] = [
  "identity_verification",
  "state_license",
  "board_certification",
  "other",
];

function getAggregateStatus(credentials: Credential[]): CredentialStatus {
  const priority: CredentialStatus[] = ["red_flag", "incomplete", "in_progress", "exception", "completed"];
  for (const status of priority) {
    if (credentials.some((c) => c.status === status)) return status;
  }
  return "completed";
}

function CategoryGroup({
  category,
  credentials,
  onSelect,
}: {
  category: CredentialCategory;
  credentials: Credential[];
  onSelect: (c: Credential) => void;
}) {
  const aggStatus = getAggregateStatus(credentials);
  const config = STATUS_CONFIG[aggStatus];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${config.dotClassName}`} />
        <h5 className="text-xs font-normal text-foreground tracking-wide">
          {CATEGORY_LABELS[category]}
        </h5>
      </div>
      <div className="space-y-1.5 md:pl-4">
        {credentials.map((cred) => (
          <CredentialCard key={cred.id} credential={cred} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
}

export function ProviderExpandedDetail({ provider, onSelectCredential }: ProviderExpandedDetailProps) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    credentials: provider.credentials.filter((c) => c.category === cat),
  })).filter((g) => g.credentials.length > 0);

  return (
    <div className="px-6 pb-6 pt-6 md:pl-[var(--expanded-left-offset,2rem)] md:pr-8 md:py-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 md:gap-8 w-full md:max-w-4xl">
        {/* Credentials — primary */}
        <div className="space-y-5 order-1">
          <h4 className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
            Licenses & Certifications
          </h4>
          {grouped.map((g) => (
            <CategoryGroup
              key={g.category}
              category={g.category}
              credentials={g.credentials}
              onSelect={onSelectCredential}
            />
          ))}
        </div>

        {/* Secondary info — softer */}
        <div className="space-y-5 md:border-l md:border-border/50 md:pl-6 order-2 md:pt-[60px]">
          <div className="group/section space-y-2 cursor-default">
            <h5 className="text-[11px] font-medium text-muted-foreground/70 tracking-wide">
              Contact & Availability
            </h5>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground flex items-center gap-2 transition-colors duration-150 group-hover/section:text-[#444444]">
                <Mail className="w-3 h-3 text-muted-foreground/60 transition-colors duration-150 group-hover/section:text-muted-foreground" />
                {provider.email}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2 transition-colors duration-150 group-hover/section:text-[#444444]">
                <Phone className="w-3 h-3 text-muted-foreground/60 transition-colors duration-150 group-hover/section:text-muted-foreground" />
                {provider.phone}
              </p>
              <p className="text-xs text-muted-foreground font-mono transition-colors duration-150 group-hover/section:text-[#444444]">
                NPI: {provider.npiNumber}
              </p>
              {provider.availability.preferredLocations && (
                <p className="text-xs text-muted-foreground flex items-start gap-2 transition-colors duration-150 group-hover/section:text-[#444444]">
                  <MapPin className="w-3 h-3 text-muted-foreground/60 mt-0.5 transition-colors duration-150 group-hover/section:text-muted-foreground" />
                  <span>{provider.availability.preferredLocations.join(", ")}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground flex items-center gap-2 transition-colors duration-150 group-hover/section:text-[#444444]">
                <Clock className="w-3 h-3 text-muted-foreground/60 transition-colors duration-150 group-hover/section:text-muted-foreground" />
                {provider.availability.willingToRelocate ? "Will relocate" : "Won't relocate"}
              </p>
            </div>
          </div>

          <div className="group/section space-y-2 cursor-default">
            <h5 className="text-[11px] font-medium text-muted-foreground/70 tracking-wide">
              Education
            </h5>
            <div className="space-y-1.5">
              {provider.education.map((edu, i) => (
                <div key={i} className="flex items-start gap-2">
                  <GraduationCap className="w-3 h-3 text-muted-foreground/60 mt-0.5 transition-colors duration-150 group-hover/section:text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium transition-colors duration-150 group-hover/section:text-[#444444]">
                      {edu.degree}, {edu.field}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 transition-colors duration-150 group-hover/section:text-[#444444]">
                      {edu.institution} · {edu.graduationYear}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="group/section space-y-2 cursor-default">
            <h5 className="text-[11px] font-medium text-muted-foreground/70 tracking-wide">
              Experience
            </h5>
            <div className="space-y-1.5">
              {provider.experience.map((exp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Briefcase className="w-3 h-3 text-muted-foreground/60 mt-0.5 transition-colors duration-150 group-hover/section:text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium transition-colors duration-150 group-hover/section:text-[#444444]">{exp.title}</p>
                    <p className="text-[11px] text-muted-foreground/70 transition-colors duration-150 group-hover/section:text-[#444444]">
                      {exp.organization} · {exp.startYear}–{exp.endYear ?? "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
