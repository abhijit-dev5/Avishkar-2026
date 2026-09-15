import { Truck, Building2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { StatCard } from '@/components/ui/StatCard';
import { vehicles, departments } from '@/data/mockData';

export function AdminVehicles() {
  const available = vehicles.filter((v) => v.availability_status === 'AVAILABLE').length;
  const onDuty = vehicles.filter((v) => v.availability_status === 'ON_DUTY').length;

  return (
    <DashboardLayout title="Vehicles">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Vehicles" value={vehicles.length} icon={Truck} color="info" />
        <StatCard label="Available" value={available} icon={Truck} color="success" />
        <StatCard label="On Duty" value={onDuty} icon={Truck} color="primary" />
      </div>

      <Card>
        <CardHeader title="All Vehicles" subtitle="Fleet management overview" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                {['ID', 'Vehicle Number', 'Type', 'Department', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-neutral-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {vehicles.map((v) => {
                const dept = departments.find((d) => d.department_id === v.department_id);
                return (
                  <tr key={v.vehicle_id} className="hover:bg-neutral-50 transition">
                    <td className="px-4 py-3"><span className="font-mono text-sm text-neutral-500">#{v.vehicle_id}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                          <Truck className="w-4 h-4 text-neutral-500" />
                        </div>
                        <span className="font-mono font-semibold text-sm text-neutral-800">{v.vehicle_number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-700">{v.vehicle_type}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-sm text-neutral-600">{dept?.department_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${v.availability_status === 'AVAILABLE' ? 'bg-success-100 text-success-700' : v.availability_status === 'ON_DUTY' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-200 text-neutral-600'}`}>
                        {v.availability_status}
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
