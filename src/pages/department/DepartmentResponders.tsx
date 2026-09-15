import { Users, Phone, Building2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { StatCard } from '@/components/ui/StatCard';
import { responders, departments } from '@/data/mockData';

export function DepartmentResponders() {
  const available = responders.filter((r) => r.availability_status === 'AVAILABLE').length;
  const onDuty = responders.filter((r) => r.availability_status === 'ON_DUTY').length;

  return (
    <DashboardLayout title="Responders">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Responders" value={responders.length} icon={Users} color="info" />
        <StatCard label="Available" value={available} icon={Users} color="success" />
        <StatCard label="On Duty" value={onDuty} icon={Users} color="primary" />
        <StatCard label="Off Duty" value={responders.filter((r) => r.availability_status === 'OFF_DUTY').length} icon={Users} color="neutral" />
      </div>

      <Card>
        <CardHeader title="All Responders" subtitle="Department responder roster" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                {['ID', 'Name', 'Type', 'Phone', 'Department', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-neutral-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {responders.map((r) => {
                const dept = departments.find((d) => d.department_id === r.department_id);
                return (
                  <tr key={r.responder_id} className="hover:bg-neutral-50 transition">
                    <td className="px-4 py-3"><span className="font-mono text-sm text-neutral-500">#{r.responder_id}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                          {r.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-neutral-800">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-700">{r.responder_type}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-600">{r.phone}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-sm text-neutral-600">{dept?.department_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${r.availability_status === 'AVAILABLE' ? 'bg-success-100 text-success-700' : r.availability_status === 'ON_DUTY' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-200 text-neutral-600'}`}>
                        {r.availability_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
