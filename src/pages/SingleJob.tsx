import { useState, useRef, useEffect, useCallback, useMemo, PointerEvent as ReactPointerEvent } from "react";
import { mockRole } from "@/data/mockData";
import { RoleHeader } from "@/components/RoleHeader";
import { ProviderRow } from "@/components/ProviderRow";
import { ProviderCard } from "@/components/ProviderCard";
import { StageToggle } from "@/components/StageToggle";
import { LayoutList, LayoutGrid, Link, Unlink, Focus, X } from "lucide-react";
import { ProviderStage } from "@/types/recruiting";
import { useIsMobile } from "@/hooks/use-mobile";

const STAGE_LABELS: Record<ProviderStage, string> = {
  presented: "Presented",
  awaiting_confirmation: "Awaiting Confirmation",
  confirmed: "Confirmed",
  credentialing: "Credentialing",
  credentialing_complete: "Credentialing Complete",
  on_assignment: "On Assignment"
};

const STAGE_HEADER_LABELS: Record<ProviderStage, string> = {
  presented: "Providers Presented",
  awaiting_confirmation: "Providers Awaiting Confirmation",
  confirmed: "Providers Confirmed",
  credentialing: "Providers in Credentialing",
  credentialing_complete: "Credentialing Complete",
  on_assignment: "Providers On Assignment"
};

type ViewMode = "list" | "presentation";

