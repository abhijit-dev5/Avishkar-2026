import { useEffect, useState } from 'react';
import {
  Siren, MapPin, Truck, Activity, CheckCircle2, Navigation,
  Clock, type LucideIcon,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { MapPlaceholder } from '@/components/ui/MapPlaceholder';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { apiGetAllEmergencies, apiUpdateEmergencyStatus } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import type { EmergencyReport, StatusName } from '@/types/models';

export function ResponderDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiGetAllEmergencies().then((all) => {
      setReports(all.filter((r) => ['RESPONDER_ASSIGNED', 'IN_PROGRESS', 'DISPATCHED'].includes(r.status_name!)));
    });
  }, []);

  const refresh = () => apiGetAllEmergencies().then((all) => {
    setReports(all.filter((r) => ['RESPONDER_ASSIGNED', 'IN_PROGRESS', 'DISPATCHED'].includes(r.status_name!)));
  });

  const current = reports.find((r) => r.status_name === 'IN_PROGRESS') ?? reports[0] ?? null;
  const myAssigned = reports.length;
  const inProgress = reports.filter((r) => r.status_name === 'IN_PROGRESS').length;

  const handleAction = async (r: EmergencyReport, status: StatusName, label: string) => {
    setLoading(true);
    await apiUpdateEmergencyStatus(r.emergency_id, status, user?.name ?? 'Responder', label);
    setLoading(false);
    toast(label);
    refresh();
  };

  return (
    <DashboardLayout title="Responder Dashboard">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-neutral-900">Welcome, {user?.name ?? 'Responder'}</h2>
        <p className="text-sm text-neutral-500">View your assigned emergencies and update response status.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="My Assigned" value={myAssigned} icon={Siren} color="info" />
        <StatCard label="In Progress" value={inProgress} icon={Activity} color="primary" />
        <StatCard label="Resolved" value={0} icon={CheckCircle2} color="success" />
        <StatCard label="Available Vehicles" value={8} icon={Truck} color="accent" />
      </div>

      {/* Current Emergency */}
      {current ? (
        <Card className="mb-6">
          <CardHeader title="Current Emergency" subtitle={`Emergency #${String(current.emergency_id).padStart(3, '0')}`} />
          <div className="p-5">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <StatusBadge status={current.status_name!} />
              <PriorityBadge priority={current.priority} />
              <span className="text-sm text-neutral-500">{current.type_name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-neutral-50">
                  <p className="text-xs text-neutral-400 font-medium">Location</p>
                  <p className="text-sm font-semibold text-neutral-800">{current.location?.address}</p>
                  <p className="text-xs text-neutral-500">{current.location?.area}, {current.location?.city} - {current.location?.pincode}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Vehicle</p>
                    <p className="text-sm font-semibold font-mono text-neutral-800">{current.vehicle_number ?? '—'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Priority</p>
                    <p className="text-sm font-semibold text-neutral-800">{current.priority}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50">
                  <p className="text-xs text-neutral-400 font-medium">Description</p>
                  <p className="text-sm text-neutral-700 mt-1">{current.description}</p>
                </div>
              </div>
              <div>
                {current.location && <MapPlaceholder location={current.location} height="h-48" />}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-neutral-100">
              {current.status_name === 'RESPONDER_ASSIGNED' && (
                <button onClick={() => handleAction(current, 'IN_PROGRESS', 'Response started — en route to location')} disabled={loading}
                  className="btn-primary"><Navigation className="w-4 h-4" /> Start Response</button>
              )}
              {current.status_name === 'IN_PROGRESS' && (
                <>
                  <button onClick={() => handleAction(current, 'IN_PROGRESS', 'Arrived on scene')} disabled={loading}
                    className="btn-info"><MapPin className="w-4 h-4" /> Arrived On Scene</button>
                  <button onClick={() => handleAction(current, 'RESOLVED', 'Emergency resolved by responder')} disabled={loading}
                    className="btn bg-success-600 text-white hover:bg-success-700"><CheckCircle2 className="w-4 h-4" /> Mark Resolved</button>
                </>
              )}
              {current.status_name === 'DISPATCHED' && (
                <button onClick={() => handleAction(current, 'RESPONDER_ASSIGNED', 'Assignment accepted')} disabled={loading}
                  className="btn-primary"><CheckCircle2 className="w-4 h-4" /> Accept Assignment</button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center mb-6">
          <Clock className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-neutral-400">No active emergency assigned to you right now.</p>
        </Card>
      )}

      {/* All assigned emergencies */}
      <Card>
        <CardHeader title="My Assigned Emergencies" subtitle={`${reports.length} total`} />
        <div className="divide-y divide-neutral-100">
          {reports.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-sm">No assigned emergencies.</div>
          ) : (
            reports.map((r) => (
              <div key={r.emergency_id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Siren className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-900">#{String(r.emergency_id).padStart(3, '0')} · {r.type_name}</p>
                  <p className="text-xs text-neutral-500">{r.location?.area}, {r.location?.city}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={r.priority} />
                  <StatusBadge status={r.status_name!} />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}
