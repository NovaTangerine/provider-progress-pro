import { useState, useRef, useEffect } from "react";
import { mockRole } from "@/data/mockData";
import { RoleHeader } from "@/components/RoleHeader";
import { ProviderRow } from "@/components/ProviderRow";
import { ProviderCard } from "@/components/ProviderCard";
import { StageToggle } from "@/components/StageToggle";
import { LayoutList, LayoutGrid } from "lucide-react";
import { ProviderStage } from "@/types/recruiting";
import { useIsMobile } from "@/hooks/use-mobile";

const STAGE_LABELS: Record<ProviderStage, string> = {
  presented: "Presented",
  confirmed: "Confirmed",
  credentialing: "Credentialing",
  on_assignment: "On Assignment"
};

const STAGE_HEADER_LABELS: Record<ProviderStage, string> = {
  presented: "Providers Presented",
  confirmed: "Providers Confirmed",
  credentialing: "Providers in Credentialing",
  on_assignment: "Providers On Assignment"
};

type ViewMode = "list" | "presentation";

const Index = () => {
  const isMobile = useIsMobile();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? "presentation" : "list");
  const [activeStage, setActiveStage] = useState<ProviderStage | null>(null);
  const [cardHighlightsExpanded, setCardHighlightsExpanded] = useState(false);
  const [cardAvailabilityExpanded, setCardAvailabilityExpanded] = useState(false);
  const providerThRef = useRef<HTMLTableCellElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [headerPadding, setHeaderPadding] = useState(0);

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
    setExpandedId((prev) => prev === id ? null : id);
  };

  const filteredProviders = activeStage ?
  mockRole.providers.filter((p) => p.stage === activeStage) :
  mockRole.providers;

  return (
    <div ref={containerRef} className="min-h-screen bg-background max-w-[1440px] mx-auto">
      <RoleHeader role={mockRole} />

      {/* View toggle bar */}
      <div className="border-b border-border bg-card px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StageToggle
            providers={mockRole.providers}
            activeStage={activeStage}
            onStageChange={setActiveStage} />
        </div>
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

      {viewMode === "list" &&
      <div className="pr-6 pt-4 pb-3 flex items-center gap-2" style={{ paddingLeft: headerPadding > 0 ? `${headerPadding}px` : 'calc(40px + 2rem)' }}>
          <h2 className="text-sm font-semibold text-foreground">
            {activeStage ? STAGE_HEADER_LABELS[activeStage] : "All Providers"}
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            {filteredProviders.length}
          </span>
        </div>
      }

      {viewMode === "list" ?
      <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-muted text-muted-foreground [&>th]:bg-muted">
                <th className="px-4 py-2.5 w-[40px] sticky left-0 z-20 bg-muted" />
                <th ref={providerThRef} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider w-[20%] min-w-[180px] sticky left-[40px] z-20 bg-muted">
                  Provider
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider w-[12%] min-w-[120px]">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider w-[14%] min-w-[140px]">
                  Credentials
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider w-[12%] min-w-[120px]">
                  Type
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider w-[15%] min-w-[130px]">
                  Available
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider min-w-[160px]">
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
              onToggle={() => toggleProvider(provider.id)} />

            )}
            </tbody>
          </table>
        </div> :

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6 animate-fade-in" style={{ gridTemplateRows: 'auto', gridAutoRows: 'auto' }}>
          {filteredProviders.map((provider) =>
        <ProviderCard
          key={provider.id}
          provider={provider}
          highlightsExpanded={cardHighlightsExpanded}
          onHighlightsToggle={() => setCardHighlightsExpanded(prev => !prev)}
          availabilityExpanded={cardAvailabilityExpanded}
          onAvailabilityToggle={() => setCardAvailabilityExpanded(prev => !prev)}
        />
        )}
        </div>
      }
    </div>);

};

export default Index;