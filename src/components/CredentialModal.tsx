import { Credential, CredentialWorkflowStep, WorkflowStepStatus } from "@/types/recruiting";
import { StatusBadge } from "./StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Building2,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  User,
  Mail,
  Phone,
} from "lucide-react";

interface CredentialModalProps {
  credential: Credential | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEP_STATUS_CONFIG: Record<WorkflowStepStatus, { icon: React.ComponentType<{ className?: string }>; className: string; lineClassName: string }> = {
  completed: { icon: CheckCircle2, className: "text-status-completed", lineClassName: "bg-status-completed" },
  in_progress: { icon: Loader2, className: "text-status-in-progress", lineClassName: "bg-status-in-progress" },
  pending: { icon: Circle, className: "text-muted-foreground/40", lineClassName: "bg-border" },
  blocked: { icon: AlertTriangle, className: "text-status-red-flag", lineClassName: "bg-status-red-flag" },
};

function WorkflowStep({ step, isLast }: { step: CredentialWorkflowStep; isLast: boolean }) {
  const config = STEP_STATUS_CONFIG[step.status];
  const Icon = config.icon;

  return (
    <div className="flex gap-3 relative">
      {/* Timeline line */}
      {!isLast && (
        <div className={`absolute left-[9px] top-[22px] w-[2px] h-[calc(100%-6px)] ${config.lineClassName} opacity-40`} />
      )}
      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        <Icon className={`w-[18px] h-[18px] ${config.className}`} />
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <p className="text-sm font-medium text-foreground leading-tight">{step.label}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
          {step.assignedTo && (
            <span className="text-xs text-muted-foreground">{step.assignedTo}</span>
          )}
          {step.completedDate && (
            <span className="text-xs text-muted-foreground">
              {new Date(step.completedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
          {!step.completedDate && step.estimatedDate && (
            <span className="text-xs text-muted-foreground italic">
              Est. {new Date(step.estimatedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
        </div>
        {step.notes && (
          <p className="text-xs text-muted-foreground mt-1 bg-muted/50 rounded px-2 py-1">{step.notes}</p>
        )}
      </div>
    </div>
  );
}

export function CredentialModal({ credential, open, onOpenChange }: CredentialModalProps) {
  if (!credential) return null;

  const workflow = credential.workflow;
  const completedSteps = workflow?.steps.filter(s => s.status === "completed").length ?? 0;
  const totalSteps = workflow?.steps.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
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

        {/* Basic info */}
        <div className="space-y-3">
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

        {/* Workflow section */}
        {workflow && (
          <>
            <Separator />
            <div className="space-y-4">
              {/* Workflow header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Approval Workflow
                  </h4>
                  <span className="text-xs text-muted-foreground font-medium">
                    {completedSteps}/{totalSteps} steps
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: totalSteps > 0 ? `${(completedSteps / totalSteps) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              {/* Key dates */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {workflow.estimatedApprovalDate && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Est. Approval: </span>
                    <span className="font-medium text-foreground">
                      {new Date(workflow.estimatedApprovalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                )}
                {workflow.actualApprovalDate && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Approved: </span>
                    <span className="font-medium text-status-completed">
                      {new Date(workflow.actualApprovalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                )}
                {workflow.expirationDate && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Expires: </span>
                    <span className="font-medium text-foreground">
                      {new Date(workflow.expirationDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>

              {/* Steps timeline */}
              <div>
                {workflow.steps.map((step, i) => (
                  <WorkflowStep key={step.id} step={step} isLast={i === workflow.steps.length - 1} />
                ))}
              </div>

              {/* Contacts */}
              {workflow.contacts.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contacts
                  </h5>
                  <div className="space-y-2">
                    {workflow.contacts.map((contact, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-muted/30 rounded-md px-3 py-2">
                        <User className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground leading-tight">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contact.role && `${contact.role} · `}{contact.organization}
                          </p>
                          <div className="flex flex-wrap gap-x-3 mt-0.5">
                            {contact.email && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {contact.email}
                              </span>
                            )}
                            {contact.phone && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {contact.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
