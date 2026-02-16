// ── Status enum (extensible) ──
export type CredentialStatus =
  | "incomplete"
  | "in_progress"
  | "completed"
  | "red_flag"
  | "exception";

// ── Provider journey stage ──
export type ProviderStage =
  | "presented"
  | "confirmed"
  | "credentialing"
  | "on_assignment";

// ── Credential category ──
export type CredentialCategory =
  | "identity_verification"
  | "state_license"
  | "board_certification"
  | "other";

export interface StatusMeta {
  label: string;
  description?: string;
}

// ── Credential (license or certification) ──
export interface Credential {
  id: string;
  name: string;
  type: "license" | "certification";
  status: CredentialStatus;
  category: CredentialCategory;
  issuingBody?: string;
  expirationDate?: string;
  notes?: string;
}

// ── Education ──
export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
}

// ── Experience ──
export interface Experience {
  organization: string;
  title: string;
  startYear: number;
  endYear?: number; // undefined = current
  specialty?: string;
}

// ── Availability ──
export interface Availability {
  startDate: string;
  type: "full-time" | "part-time" | "locum" | "contract";
  willingToRelocate: boolean;
  preferredLocations?: string[];
}

// ── Provider ──
export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  npiNumber: string;
  email: string;
  phone: string;
  avatar?: string;
  availability: Availability;
  education: Education[];
  experience: Experience[];
  credentials: Credential[];
  stage: ProviderStage;
  overallStatus: CredentialStatus; // derived from worst credential
  submittedDate: string;
  notes?: string;
}

// ── Open Role ──
export interface Role {
  id: string;
  title: string;
  department: string;
  facility: string;
  location: string;
  urgency: "routine" | "urgent" | "critical";
  postedDate: string;
  targetStartDate: string;
  providers: Provider[];
}
