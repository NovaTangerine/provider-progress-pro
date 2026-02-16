import { Credential } from "@/types/recruiting";
import { StatusBadge } from "./StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Building2, Calendar, MessageSquare } from "lucide-react";

interface CredentialModalProps {
  credential: Credential | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CredentialModal({ credential, open, onOpenChange }: CredentialModalProps) {
  if (!credential) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">{credential.name}</DialogTitle>
              <Badge variant="outline" className="mt-1 text-xs capitalize">
                {credential.type}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={credential.status} />
          </div>
          {credential.issuingBody && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Issuing Body
              </span>
              <span className="text-sm font-medium">{credential.issuingBody}</span>
            </div>
          )}
          {credential.expirationDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Expiration
              </span>
              <span className="text-sm font-medium">{credential.expirationDate}</span>
            </div>
          )}
          {credential.notes && (
            <div className="space-y-1.5">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Notes
              </span>
              <p className="text-sm bg-muted/50 rounded-md p-3">{credential.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
