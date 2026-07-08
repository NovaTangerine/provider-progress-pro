import { useState, useMemo, useRef, useEffect } from "react";
import { ProviderStage } from "@/types/recruiting";
import { ProviderCard } from "@/components/ProviderCard";

// Mock data generator (ported from SingleJob.tsx)
const generateKimberlyStates = () => {
  const baseKimberly = {
    id: "p-kim",
    stage: "credentialing",
    firstName: "Kimberly",
    lastName: "Pine",
    specialty: "Neurology",
    npiNumber: "0987654321",
    email: "k.pine@email.com",
    phone: "(555) 987-6543",
    overallStatus: "in_progress",
    submittedDate: "2026-05-10",
    availability: {
      startDate: "2026-06-25",
      endDate: "2026-11-30",
      type: "part-time",
      willingToRelocate: false,
      preferredLocations: ["Seattle, WA"],
      recurringDays: "Mon, Wed, Fri",
      availableDays: ["on", "off", "on", "off", "on", "off", "off"],
      scheduleNotes: [{ label: "Needs afternoon shifts" }],
      shiftPreferences: [
        { shift: "weekends", stance: "does_not_work" },
      ],
    },
    education: [
      { institution: "University of Washington", degree: "MD", field: "Medicine", graduationYear: 2018 },
    ],
    experience: [
      { organization: "Seattle Grace Hospital", title: "Neurologist", startYear: 2022 },
    ],
    credentials: [
      {
        id: "k-c1", name: "State Medical License (WA)", type: "license", status: "completed", category: "state_license",
        issuingBody: "WA Medical Commission", expirationDate: "2028-01-01",
        workflow: {
          issuingOrganization: "WA Medical Commission",
          organizationType: "state_license_board",
          steps: [{ id: "k-c1-s1", label: "License verified", status: "completed" }]
        }
      },
      {
        id: "k-c2", name: "DEA Registration", type: "license", status: "completed", category: "identity_verification",
        issuingBody: "DEA", notes: "Registration verified",
        workflow: {
          issuingOrganization: "DEA",
          organizationType: "other",
          steps: [
            { id: "k-c2-s1", label: "Application submitted", status: "completed" },
            { id: "k-c2-s2", label: "DEA verified", status: "completed" }
          ]
        }
      },
      {
        id: "k-c3", name: "Board Certification – Neurology", type: "certification", status: "completed", category: "board_certification",
        issuingBody: "ABPN",
        workflow: {
          issuingOrganization: "ABPN",
          organizationType: "certification_board",
          steps: [{ id: "k-c3-s1", label: "Certification verified", status: "completed" }]
        }
      },
      {
        id: "k-c5", name: "ACLS Certification", type: "certification", status: "completed", category: "other"
      },
      {
        id: "k-c6", name: "BLS Certification", type: "certification", status: "completed", category: "other"
      },
      {
        id: "k-c7", name: "NPI Registration", type: "license", status: "completed", category: "other"
      },
      {
        id: "k-c4", name: "Hospital Privileges – Seattle Med", type: "license", status: "incomplete", category: "other",
        issuingBody: "Seattle Medical Center", notes: "Missing background check",
        workflow: {
          issuingOrganization: "Seattle Medical Center",
          organizationType: "other",
          steps: [
            { id: "k-c4-s1", label: "Application submitted", status: "completed" },
            { id: "k-c4-s2", label: "Background check", status: "blocked", notes: "Fingerprints needed" }
          ]
        }
      }
    ],
    highlights: [
      { text: "Specializes in pediatric neurology", icon: "procedure" },
      { text: "Board certified", icon: "credential" },
      { text: "Over 8 years of clinical experience", icon: "award" },
      { text: "Bilingual in English and Spanish", icon: "language" },
      { text: "Published 5 peer-reviewed papers", icon: "research" },
    ],
  };
  
  const cloneProvider = (stage: ProviderStage, overrides?: any) => {
    const cloned = JSON.parse(JSON.stringify(baseKimberly));
    cloned.id = `p-kim-${stage}`;
    cloned.stage = stage;
    if (overrides) {
      const { availability, ...rest } = overrides;
      if (availability) {
        cloned.availability = { ...cloned.availability, ...availability };
      }
      Object.assign(cloned, rest);
    }
    return cloned;
  };

  return {
    presented: cloneProvider("presented", {
      overallStatus: "presented",
      fitScore: 82,
      fitEvaluation: "Good Fit"
    }),
    awaiting_confirmation: cloneProvider("awaiting_confirmation", {
      overallStatus: "awaiting_confirmation"
    }),
    confirmed: cloneProvider("confirmed", {
      overallStatus: "confirmed",
      fitScore: 96,
      fitEvaluation: "Great Fit",
      credentials: baseKimberly.credentials.map(c => ({
        ...c,
        status: "incomplete",
        workflow: c.workflow ? {
          ...c.workflow,
          steps: c.workflow.steps?.map(s => ({ ...s, status: "incomplete", completedDate: undefined }))
        } : undefined
      }))
    }),
    credentialing: cloneProvider("credentialing"),
    credentialing_complete: cloneProvider("credentialing_complete", {
      overallStatus: "completed",
      availability: { startDate: "2026-07-15" },
      credentials: baseKimberly.credentials.map(c => ({
        ...c,
        status: "completed",
        notes: c.status === "completed" ? c.notes : "Requirement met"
      }))
    }),
    on_assignment: cloneProvider("on_assignment", {
      availability: {
        assignedShifts: [10, 11, 12, 16, 17, 18, 19, 23, 24],
        availableDays: ["off", "on", "on", "off", "on", "off", "off"],
        shiftPreferences: [
          { shift: "weekends", stance: "prefers" },
          { shift: "nights", stance: "does_not_work" }
        ]
      },
      highlights: [
        { text: "Assigned to the Pediatric Neurology Wing", icon: "procedure" },
        { text: "Orientation completed on Jun 22, 2026", icon: "site" },
        { text: "Supervising 3 residents during shifts", icon: "award" }
      ],
      overallStatus: "on_assignment"
    })
  };
};

