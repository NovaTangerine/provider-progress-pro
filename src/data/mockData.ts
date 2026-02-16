import { Role, Provider, Credential, CredentialStatus } from "@/types/recruiting";

const cred = (
  id: string,
  name: string,
  type: "license" | "certification",
  status: CredentialStatus,
  extra?: Partial<Credential>
): Credential => ({ id, name, type, status, ...extra });

export const mockProviders: Provider[] = [
  {
    id: "p1",
    firstName: "Sarah",
    lastName: "Chen",
    specialty: "Cardiology",
    npiNumber: "1234567890",
    email: "s.chen@email.com",
    phone: "(555) 123-4567",
    availability: {
      startDate: "2026-04-01",
      type: "full-time",
      willingToRelocate: true,
      preferredLocations: ["Boston, MA", "New York, NY"],
    },
    education: [
      { institution: "Johns Hopkins University", degree: "MD", field: "Medicine", graduationYear: 2016 },
      { institution: "MIT", degree: "BS", field: "Biomedical Engineering", graduationYear: 2012 },
    ],
    experience: [
      { organization: "Massachusetts General Hospital", title: "Attending Cardiologist", startYear: 2021, specialty: "Interventional Cardiology" },
      { organization: "Cleveland Clinic", title: "Cardiology Fellow", startYear: 2018, endYear: 2021 },
    ],
    credentials: [
      cred("c1", "State Medical License (MA)", "license", "completed", { issuingBody: "MA Board of Medicine", expirationDate: "2027-12-31" }),
      cred("c2", "DEA Registration", "license", "completed", { issuingBody: "DEA", expirationDate: "2028-06-30" }),
      cred("c3", "Board Certification – Cardiology", "certification", "completed", { issuingBody: "ABIM" }),
      cred("c4", "BLS Certification", "certification", "completed", { issuingBody: "AHA", expirationDate: "2027-03-15" }),
      cred("c5", "ACLS Certification", "certification", "in_progress", { issuingBody: "AHA", notes: "Renewal scheduled for March" }),
      cred("c6", "Malpractice Insurance", "license", "completed"),
    ],
    overallStatus: "in_progress",
    submittedDate: "2026-01-15",
  },
  {
    id: "p2",
    firstName: "James",
    lastName: "Rodriguez",
    specialty: "Cardiology",
    npiNumber: "2345678901",
    email: "j.rodriguez@email.com",
    phone: "(555) 234-5678",
    availability: {
      startDate: "2026-03-15",
      type: "full-time",
      willingToRelocate: false,
      preferredLocations: ["Boston, MA"],
    },
    education: [
      { institution: "Stanford University", degree: "MD", field: "Medicine", graduationYear: 2014 },
    ],
    experience: [
      { organization: "Brigham and Women's Hospital", title: "Attending Cardiologist", startYear: 2019, specialty: "Electrophysiology" },
      { organization: "UCSF Medical Center", title: "Cardiology Fellow", startYear: 2016, endYear: 2019 },
    ],
    credentials: [
      cred("c7", "State Medical License (MA)", "license", "completed", { issuingBody: "MA Board of Medicine" }),
      cred("c8", "DEA Registration", "license", "red_flag", { issuingBody: "DEA", notes: "Expired — renewal pending review" }),
      cred("c9", "Board Certification – Cardiology", "certification", "completed", { issuingBody: "ABIM" }),
      cred("c10", "Board Certification – Electrophysiology", "certification", "completed", { issuingBody: "ABIM" }),
      cred("c11", "BLS Certification", "certification", "completed", { issuingBody: "AHA" }),
      cred("c12", "ACLS Certification", "certification", "completed", { issuingBody: "AHA" }),
      cred("c13", "Malpractice Insurance", "license", "incomplete", { notes: "Awaiting documentation" }),
    ],
    overallStatus: "red_flag",
    submittedDate: "2026-01-20",
  },
  {
    id: "p3",
    firstName: "Priya",
    lastName: "Patel",
    specialty: "Cardiology",
    npiNumber: "3456789012",
    email: "p.patel@email.com",
    phone: "(555) 345-6789",
    availability: {
      startDate: "2026-05-01",
      type: "part-time",
      willingToRelocate: true,
    },
    education: [
      { institution: "Harvard Medical School", degree: "MD", field: "Medicine", graduationYear: 2017 },
      { institution: "Yale University", degree: "BA", field: "Molecular Biology", graduationYear: 2013 },
    ],
    experience: [
      { organization: "Mayo Clinic", title: "Senior Cardiologist", startYear: 2022, specialty: "Heart Failure" },
      { organization: "NYU Langone", title: "Cardiology Fellow", startYear: 2019, endYear: 2022 },
    ],
    credentials: [
      cred("c14", "State Medical License (MA)", "license", "in_progress", { issuingBody: "MA Board of Medicine", notes: "Application submitted" }),
      cred("c15", "DEA Registration", "license", "incomplete"),
      cred("c16", "Board Certification – Cardiology", "certification", "completed", { issuingBody: "ABIM" }),
      cred("c17", "BLS Certification", "certification", "completed", { issuingBody: "AHA" }),
      cred("c18", "ACLS Certification", "certification", "completed", { issuingBody: "AHA" }),
      cred("c19", "Malpractice Insurance", "license", "incomplete"),
    ],
    overallStatus: "in_progress",
    submittedDate: "2026-02-01",
  },
  {
    id: "p4",
    firstName: "Michael",
    lastName: "Thompson",
    specialty: "Cardiology",
    npiNumber: "4567890123",
    email: "m.thompson@email.com",
    phone: "(555) 456-7890",
    availability: {
      startDate: "2026-03-01",
      type: "locum",
      willingToRelocate: true,
      preferredLocations: ["Northeast US"],
    },
    education: [
      { institution: "University of Pennsylvania", degree: "MD", field: "Medicine", graduationYear: 2015 },
    ],
    experience: [
      { organization: "Mount Sinai Hospital", title: "Attending Cardiologist", startYear: 2020 },
      { organization: "Duke University Hospital", title: "Cardiology Fellow", startYear: 2017, endYear: 2020 },
    ],
    credentials: [
      cred("c20", "State Medical License (MA)", "license", "exception", { issuingBody: "MA Board of Medicine", notes: "Reciprocity agreement — approved with conditions" }),
      cred("c21", "DEA Registration", "license", "completed", { issuingBody: "DEA" }),
      cred("c22", "Board Certification – Cardiology", "certification", "completed", { issuingBody: "ABIM" }),
      cred("c23", "BLS Certification", "certification", "completed", { issuingBody: "AHA" }),
      cred("c24", "ACLS Certification", "certification", "completed", { issuingBody: "AHA" }),
      cred("c25", "Malpractice Insurance", "license", "completed"),
    ],
    overallStatus: "exception",
    submittedDate: "2026-01-10",
  },
];

export const mockRole: Role = {
  id: "r1",
  title: "Interventional Cardiologist",
  department: "Cardiology",
  facility: "Boston Medical Center",
  location: "Boston, MA",
  urgency: "urgent",
  postedDate: "2026-01-05",
  targetStartDate: "2026-04-01",
  providers: mockProviders,
};
