import { useEffect, useState } from 'react';
import {
  Eye, CheckCircle2, XCircle, UserPlus, Edit3, Search,
  Siren, MapPin, User, Truck, Building2, AlertTriangle, Loader2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge, SeverityBadge } from '@/components/ui/Badges';
import { Modal } from '@/components/ui/Modal';
import { MapPlaceholder } from '@/components/ui/MapPlaceholder';
import { Card } from '@/components/ui/StatCard';
import { apiGetAllEmergencies, apiUpdateEmergencyStatus, apiAssignEmergency, apiGetDepartments, apiGetResponders, apiGetVehicles } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import type { EmergencyReport, EmergencyDepartment, Responder, Vehicle, StatusName } from '@/types/models';

export function AdminEmergencies() {
  const { user } = useAuth();
  const toast = useToast();
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [depts, setDepts] = useState<EmergencyDepartment[]>([]);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewReport, setViewReport] = useState<EmergencyReport | null>(null);
  const [assignReport, setAssignReport] = useState<EmergencyReport | null>(null);
  const [statusReport, setStatusReport] = useState<EmergencyReport | null>(null);
  const [rejectReport, setRejectReport] = useState<EmergencyReport | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Assign form state
  const [assignDept, setAssignDept] = useState<number | ''>('');
  const [assignResp, setAssignResp] = useState<number | ''>('');
  const [assignVeh, setAssignVeh] = useState<number | ''>('');

  // Status form state
  const [newStatus, setNewStatus] = useState<StatusName>('VERIFIED');
  const [statusRemarks, setStatusRemarks] = useState('');

  useEffect(() => {
    apiGetAllEmergencies().then(setReports);
    apiGetDepartments().then(setDepts);
    apiGetResponders().then(setResponders);
    apiGetVehicles().then(setVehicles);
  }, []);

  const refresh = () => apiGetAllEmergencies().then(setReports);

  const filtered = reports.filter((r) => {
    const matchText = filter === '' ||
      r.type_name!.toLowerCase().includes(filter.toLowerCase()) ||
      r.citizen_name!.toLowerCase().includes(filter.toLowerCase()) ||
      String(r.emergency_id).includes(filter);
    const matchStatus = statusFilter === 'ALL' || r.status_name === statusFilter;
    return matchText && matchStatus;
  });

  const handleVerify = async (r: EmergencyReport) => {
    setActionLoading(true);
    await apiUpdateEmergencyStatus(r.emergency_id, 'VERIFIED', user!.name, 'Report verified by admin');
    setActionLoading(false);
    toast('Emergency verified successfully.');
    refresh();
  };

  const handleReject = async () => {
    if (!rejectReport) return;
    setActionLoading(true);
    await apiUpdateEmergencyStatus(rejectReport.emergency_id, 'REJECTED', user!.name, 'Report rejected as invalid');
    setActionLoading(false);
    toast('Emergency report rejected.', 'info');
    setRejectReport(null);
    refresh();
  };

  const handleAssign = async () => {
    if (!assignReport) return;
    setActionLoading(true);
    await apiAssignEmergency(assignReport.emergency_id, {
      department_id: assignDept || undefined,
      responder_id: assignResp || undefined,
      vehicle_id: assignVeh || undefined,
    });
    setActionLoading(false);
    toast('Assignment updated successfully.');
    setAssignReport(null);
    setAssignDept(''); setAssignResp(''); setAssignVeh('');
    refresh();
  };

  const handleStatusUpdate = async () => {
    if (!statusReport) return;
    setActionLoading(true);
    await apiUpdateEmergencyStatus(statusReport.emergency_id, newStatus, user!.name, statusRemarks || 'Status updated by admin');
    setActionLoading(false);
    toast('Status updated successfully.');
    setStatusReport(null);
    setStatusRemarks('');
    refresh();
  };

  return (
    <DashboardLayout title="All Emergencies">
      <p className="text-sm text-neutral-500 mb-4">Verify, assign, and manage all emergency reports.</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
          <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
            className="input pl-10" placeholder="Search by ID, type, or citizen..." />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input sm:w-48">
          <option value="ALL">All Statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="VERIFIED">Verified</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="RESPONDER_ASSIGNED">Responder Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                {['ID', 'Citizen', 'Type', 'Location', 'Severity', 'Priority', 'Dept', 'Responder', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-neutral-500 uppercase px-3 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((r) => (
                <tr key={r.emergency_id} className="hover:bg-neutral-50 transition">
                  <td className="px-3 py-3"><span className="font-mono font-semibold text-sm text-neutral-900">#{String(r.emergency_id).padStart(3, '0')}</span></td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-700">{r.citizen_name}</span></td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-700">{r.type_name}</span></td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-500">{r.location?.area}</span></td>
                  <td className="px-3 py-3"><span className="text-sm font-semibold text-neutral-700">{r.ai_analysis?.severity ?? '—'}</span></td>
                  <td className="px-3 py-3"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-500">{r.department_name}</span></td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-500">{r.responder_name}</span></td>
                  <td className="px-3 py-3"><StatusBadge status={r.status_name!} /></td>
                  <td className="px-3 py-3"><span className="text-sm text-neutral-500 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewReport(r)} title="View" className="p-1.5 rounded-lg hover:bg-info-50 text-info-600"><Eye className="w-4 h-4" /></button>
                      {r.status_name === 'REPORTED' && (
                        <button onClick={() => handleVerify(r)} title="Verify" className="p-1.5 rounded-lg hover:bg-success-50 text-success-600"><CheckCircle2 className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => setAssignReport(r)} title="Assign" className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600"><UserPlus className="w-4 h-4" /></button>
                      <button onClick={() => { setStatusReport(r); setNewStatus(r.status_name!); }} title="Update Status" className="p-1.5 rounded-lg hover:bg-accent-50 text-accent-600"><Edit3 className="w-4 h-4" /></button>
                      {r.status_name === 'REPORTED' && (
                        <button onClick={() => setRejectReport(r)} title="Reject" className="p-1.5 rounded-lg hover:bg-error-50 text-error-600"><XCircle className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-neutral-400 text-sm">No emergencies found.</div>
        )}
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
              <InfoItem icon={User} label="Responder" value={viewReport.responder_name ?? '—'} />
              <InfoItem icon={Truck} label="Vehicle" value={viewReport.vehicle_number ?? '—'} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Description</p>
              <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded-lg">{viewReport.description}</p>
            </div>
            {viewReport.ai_analysis && (
              <div className="p-4 rounded-xl bg-info-50 border border-info-100">
                <p className="text-xs font-semibold text-info-700 uppercase mb-2">AI Analysis</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-neutral-500">Detected:</span> <span className="font-semibold text-neutral-800">{viewReport.ai_analysis.detected_type}</span></div>
                  <div><span className="text-neutral-500">Confidence:</span> <span className="font-semibold text-info-700">{viewReport.ai_analysis.confidence}%</span></div>
                  <div><span className="text-neutral-500">Severity:</span> <span className="font-semibold text-neutral-800">{viewReport.ai_analysis.severity}</span></div>
                  <div><span className="text-neutral-500">Priority:</span> <span className="font-semibold text-neutral-800">{viewReport.ai_analysis.priority}</span></div>
                </div>
              </div>
            )}
            {viewReport.location && <MapPlaceholder location={viewReport.location} height="h-48" />}
          </div>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal open={!!assignReport} onClose={() => setAssignReport(null)} title="Assign Resources" size="md">
        {assignReport && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500">Assign department, responder, and vehicle to Emergency #{String(assignReport.emergency_id).padStart(3, '0')}</p>
            <div>
              <label className="label">Department</label>
              <select value={assignDept} onChange={(e) => setAssignDept(parseInt(e.target.value))} className="input">
                <option value="">Select department...</option>
                {depts.map((d) => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
              </select>
            </div>
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

      {/* Status Update Modal */}
      <Modal open={!!statusReport} onClose={() => setStatusReport(null)} title="Update Emergency Status" size="md">
        {statusReport && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500">Update status for Emergency #{String(statusReport.emergency_id).padStart(3, '0')}</p>
            <div>
              <label className="label">New Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as StatusName)} className="input">
                <option value="REPORTED">Reported</option>
                <option value="VERIFIED">Verified</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="RESPONDER_ASSIGNED">Responder Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
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

      {/* Reject Confirmation Modal */}
      <Modal open={!!rejectReport} onClose={() => setRejectReport(null)} title="Reject Report" size="sm">
        {rejectReport && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-error-50 border border-error-100">
              <AlertTriangle className="w-5 h-5 text-error-600 shrink-0" />
              <p className="text-sm text-error-700">Are you sure you want to reject Emergency #{String(rejectReport.emergency_id).padStart(3, '0')}? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRejectReport(null)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleReject} disabled={actionLoading} className="btn-danger flex-1">
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                Confirm Reject
              </button>
            </div>
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
