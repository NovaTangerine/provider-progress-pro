import { useState } from "react";
import { mockRole } from "@/data/mockData";
import { RoleHeader } from "@/components/RoleHeader";
import { ProviderRow } from "@/components/ProviderRow";
import { ProviderCard } from "@/components/ProviderCard";
import { StageToggle } from "@/components/StageToggle";
import { LayoutList, LayoutGrid } from "lucide-react";
import { ProviderStage } from "@/types/recruiting";

type ViewMode = "list" | "presentation";

const Index = () => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeStage, setActiveStage] = useState<ProviderStage | null>(null);

  const toggleProvider = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredProviders = activeStage
    ? mockRole.providers.filter((p) => p.stage === activeStage)
    : mockRole.providers;

  return (
    <div className="min-h-screen bg-background">
      <RoleHeader role={mockRole} />

      {/* View toggle bar */}
      <div className="border-b border-border bg-card px-6 py-2.5 flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">
          {filteredProviders.length} provider{filteredProviders.length !== 1 ? "s" : ""}
        </p>
        <div className="inline-flex items-center rounded-md border border-border bg-muted p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
              viewMode === "list"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            List
          </button>
          <button
            onClick={() => setViewMode("presentation")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
              viewMode === "presentation"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Presentation
          </button>
        </div>
      </div>

      {viewMode === "list" && (
        <div className="border-b border-border bg-card px-6 py-2.5">
          <StageToggle
            providers={mockRole.providers}
            activeStage={activeStage}
            onStageChange={setActiveStage}
          />
        </div>
      )}

      {viewMode === "list" ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-grid-header text-grid-header-foreground">
                <th className="px-4 py-2.5 w-8" />
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Credentials
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Available
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Current Org
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((provider) => (
                <ProviderRow
                  key={provider.id}
                  provider={provider}
                  isExpanded={expandedIds.has(provider.id)}
                  onToggle={() => toggleProvider(provider.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
