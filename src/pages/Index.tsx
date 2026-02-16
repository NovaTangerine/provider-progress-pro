import { useState } from "react";
import { mockRole } from "@/data/mockData";
import { RoleHeader } from "@/components/RoleHeader";
import { ProviderRow } from "@/components/ProviderRow";

const Index = () => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleProvider = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleHeader role={mockRole} />
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
            {mockRole.providers.map((provider) => (
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
    </div>
  );
};

export default Index;
