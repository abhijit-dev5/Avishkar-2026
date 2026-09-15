import { useEffect, useState } from 'react';
import {
  Siren, Activity, CheckCircle2, Users, Truck, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { BarChart } from '@/components/ui/Charts';
import { apiGetAllEmergencies, apiGetResponders, apiGetVehicles } from '@/services/api';
import { departments } from '@/data/mockData';
import type { EmergencyReport, Responder, Vehicle } from '@/types/models';

export function DepartmentDashboard() {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    apiGetAllEmergencies().then(setReports);
    apiGetResponders().then(setResponders);
    apiGetVehicles().then(setVehicles);
  }, []);

  // Filter to emergencies that have been dispatched/assigned (not just REPORTED)
  const assigned = reports.filter((r) => !['REPORTED', 'REJECTED'].includes(r.status_name!));
  const active = reports.filter((r) => ['DISPATCHED', 'RESPONDER_ASSIGNED', 'IN_PROGRESS'].includes(r.status_name!));
  const resolved = reports.filter((r) => r.status_name === 'RESOLVED');
  const availableResponders = responders.filter((r) => r.availability_status === 'AVAILABLE');
  const availableVehicles = vehicles.filter((v) => v.availability_status === 'AVAILABLE');

  const deptData = departments.map((d, i) => ({
    label: d.department_name.split(' ')[0],
    value: reports.filter((r) => r.department_name?.includes(d.department_name.split(' ')[0])).length,
    color: ['#dc2626', '#ea580c', '#ef4444', '#3b82f6', '#f59e0b'][i],
  }));

  return (
    <DashboardLayout title="Department Dashboard">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-neutral-900">Fire Department Console</h2>
        <p className="text-sm text-neutral-500">Manage assigned emergencies, responders, and vehicles.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard label="Assigned Emergencies" value={assigned.length} icon={Siren} color="info" />
        <StatCard label="Active" value={active.length} icon={Activity} color="primary" />
        <StatCard label="Resolved" value={resolved.length} icon={CheckCircle2} color="success" />
        <StatCard label="Available Responders" value={availableResponders.length} icon={Users} color="accent" />
        <StatCard label="Available Vehicles" value={availableVehicles.length} icon={Truck} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Assigned Emergencies" action={
            <Link to="/department/emergencies" className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          } />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  {['ID', 'Type', 'Location', 'Priority', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-neutral-500 uppercase px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {assigned.slice(0, 6).map((r) => (
                  <tr key={r.emergency_id} className="hover:bg-neutral-50 transition">
                    <td className="px-4 py-3"><span className="font-mono font-semibold text-sm text-neutral-900">#{String(r.emergency_id).padStart(3, '0')}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-700">{r.type_name}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-500">{r.location?.area}</span></td>
                    <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                    <td className="px-4 py-3"><StatusBadge status={r.status_name!} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Emergencies by Department" />
          <div className="p-5"><BarChart data={deptData} height={180} /></div>
        </Card>
      </div>

      {/* Available resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Available Responders" subtitle={`${availableResponders.length} ready for dispatch`} />
          <div className="divide-y divide-neutral-100">
            {availableResponders.map((r) => (
              <div key={r.responder_id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-success-100 flex items-center justify-center text-sm font-bold text-success-700">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{r.name}</p>
                    <p className="text-xs text-neutral-500">{r.responder_type}</p>
                  </div>
                </div>
                <span className="badge bg-success-100 text-success-700">{r.availability_status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Available Vehicles" subtitle={`${availableVehicles.length} ready for dispatch`} />
          <div className="divide-y divide-neutral-100">
            {availableVehicles.map((v) => (
              <div key={v.vehicle_id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <Truck className="w-4.5 h-4.5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-mono text-neutral-800">{v.vehicle_number}</p>
                    <p className="text-xs text-neutral-500">{v.vehicle_type}</p>
                  </div>
                </div>
                <span className="badge bg-success-100 text-success-700">{v.availability_status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
