import { useState, useRef, useEffect, useCallback, PointerEvent as ReactPointerEvent } from "react";
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
  const [viewMode, setViewMode] = useState<ViewMode>("presentation");
  const [activeStage, setActiveStage] = useState<ProviderStage | null>(null);
  const [cardHighlightsExpanded, setCardHighlightsExpanded] = useState(false);
  const [cardAvailabilityExpanded, setCardAvailabilityExpanded] = useState(false);
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

      <div className="group/grid p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6 animate-fade-in" style={{ gridTemplateRows: 'auto', gridAutoRows: 'auto' }}>
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