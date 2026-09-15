import type { StatusName, Severity, Priority } from '@/types/models';

const statusConfig: Record<StatusName, { label: string; classes: string }> = {
  REPORTED:          { label: 'Reported',          classes: 'bg-info-100 text-info-700' },
  VERIFIED:          { label: 'Verified',           classes: 'bg-warning-100 text-warning-700' },
  DISPATCHED:        { label: 'Dispatched',         classes: 'bg-accent-100 text-accent-700' },
  RESPONDER_ASSIGNED:{ label: 'Responder Assigned', classes: 'bg-primary-100 text-primary-700' },
  IN_PROGRESS:       { label: 'In Progress',        classes: 'bg-primary-100 text-primary-700' },
  RESOLVED:          { label: 'Resolved',           classes: 'bg-success-100 text-success-700' },
  REJECTED:          { label: 'Rejected',           classes: 'bg-neutral-200 text-neutral-600' },
};

const severityConfig: Record<Severity, { classes: string }> = {
  LOW:      { classes: 'bg-success-100 text-success-700' },
  MEDIUM:   { classes: 'bg-warning-100 text-warning-700' },
  HIGH:     { classes: 'bg-accent-100 text-accent-700' },
  CRITICAL: { classes: 'bg-error-100 text-error-700' },
};

const priorityConfig: Record<Priority, { classes: string }> = {
  LOW:      { classes: 'bg-success-100 text-success-700' },
  NORMAL:   { classes: 'bg-info-100 text-info-700' },
  HIGH:     { classes: 'bg-accent-100 text-accent-700' },
  CRITICAL: { classes: 'bg-error-100 text-error-700' },
};

export function StatusBadge({ status }: { status: StatusName }) {
  const cfg = statusConfig[status];
  return <span className={`badge ${cfg.classes}`}>{cfg.label}</span>;
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const cfg = severityConfig[severity];
  return <span className={`badge ${cfg.classes}`}>{severity}</span>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  return <span className={`badge ${cfg.classes}`}>{priority}</span>;
}