const SingleJob = () => {
  const isMobile = useIsMobile();
  
  // Generate 4 versions of Kimberly Pine for the different stages
  // Remove useMemo so it forces a re-eval on fast refresh
  const singleRole = (() => {
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
    
    // Deep clone helper
    const cloneProvider = (stage: "presented" | "awaiting_confirmation" | "confirmed" | "credentialing" | "credentialing_complete" | "on_assignment", overrides?: any) => {
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

    const kimPresented = cloneProvider("presented", {
      overallStatus: "presented",
      fitScore: 82,
      fitEvaluation: "Good Fit"
    });
    const kimAwaitingConfirmation = cloneProvider("awaiting_confirmation", {
      overallStatus: "awaiting_confirmation"
    });
    const kimConfirmed = cloneProvider("confirmed", {
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
    });
    const kimCredentialing = cloneProvider("credentialing");
    const kimCredentialingComplete = cloneProvider("credentialing_complete", {
      overallStatus: "completed",
      availability: { startDate: "2026-07-15" },
      credentials: baseKimberly.credentials.map(c => ({
        ...c,
        status: "completed",
        notes: c.status === "completed" ? c.notes : "Requirement met"
      }))
    });
    const kimOnAssignment = cloneProvider("on_assignment", {
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
    });

    return {
      ...mockRole,
      providers: [kimPresented, kimAwaitingConfirmation, kimConfirmed, kimCredentialing, kimCredentialingComplete, kimOnAssignment]
    };
  })();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("presentation");
  const [activeStage, setActiveStage] = useState<ProviderStage | null>(null);
  const [cardSyncMode, setCardSyncMode] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [focusedProviderId, setFocusedProviderId] = useState<string | null>(null);
  // Sync mode (all cards together)
  const [expandedHighlightRows, setExpandedHighlightRows] = useState<number[]>([]);
  const [expandedAvailabilityRows, setExpandedAvailabilityRows] = useState<number[]>([]);
  // Individual mode (one card at a time)
  const [expandedHighlightId, setExpandedHighlightId] = useState<string | null>(null);
  const [expandedAvailabilityId, setExpandedAvailabilityId] = useState<string | null>(null);
  const providerThRef = useRef<HTMLTableCellElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [headerPadding, setHeaderPadding] = useState(0);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }, []);

  const scrubToPosition = useCallback((clientX: number) => {
    const bar = progressBarRef.current;
    const el = scrollRef.current;
    if (!bar || !el) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = ratio * maxScroll;
  }, []);

  const handleBarPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    scrubToPosition(e.clientX);
  }, [scrubToPosition]);

  const handleBarPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0) return;
    scrubToPosition(e.clientX);
  }, [scrubToPosition]);

  useEffect(() => {
    setViewMode("presentation");
  }, []);

  const [numCols, setNumCols] = useState(3);
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1024) setNumCols(3);
      else if (window.innerWidth >= 768) setNumCols(2);
      else setNumCols(1);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const handleFocusProvider = useCallback((id: string) => {
    setFocusedProviderId(id);
    setFocusMode(true);
    setCardSyncMode(false);
  }, []);

  const unfocusCard = useCallback(() => {
    setFocusedProviderId(null);
  }, []);

  const exitFocus = useCallback(() => {
    setFocusedProviderId(null);
    setFocusMode(false);
  }, []);

  const filteredProviders = useMemo(() => activeStage ?
    singleRole.providers.filter((p) => p.stage === activeStage) :
    singleRole.providers, [activeStage, singleRole]);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!focusedProviderId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        unfocusCard();
        return;
      }
      
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const currentIndex = filteredProviders.findIndex((p) => p.id === focusedProviderId);
        if (currentIndex !== -1) {
          let nextIndex = e.key === "ArrowLeft" ? currentIndex - 1 : currentIndex + 1;
          if (nextIndex < 0) nextIndex = filteredProviders.length - 1;
          if (nextIndex >= filteredProviders.length) nextIndex = 0;
          
          const nextProviderId = filteredProviders[nextIndex].id;
          setFocusedProviderId(nextProviderId);
          
          // Debounce the scroll to wait for the user to settle
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          
          scrollTimeoutRef.current = setTimeout(() => {
            const el = document.getElementById(`provider-card-${nextProviderId}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              const windowCenter = window.innerHeight / 2;
              const elCenter = rect.top + rect.height / 2;
              
              if (Math.abs(elCenter - windowCenter) > window.innerHeight * 0.25) {
                const startPos = window.scrollY;
                const targetPos = startPos + rect.top - (window.innerHeight / 2) + (rect.height / 2);
                const duration = 750; 
                const startTime = performance.now();
                
                // easeInOutQuint for a much smoother, heavier premium feel
                const easeInOutQuint = (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
                
                const scrollAnim = (currentTime: number) => {
                  const elapsed = currentTime - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  
                  window.scrollTo(0, startPos + (targetPos - startPos) * easeInOutQuint(progress));
                  
                  if (progress < 1) {
                    requestAnimationFrame(scrollAnim);
                  }
                };
                
                requestAnimationFrame(scrollAnim);
              }
            }
          }, 180);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedProviderId, unfocusCard, filteredProviders]);

  const toggleFocusMode = useCallback(() => {
    if (focusMode) {
      exitFocus();
    } else {
      setFocusMode(true);
      setCardSyncMode(false);
    }
  }, [focusMode, exitFocus]);

  useEffect(() => {
    const measure = () => {
      if (providerThRef.current && containerRef.current) {
        const thRect = providerThRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const paddingLeft = parseFloat(getComputedStyle(providerThRef.current).paddingLeft) || 0;
        setHeaderPadding(thRect.left - containerRect.left + paddingLeft);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [viewMode]);


  const toggleProvider = (id: string) => {
    const isExpanding = expandedId !== id;
    if (isExpanding && isMobile && scrollRef.current) {
      // Reset scroll before React re-renders the expanded row,
      // so the new content appears at the start position seamlessly.
      scrollRef.current.scrollLeft = 0;
      setScrollProgress(0);
    }
    setExpandedId((prev) => prev === id ? null : id);
  };



  return (
    <div ref={containerRef} className="min-h-screen bg-background max-w-[1440px] mx-auto">
      <RoleHeader role={singleRole} />

      {/* View toggle bar */}
      <div className="border-b border-border bg-[hsl(210_18%_98.5%)] px-6 py-2.5 flex items-center justify-between shadow-[0_2px_12px_-2px_rgb(0_0_0_/0.04)]">
        <div className="flex items-center gap-4">
          <StageToggle
            providers={singleRole.providers}
            activeStage={activeStage}
            onStageChange={setActiveStage} />
        </div>
        <div className="flex items-center gap-3">
          {viewMode === "presentation" && !isMobile && (
            <>
              <button
                onClick={toggleFocusMode}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all duration-150 ${
                  focusMode
                    ? "text-primary/80 bg-primary/5"
                    : "text-muted-foreground/70"
                } hover:text-foreground/60`}
                title="Ctrl+Click a card to focus on it"
              >
                <Focus className="w-3 h-3" />
                Focus
              </button>
              <button
                onClick={() => {
                  if (focusMode) {
                    exitFocus();
                  }
                  setCardSyncMode((v) => !v);
                }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all duration-150 ${
                  cardSyncMode
                    ? "text-muted-foreground/70"
                    : "text-muted-foreground/70"
                } hover:text-foreground/60`}
                title={cardSyncMode ? "All cards expand together" : "Only one card expands at a time"}
              >
                {cardSyncMode ? <Link className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                {cardSyncMode ? "Synced" : "Individual"}
              </button>
            </>
          )}
          <div className="inline-flex items-center rounded-md border border-border bg-muted p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
              viewMode === "list" ?
              "bg-card text-foreground shadow-sm" :
              "text-muted-foreground hover:text-foreground"}`
              }>
              <LayoutList className="w-3.5 h-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode("presentation")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
              viewMode === "presentation" ?
              "bg-card text-foreground shadow-sm" :
              "text-muted-foreground hover:text-foreground"}`
              }>
              <LayoutGrid className="w-3.5 h-3.5" />
              Presentation
            </button>
          </div>
        </div>
      </div>

      {viewMode === "list" &&
      <div className={`pt-4 pb-3 flex items-center ${isMobile ? 'px-7' : 'pr-6 gap-10'}`} style={{ paddingLeft: isMobile ? undefined : (headerPadding > 0 ? `${headerPadding}px` : 'calc(40px + 2rem)') }}>
          {!isMobile && (
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                {activeStage ? STAGE_HEADER_LABELS[activeStage] : "All Providers"}
              </h2>
              <span className="text-xs text-muted-foreground font-medium">
                {filteredProviders.length}
              </span>
            </div>
          )}
          {isMobile && (
            <div
              ref={progressBarRef}
              className="flex-1 h-4 flex items-center cursor-pointer touch-none"
              onPointerDown={handleBarPointerDown}
              onPointerMove={handleBarPointerMove}
            >
              <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-muted-foreground/40 transition-transform duration-100 origin-left"
                  style={{ width: '30%', transform: `translateX(${scrollProgress * 233}%)` }}
                />
              </div>
            </div>
          )}
        </div>
      }

      {viewMode === "list" ?
      <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[900px]" onMouseLeave={() => setHoveredColumn(null)}>
            <thead>
              <tr className="bg-muted text-muted-foreground [&>th]:bg-muted">
                <th className="pl-3 pr-1 md:px-4 py-2.5 w-[32px] md:w-[40px] sticky left-0 z-20 bg-muted" />
                <th ref={providerThRef} className={`px-2 md:px-4 py-2.5 text-left text-xs uppercase tracking-wider w-[20%] min-w-[180px] sticky left-[32px] md:left-[40px] z-20 bg-muted transition-all duration-150 ${hoveredColumn === 1 ? "font-medium text-foreground/70" : "font-normal"}`}>
                  Provider
                </th>
                <th className={`px-4 py-2.5 text-left text-xs uppercase tracking-wider w-[12%] min-w-[140px] transition-all duration-150 ${hoveredColumn === 2 ? "font-medium text-foreground/70" : "font-normal"}`}>
                  Status
                </th>
                <th className={`px-4 py-2.5 text-left text-xs uppercase tracking-wider w-[14%] min-w-[140px] transition-all duration-150 ${hoveredColumn === 3 ? "font-medium text-foreground/70" : "font-normal"}`}>
                  Credentials
                </th>
                <th className={`px-4 py-2.5 text-left text-xs uppercase tracking-wider w-[12%] min-w-[120px] transition-all duration-150 ${hoveredColumn === 4 ? "font-medium text-foreground/70" : "font-normal"}`}>
                  Type
                </th>
                <th className={`px-4 py-2.5 text-left text-xs uppercase tracking-wider w-[15%] min-w-[130px] transition-all duration-150 ${hoveredColumn === 5 ? "font-medium text-foreground/70" : "font-normal"}`}>
                  Available
                </th>
                <th className={`px-4 py-2.5 text-left text-xs uppercase tracking-wider min-w-[160px] transition-all duration-150 ${hoveredColumn === 6 ? "font-medium text-foreground/70" : "font-normal"}`}>
                  Current Org
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((provider) =>
            <ProviderRow
              key={provider.id}
              provider={provider}
              isExpanded={expandedId === provider.id}
              onToggle={() => toggleProvider(provider.id)}
              onColumnHover={setHoveredColumn} />

            )}
            </tbody>
          </table>
        </div> :

      <>
        {/* Focus mode overlay */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-[3px] backdrop-saturate-150 z-50 flex flex-col items-center transition-[opacity,backdrop-filter] duration-[480ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${focusedProviderId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={unfocusCard}
        >
          <div className="pt-4 text-center pointer-events-none">
            <p className="text-white/70 text-sm font-medium">
              Focus Mode — press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 text-xs font-mono">Esc</kbd> or click overlay to go back
            </p>
          </div>
        </div>

        {/* Focus mode inline banner */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${focusMode ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="mx-6 mt-5 mb-0 px-4 py-3 rounded-lg border border-border bg-muted/50 flex items-center gap-3">
            <Focus className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
              You're in focus mode. Click a provider's card to focus and remove other distractions.{' '}
              <button onClick={exitFocus} className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors">
                Exit focus mode
              </button>
            </p>
            <button
              onClick={exitFocus}
              className="text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0 p-1 rounded hover:bg-accent"
              aria-label="Exit focus mode"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className={`group/grid pt-[calc(1.5rem+8px)] p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 ${cardSyncMode ? 'gap-y-0' : 'gap-y-6'} animate-fade-in relative`} data-focus-active={focusedProviderId ? "true" : undefined} style={{ gridTemplateRows: cardSyncMode ? 'auto' : undefined, gridAutoRows: cardSyncMode ? 'auto' : undefined }}>
          {filteredProviders.map((provider, index) => {
            const rowIndex = Math.floor(index / numCols);
            return (
              <ProviderCard
                key={provider.id}
                provider={provider}
                constrainHeight={!cardSyncMode}
                focusModeActive={focusMode}
                isFocused={focusedProviderId === provider.id}
                anyCardFocused={!!focusedProviderId}
                onFocus={handleFocusProvider}
                onExitFocus={unfocusCard}
                highlightsExpanded={cardSyncMode ? expandedHighlightRows.includes(rowIndex) : expandedHighlightId === provider.id}
                onHighlightsToggle={() => {
                  if (cardSyncMode) {
                    setExpandedHighlightRows(prev => 
                      prev.includes(rowIndex) ? prev.filter(r => r !== rowIndex) : [...prev, rowIndex]
                    );
                  } else {
                    setExpandedHighlightId(prev => prev === provider.id ? null : provider.id);
                  }
                }}
                availabilityExpanded={cardSyncMode ? expandedAvailabilityRows.includes(rowIndex) : expandedAvailabilityId === provider.id}
                onAvailabilityToggle={() => {
                  if (cardSyncMode) {
                    setExpandedAvailabilityRows(prev => 
                      prev.includes(rowIndex) ? prev.filter(r => r !== rowIndex) : [...prev, rowIndex]
                    );
                  } else {
                    setExpandedAvailabilityId(prev => prev === provider.id ? null : provider.id);
                  }
                }}
              />
            );
          })}
        </div>
      </>
      }
    </div>);

};

export default SingleJob;