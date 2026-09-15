import type { StatusName } from '@/types/models';
import { Check, X } from 'lucide-react';

const allStatuses: StatusName[] = [
  'REPORTED', 'VERIFIED', 'DISPATCHED', 'RESPONDER_ASSIGNED', 'IN_PROGRESS', 'RESOLVED',
];

const statusLabels: Record<string, string> = {
  REPORTED: 'Reported',
  VERIFIED: 'Verified',
  DISPATCHED: 'Dispatched',
  RESPONDER_ASSIGNED: 'Responder Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
};

export function StatusTimeline({ currentStatus }: { currentStatus: StatusName }) {
  if (currentStatus === 'REJECTED') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-100 border border-neutral-200">
        <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center">
          <X className="w-5 h-5 text-neutral-600" />
        </div>
        <div>
          <p className="font-semibold text-neutral-700">Report Rejected</p>
          <p className="text-sm text-neutral-500">This emergency report was rejected as invalid.</p>
        </div>
      </div>
    );
  }

  const currentIdx = allStatuses.indexOf(currentStatus);

  return (
    <div className="flex flex-col gap-0">
      {allStatuses.map((status, idx) => {
        const isDone = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={status} className="flex gap-4">
            {/* Left: circle + line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition ${
                  isDone
                    ? isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : 'bg-success-500 text-white'
                    : 'bg-neutral-200 text-neutral-400'
                }`}
              >
                {isDone && !isCurrent ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
              </div>
              {idx < allStatuses.length - 1 && (
                <div className={`w-0.5 h-10 ${idx < currentIdx ? 'bg-success-500' : 'bg-neutral-200'}`} />
              )}
            </div>
            {/* Right: label */}
            <div className="pt-1.5 pb-8">
              <p className={`font-semibold text-sm ${isDone ? 'text-neutral-800' : 'text-neutral-400'}`}>
                {statusLabels[status]}
              </p>
              {isCurrent && (
                <span className="badge bg-primary-100 text-primary-700 mt-1">Current</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
