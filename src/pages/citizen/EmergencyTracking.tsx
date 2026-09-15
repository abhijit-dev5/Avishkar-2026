import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Clock, MapPin, Siren, Building2, User, Truck, AlertTriangle,
  ArrowRight, Search, type LucideIcon,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge, SeverityBadge } from '@/components/ui/Badges';
import { MapPlaceholder } from '@/components/ui/MapPlaceholder';
import { StatusTimeline } from '@/components/ui/StatusTimeline';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { apiGetAllEmergencies, apiGetStatusUpdates } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { EmergencyReport, StatusUpdate } from '@/types/models';

export function EmergencyTracking() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [selected, setSelected] = useState<EmergencyReport | null>(null);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    apiGetAllEmergencies().then((all) => {
      const userReports = user ? all.filter((r) => r.user_id === user.user_id) : all;
      setReports(userReports);
      const idParam = params.get('id');
      if (idParam) {
        const found = all.find((r) => r.emergency_id === parseInt(idParam));
        if (found) setSelected(found);
      } else if (userReports.length > 0) {
        setSelected(userReports[0]);
      }
    });
  }, [user, params]);

  useEffect(() => {
    if (selected) {
      apiGetStatusUpdates(selected.emergency_id).then(setUpdates);
    }
  }, [selected]);

  const handleSearch = () => {
    const id = parseInt(searchId);
    const found = reports.find((r) => r.emergency_id === id);
    if (found) {
      setSelected(found);
      setParams({ id: searchId });
    }
  };

  return (
    <DashboardLayout title="Track Emergency">
      <div className="mb-6">
        <p className="text-sm text-neutral-500 mb-3">Track the real-time status of your emergency reports.</p>
        {/* Search */}
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
            <input
              type="text" value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input pl-10" placeholder="Enter Emergency ID (e.g. 1)"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary">Track</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: report list */}
        <div>
          <Card>
            <CardHeader title="My Reports" subtitle={`${reports.length} total`} />
            <div className="divide-y divide-neutral-100 max-h-[600px] overflow-y-auto">
              {reports.length === 0 ? (
                <div className="p-6 text-center text-neutral-400 text-sm">No reports found.</div>
              ) : (
                reports.map((r) => (
                  <button
                    key={r.emergency_id}
                    onClick={() => { setSelected(r); setParams({ id: String(r.emergency_id) }); }}
                    className={`w-full text-left p-4 hover:bg-neutral-50 transition ${selected?.emergency_id === r.emergency_id ? 'bg-primary-50/50 border-l-4 border-primary-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-neutral-900">#{String(r.emergency_id).padStart(3, '0')}</p>
                      <StatusBadge status={r.status_name!} />
                    </div>
                    <p className="text-sm text-neutral-600">{r.type_name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{r.location?.area}, {r.location?.city}</p>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right: tracking detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="card p-12 text-center text-neutral-400">
              <Clock className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
              <p>Select an emergency to track its status.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="card p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-lg text-neutral-900">
                        Emergency #{String(selected.emergency_id).padStart(3, '0')}
                      </h3>
                      <StatusBadge status={selected.status_name!} />
                    </div>
                    <p className="text-sm text-neutral-500">{selected.type_name} · {new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <PriorityBadge priority={selected.priority} />
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={AlertTriangle} label="AI Severity" value={selected.ai_analysis?.severity ?? '—'} render={<SeverityBadge severity={selected.ai_analysis?.severity ?? 'LOW'} />} />
                <InfoRow icon={Siren} label="Priority" value={selected.priority} />
                <InfoRow icon={Building2} label="Department" value={selected.department_name ?? '—'} />
                <InfoRow icon={User} label="Responder" value={selected.responder_name ?? '—'} />
                <InfoRow icon={Truck} label="Vehicle" value={selected.vehicle_number ?? '—'} />
                <InfoRow icon={MapPin} label="Location" value={`${selected.location?.area}, ${selected.location?.city}`} />
              </div>

              {/* Map */}
              {selected.location && (
                <Card>
                  <CardHeader title="Emergency Location" />
                  <div className="p-5">
                    <MapPlaceholder location={selected.location} height="h-56" />
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2.5 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Address</p>
                        <p className="font-medium text-neutral-700">{selected.location.address}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Pincode</p>
                        <p className="font-medium text-neutral-700 font-mono">{selected.location.pincode}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader title="Status Timeline" subtitle="Track the full response workflow" />
                <div className="p-5">
                  <StatusTimeline currentStatus={selected.status_name!} />
                </div>
              </Card>

              {/* Status updates log */}
              {updates.length > 0 && (
                <Card>
                  <CardHeader title="Status Update Log" />
                  <div className="divide-y divide-neutral-100">
                    {updates.map((u) => (
                      <div key={u.update_id} className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-neutral-800">{u.remarks}</p>
                          <span className="text-xs text-neutral-400">{new Date(u.update_time).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-neutral-500">Updated by {u.updated_by}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Feedback link */}
              {selected.status_name === 'RESOLVED' && (
                <div className="p-4 rounded-xl bg-success-50 border border-success-200 flex items-center justify-between">
                  <p className="text-sm text-success-800 font-medium">This emergency has been resolved.</p>
                  <Link to={`/citizen/feedback?id=${selected.emergency_id}`} className="btn-info text-sm">
                    Give Feedback <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string; render?: React.ReactNode }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-neutral-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-neutral-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-neutral-800 truncate">{value}</p>
      </div>
    </div>
  );
}