const STAGES: { id: ProviderStage; label: string }[] = [
  { id: "presented", label: "Presented" },
  { id: "awaiting_confirmation", label: "Awaiting Confirmation" },
  { id: "confirmed", label: "Confirmed" },
  { id: "credentialing", label: "Credentialing" },
  { id: "credentialing_complete", label: "Credentialing Complete" },
  { id: "on_assignment", label: "On Assignment" }
];

export default function KimberlyPresentation() {
  const [activeStage, setActiveStage] = useState<ProviderStage>("presented");
  const [displayStage, setDisplayStage] = useState<ProviderStage>("presented");
  const [isFading, setIsFading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [highlightsExpanded, setHighlightsExpanded] = useState(false);
  const [availabilityExpanded, setAvailabilityExpanded] = useState(false);
  
  const kimberlyStates = useMemo(() => generateKimberlyStates(), []);
  const activeProvider = kimberlyStates[displayStage];

  const handleStageChange = (newStage: ProviderStage) => {
    if (newStage === activeStage) return;
    setActiveStage(newStage);
    setIsFading(true);
    
    setTimeout(() => {
      setIsTransitioning(true);
      setDisplayStage(newStage);
      setIsFading(false);
      
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 150);
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].borderBoxSize[0].blockSize);
    });
    observer.observe(contentRef.current);
    return () => {
      observer.disconnect();
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100/70 to-blue-100/80 flex flex-col items-center pt-16 pb-24 px-4 sm:px-6 overflow-x-hidden">
      
      {/* Seamless Presentation Container */}
      <div className="w-full max-w-[960px] mx-auto flex flex-col relative">
        
        {/* Presentation Header (Extends behind to fill corner gaps) */}
        <div 
          className="px-8 pt-12 pb-24 sm:px-12 bg-gradient-to-t from-black to-slate-800 rounded-t-[40px] border border-b-0 border-slate-800/80 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mb-12"
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          <div className="max-w-xl text-left flex flex-col items-start">
            <span className="text-xs uppercase tracking-[0.16em] font-medium bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text mb-3">
              Design Engineering Concept
            </span>
            <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-[-0.012em] leading-[1.08] sm:leading-[1.08] mb-2 md:mb-0">
              Provider Staffing: Credentialing Lifecycle
            </h1>
          </div>
          <div className="max-w-xs text-left md:text-right">
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              A step-by-step demo showing how a healthcare interface adapts to different lifecycle stages for a single provider.
            </p>
          </div>
        </div>

        {/* Enclosed Gradient Layer */}
        <div 
          className={`w-full rounded-[40px] border border-slate-800/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden z-20 ${isTransitioning ? 'transition-[height] duration-400 ease-in-out' : ''}`}
          style={{ height: containerHeight !== "auto" ? containerHeight + 2 : undefined }}
        >
        <div ref={contentRef} className="w-full p-8 sm:p-12">
          {/* Animated Mesh Background */}
          <div className="absolute inset-0 z-0 bg-[#0a0f1c] pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#2563eb] blur-[120px] opacity-60 animate-mesh-1 mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-[#7c3aed] blur-[140px] opacity-50 animate-mesh-2 mix-blend-screen" />
            <div className="absolute top-[10%] right-[10%] w-[60%] h-[60%] rounded-full bg-[#06b6d4] blur-[100px] opacity-40 animate-mesh-3 mix-blend-screen" />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[30px]" />
          </div>

          {/* Content Layer */}
          <div className="relative z-10">
          {/* State Selection Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {STAGES.map((stage) => {
              const isActive = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageChange(stage.id)}
                  className={`
                    px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300
                    ${isActive 
                      ? "bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105" 
                      : "bg-white/10 text-white/70 border border-white/10 hover:bg-white/20 hover:text-white"}
                  `}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>

          {/* Centered Card View */}
          <div className="w-full max-w-[440px] mx-auto relative min-h-[500px] kimberly-shadow-override">
            <div className={`transition-opacity duration-300 ease-in-out w-full ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              <ProviderCard
                provider={activeProvider}
                isFocused={false}
                anyCardFocused={false}
                onFocus={() => {}}
                onExitFocus={() => {}}
                highlightsExpanded={highlightsExpanded}
                onHighlightsToggle={() => setHighlightsExpanded(!highlightsExpanded)}
                availabilityExpanded={availabilityExpanded}
                onAvailabilityToggle={() => setAvailabilityExpanded(!availabilityExpanded)}
                constrainHeight={false}
              />
            </div>
          </div>
        </div>
        </div>
      </div>
      
      <a 
        href="https://kyledk.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="text-center px-8 pt-16 pb-4 bg-gradient-to-b from-black to-slate-800 rounded-b-[40px] border border-t-0 border-slate-800/80 relative z-10 flex flex-col items-center justify-center -mt-12 cursor-pointer group hover:bg-gradient-to-b hover:from-black hover:to-slate-700 transition-all duration-300"
        style={{ fontFamily: "'Inter Tight', sans-serif" }}
      >
        <p className="text-[10px] sm:text-[12px] text-slate-400 font-medium tracking-wide group-hover:text-white transition-colors duration-300">
          Built by Kyle D.K. — a Design Engineer based in 🍑 ATL
        </p>
      </a>
      </div>

    </div>
  );
}
