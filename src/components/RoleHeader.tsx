import { Role } from "@/types/recruiting";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Calendar, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface RoleHeaderProps {
  role: Role;
}

const urgencyStyles = {
  routine: "bg-muted text-muted-foreground",
  urgent: "bg-[hsl(38_100%_95%)] text-[hsl(38_92%_50%)] dark:bg-[hsl(38_40%_15%)] dark:text-[hsl(38_80%_45%)]",
  critical: "bg-status-red-flag-bg text-status-red-flag"
};

export function RoleHeader({ role }: RoleHeaderProps) {
  const isMobile = useIsMobile();

  const dot = <span className="text-muted-foreground/40 select-none hidden sm:inline">·</span>;

  const details =
  <div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-sm text-muted-foreground`}>
      <span className="flex items-center gap-1.5">
        <Building2 className="w-3.5 h-3.5" />
        {role.facility} · {role.department}
      </span>
      {dot}
      <span className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" />
        {role.location}
      </span>
      {dot}
      <span className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" />
        Target: {role.targetStartDate}
      </span>
      {dot}
      <span className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5" />
        {role.providers.length} candidates
      </span>
    </div>;


  return (
    <div className="border-b border-border bg-card px-6 py-5">
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl text-[#333333] font-semibold tracking-[-0.04em]">{role.title}</h1>
            <Badge className={`text-xs font-medium capitalize ${urgencyStyles[role.urgency]}`}>
              {role.urgency}
            </Badge>
          </div>
          <div className="mt-3 w-fit rounded-lg sm:rounded-none bg-[hsl(0_0%_97.5%)] dark:bg-[hsl(0_0%_12%)] border border-[hsl(0_0%_92%)] dark:border-[hsl(0_0%_18%)] sm:border-y-0 px-4 py-2.5 sm:py-2">
            {details}
          </div>
        </div>
      </div>
    </div>);

}