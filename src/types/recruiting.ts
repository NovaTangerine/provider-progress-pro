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

// ── Credential workflow step ──
export type WorkflowStepStatus = "pending" | "in_progress" | "completed" | "blocked";

export interface CredentialWorkflowStep {
  id: string;
  label: string;
  status: WorkflowStepStatus;
  completedDate?: string;
  estimatedDate?: string;
  assignedTo?: string;
  notes?: string;
}

// ── Credential contact ──
export interface CredentialContact {
  name: string;
  role?: string;
  organization: string;
  email?: string;
  phone?: string;
}

// ── Credential workflow ──
export type OrganizationType = "hospital_board" | "state_license_board" | "certification_board" | "other";

export interface CredentialWorkflow {
  issuingOrganization: string;
  organizationType: OrganizationType;
  contacts: CredentialContact[];
  steps: CredentialWorkflowStep[];
  estimatedApprovalDate?: string;
  actualApprovalDate?: string;
  expirationDate?: string;
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
  workflow?: CredentialWorkflow;
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
export interface ScheduleNote {
  label: string; // e.g. "No weekends", "Evenings only", "Available Mon–Thu"
}

export type ShiftType = "weekends" | "nights" | "overnights" | "back_to_back";
export type ShiftStance = "works" | "does_not_work" | "prefers" | "higher_rate";

export interface ShiftPreference {
  shift: ShiftType;
  stance: ShiftStance;
}

export interface Availability {
  startDate: string;
  endDate?: string; // if assignment is date-bounded
  type: "full-time" | "part-time" | "locum" | "contract";
  willingToRelocate: boolean;
  preferredLocations?: string[];
  recurringDays?: string; // e.g. "Mon–Fri", "Weekdays only"
  scheduleNotes?: ScheduleNote[];
  shiftPreferences?: ShiftPreference[];
}

// ── Provider Highlight ──
export interface ProviderHighlight {
  text: string; // e.g. "500+ cardiac catheterizations performed"
  icon?: "procedure" | "site" | "credential" | "award" | "language" | "research";
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
  highlights?: ProviderHighlight[];
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
