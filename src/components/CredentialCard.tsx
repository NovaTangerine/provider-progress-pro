import { Credential } from "@/types/recruiting";
import { StatusBadge } from "./StatusBadge";
import { Badge } from "@/components/ui/badge";

interface CredentialCardProps {
  credential: Credential;
  onClick?: (credential: Credential) => void;
}

export function CredentialCard({ credential, onClick }: CredentialCardProps) {
  return (
    <button
      onClick={() => onClick?.(credential)}
      className="w-full max-w-[560px] text-left p-3 rounded-lg border border-border bg-card hover:border-primary/20 hover:bg-muted/50 transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {credential.name}
          </p>
          {credential.issuingBody && (
            <p className="text-xs text-muted-foreground mt-0.5">{credential.issuingBody}</p>
          )}
        </div>
        <StatusBadge status={credential.status} />
      </div>
      {(credential.expirationDate || credential.notes) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {credential.expirationDate && (
            <Badge variant="outline" className="text-[10px] font-normal">
              Exp: {credential.expirationDate}
            </Badge>
          )}
          {credential.notes && (
            <Badge variant="secondary" className="text-[10px] font-normal max-w-[200px] truncate">
              {credential.notes}
            </Badge>
          )}
        </div>
      )}
    </button>
  );
}
