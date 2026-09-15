import { useEffect, useState } from 'react';
import {
  Siren, MapPin, Navigation, CheckCircle2, Eye,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { MapPlaceholder } from '@/components/ui/MapPlaceholder';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/StatCard';
import { apiGetAllEmergencies, apiUpdateEmergencyStatus } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import type { EmergencyReport, StatusName } from '@/types/models';

export function ResponderEmergencies() {
  const { user } = useAuth();
  const toast = useToast();
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [viewReport, setViewReport] = useState<EmergencyReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiGetAllEmergencies().then((all) => {
      setReports(all.filter((r) => ['RESPONDER_ASSIGNED', 'IN_PROGRESS', 'DISPATCHED'].includes(r.status_name!)));
    });
  }, []);

  const refresh = () => apiGetAllEmergencies().then((all) => {
    setReports(all.filter((r) => ['RESPONDER_ASSIGNED', 'IN_PROGRESS', 'DISPATCHED'].includes(r.status_name!)));
  });

  const handleAction = async (r: EmergencyReport, status: StatusName, label: string) => {
    setLoading(true);
    await apiUpdateEmergencyStatus(r.emergency_id, status, user?.name ?? 'Responder', label);
    setLoading(false);
    toast(label);
    refresh();
  };

  return (
    <DashboardLayout title="My Emergencies">
      <p className="text-sm text-neutral-500 mb-4">All emergencies assigned to you.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.length === 0 ? (
          <Card className="p-12 text-center md:col-span-2">
            <Siren className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="text-neutral-400">No assigned emergencies.</p>
          </Card>
        ) : (
          reports.map((r) => (
            <Card key={r.emergency_id} className="p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono font-bold text-neutral-900">#{String(r.emergency_id).padStart(3, '0')}</p>
                  <p className="text-sm text-neutral-500">{r.type_name}</p>
                </div>
                <StatusBadge status={r.status_name!} />
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                <MapPin className="w-4 h-4 text-neutral-400" />
                {r.location?.area}, {r.location?.city}
              </div>

              <p className="text-sm text-neutral-600 leading-snug mb-3 line-clamp-2">{r.description}</p>

              <div className="flex items-center justify-between mb-4">
                <PriorityBadge priority={r.priority} />
                <span className="text-xs text-neutral-500 font-mono">{r.vehicle_number}</span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setViewReport(r)} className="btn-ghost text-sm flex-1">
                  <Eye className="w-4 h-4" /> Details
                </button>
                {r.status_name === 'DISPATCHED' && (
                  <button onClick={() => handleAction(r, 'RESPONDER_ASSIGNED', 'Assignment accepted')} disabled={loading}
                    className="btn-primary text-sm flex-1"><CheckCircle2 className="w-4 h-4" /> Accept</button>
                )}
                {r.status_name === 'RESPONDER_ASSIGNED' && (
                  <button onClick={() => handleAction(r, 'IN_PROGRESS', 'Response started')} disabled={loading}
                    className="btn-primary text-sm flex-1"><Navigation className="w-4 h-4" /> Start</button>
                )}
                {r.status_name === 'IN_PROGRESS' && (
                  <button onClick={() => handleAction(r, 'RESOLVED', 'Emergency resolved')} disabled={loading}
                    className="btn bg-success-600 text-white hover:bg-success-700 text-sm flex-1"><CheckCircle2 className="w-4 h-4" /> Resolve</button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!viewReport} onClose={() => setViewReport(null)} title="Emergency Details" size="lg">
        {viewReport && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={viewReport.status_name!} />
              <PriorityBadge priority={viewReport.priority} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400">Type</p>
                <p className="font-semibold text-neutral-800">{viewReport.type_name}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400">Citizen</p>
                <p className="font-semibold text-neutral-800">{viewReport.citizen_name}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400">Vehicle</p>
                <p className="font-semibold font-mono text-neutral-800">{viewReport.vehicle_number ?? '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400">Department</p>
                <p className="font-semibold text-neutral-800">{viewReport.department_name ?? '—'}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50">
              <p className="text-xs text-neutral-400 font-medium">Description</p>
              <p className="text-sm text-neutral-700 mt-1">{viewReport.description}</p>
            </div>
            {viewReport.location && <MapPlaceholder location={viewReport.location} height="h-48" />}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
