import { useEffect, useState } from 'react';
import {
  Eye, CheckCircle2, UserPlus, Truck, Edit3, Search, Loader2,
  Siren, MapPin, User, Building2, AlertTriangle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge, SeverityBadge } from '@/components/ui/Badges';
import { Modal } from '@/components/ui/Modal';
import { MapPlaceholder } from '@/components/ui/MapPlaceholder';
import { Card } from '@/components/ui/StatCard';
import { apiGetAllEmergencies, apiUpdateEmergencyStatus, apiAssignEmergency, apiGetResponders, apiGetVehicles } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import type { EmergencyReport, Responder, Vehicle, StatusName } from '@/types/models';

export function DepartmentEmergencies() {
  const { user } = useAuth();
  const toast = useToast();
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState('');
  const [viewReport, setViewReport] = useState<EmergencyReport | null>(null);
  const [assignReport, setAssignReport] = useState<EmergencyReport | null>(null);
  const [statusReport, setStatusReport] = useState<EmergencyReport | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [assignResp, setAssignResp] = useState<number | ''>('');
  const [assignVeh, setAssignVeh] = useState<number | ''>('');
  const [newStatus, setNewStatus] = useState<StatusName>('IN_PROGRESS');
  const [statusRemarks, setStatusRemarks] = useState('');

  useEffect(() => {
    apiGetAllEmergencies().then((all) => {
      setReports(all.filter((r) => !['REPORTED', 'REJECTED'].includes(r.status_name!)));
    });
    apiGetResponders().then(setResponders);
    apiGetVehicles().then(setVehicles);
  }, []);

  const refresh = () => apiGetAllEmergencies().then((all) => {
    setReports(all.filter((r) => !['REPORTED', 'REJECTED'].includes(r.status_name!)));
  });

  const filtered = reports.filter((r) =>
    filter === '' ||
    r.type_name!.toLowerCase().includes(filter.toLowerCase()) ||
    String(r.emergency_id).includes(filter)
  );

  const handleAccept = async (r: EmergencyReport) => {
    setActionLoading(true);
    await apiUpdateEmergencyStatus(r.emergency_id, 'DISPATCHED', user?.name ?? 'Department', 'Emergency accepted by department');
    setActionLoading(false);
    toast('Emergency accepted and dispatched.');
    refresh();
  };

  const handleAssign = async () => {
    if (!assignReport) return;
    setActionLoading(true);
    await apiAssignEmergency(assignReport.emergency_id, {
      responder_id: assignResp || undefined,
      vehicle_id: assignVeh || undefined,
    });
    setActionLoading(false);
    toast('Responder and vehicle assigned.');
    setAssignReport(null);
    setAssignResp(''); setAssignVeh('');
    refresh();
  };

  const handleStatusUpdate = async () => {
    if (!statusReport) return;
    setActionLoading(true);
    await apiUpdateEmergencyStatus(statusReport.emergency_id, newStatus, user?.name ?? 'Department', statusRemarks || 'Status updated by department');
    setActionLoading(false);
    toast('Status updated successfully.');
    setStatusReport(null);
    setStatusRemarks('');
    refresh();
  };

  return (
    <DashboardLayout title="Assigned Emergencies">
      <p className="text-sm text-neutral-500 mb-4">Accept assignments, assign responders and vehicles, and update status.</p>

      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
          className="input pl-10" placeholder="Search by ID or type..." />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                {['ID', 'Type', 'Location', 'Priority', 'AI Analysis', 'Responder', 'Vehicle', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-neutral-500 uppercase px-3 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((r) => (
                <tr key={r.emergency_id} className="hover:bg-neutral-50 transition">
                  <td className="px-3 py-3"><span className="font-mono font-semibold text-sm text-neutral-900">#{String(r.emergency_id).padStart(3, '0')}</span></td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-700">{r.type_name}</span></td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-500">{r.location?.area}</span></td>
                  <td className="px-3 py-3"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-3 py-3">
                    {r.ai_analysis ? (
                      <div className="flex flex-col gap-1">
                        <SeverityBadge severity={r.ai_analysis.severity} />
                        <span className="text-xs text-neutral-400">{r.ai_analysis.confidence}%</span>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-500">{r.responder_name}</span></td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-500 font-mono">{r.vehicle_number}</span></td>
                  <td className="px-3 py-3"><StatusBadge status={r.status_name!} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewReport(r)} title="View" className="p-1.5 rounded-lg hover:bg-info-50 text-info-600"><Eye className="w-4 h-4" /></button>
                      {r.status_name === 'VERIFIED' && (
                        <button onClick={() => handleAccept(r)} title="Accept" className="p-1.5 rounded-lg hover:bg-success-50 text-success-600"><CheckCircle2 className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => setAssignReport(r)} title="Assign" className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600"><UserPlus className="w-4 h-4" /></button>
                      <button onClick={() => { setStatusReport(r); setNewStatus(r.status_name!); }} title="Update Status" className="p-1.5 rounded-lg hover:bg-accent-50 text-accent-600"><Edit3 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-neutral-400 text-sm">No assigned emergencies.</div>}
      </Card>

      {/* View Modal */}
      <Modal open={!!viewReport} onClose={() => setViewReport(null)} title={`Emergency #${viewReport ? String(viewReport.emergency_id).padStart(3, '0') : ''}`} size="lg">
        {viewReport && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={viewReport.status_name!} />
              <PriorityBadge priority={viewReport.priority} />
              {viewReport.ai_analysis && <SeverityBadge severity={viewReport.ai_analysis.severity} />}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoItem icon={Siren} label="Type" value={viewReport.type_name!} />
              <InfoItem icon={User} label="Citizen" value={viewReport.citizen_name!} />
              <InfoItem icon={MapPin} label="Location" value={`${viewReport.location?.area}, ${viewReport.location?.city}`} />
              <InfoItem icon={Building2} label="Department" value={viewReport.department_name ?? '—'} />
            </div>
            <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded-lg">{viewReport.description}</p>
            {viewReport.ai_analysis && (
              <div className="p-4 rounded-xl bg-info-50 border border-info-100">
                <p className="text-xs font-semibold text-info-700 uppercase mb-2">AI Analysis</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-neutral-500">Detected:</span> <span className="font-semibold">{viewReport.ai_analysis.detected_type}</span></div>
                  <div><span className="text-neutral-500">Confidence:</span> <span className="font-semibold text-info-700">{viewReport.ai_analysis.confidence}%</span></div>
                </div>
              </div>
            )}
            {viewReport.location && <MapPlaceholder location={viewReport.location} height="h-48" />}
          </div>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal open={!!assignReport} onClose={() => setAssignReport(null)} title="Assign Responder & Vehicle" size="md">
        {assignReport && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500">Assign to Emergency #{String(assignReport.emergency_id).padStart(3, '0')}</p>
            <div>
              <label className="label">Responder</label>
              <select value={assignResp} onChange={(e) => setAssignResp(parseInt(e.target.value))} className="input">
                <option value="">Select responder...</option>
                {responders.map((r) => <option key={r.responder_id} value={r.responder_id}>{r.name} ({r.responder_type}) — {r.availability_status}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Vehicle</label>
              <select value={assignVeh} onChange={(e) => setAssignVeh(parseInt(e.target.value))} className="input">
                <option value="">Select vehicle...</option>
                {vehicles.map((v) => <option key={v.vehicle_id} value={v.vehicle_id}>{v.vehicle_number} ({v.vehicle_type}) — {v.availability_status}</option>)}
              </select>
            </div>
            <button onClick={handleAssign} disabled={actionLoading} className="btn-primary w-full py-3">
              {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              Confirm Assignment
            </button>
          </div>
        )}
      </Modal>

      {/* Status Modal */}
      <Modal open={!!statusReport} onClose={() => setStatusReport(null)} title="Update Status" size="md">
        {statusReport && (
          <div className="space-y-4">
            <div>
              <label className="label">New Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as StatusName)} className="input">
                <option value="VERIFIED">Verified</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="RESPONDER_ASSIGNED">Responder Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
            <div>
              <label className="label">Remarks</label>
              <textarea value={statusRemarks} onChange={(e) => setStatusRemarks(e.target.value)} rows={3} className="input resize-none" placeholder="Add remarks..." />
            </div>
            <button onClick={handleStatusUpdate} disabled={actionLoading} className="btn-primary w-full py-3">
              {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Edit3 className="w-5 h-5" />}
              Update Status
            </button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof Siren; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-neutral-400 shrink-0" />
      <div>
        <p className="text-xs text-neutral-400">{label}</p>
        <p className="text-sm font-medium text-neutral-700">{value}</p>
      </div>
    </div>
  );
}
