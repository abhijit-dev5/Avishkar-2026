import { Truck, Building2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { StatCard } from '@/components/ui/StatCard';
import { vehicles, departments } from '@/data/mockData';

export function DepartmentVehicles() {
  const available = vehicles.filter((v) => v.availability_status === 'AVAILABLE').length;
  const onDuty = vehicles.filter((v) => v.availability_status === 'ON_DUTY').length;

  return (
    <DashboardLayout title="Vehicles">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Vehicles" value={vehicles.length} icon={Truck} color="info" />
        <StatCard label="Available" value={available} icon={Truck} color="success" />
        <StatCard label="On Duty" value={onDuty} icon={Truck} color="primary" />
        <StatCard label="Off Duty" value={vehicles.filter((v) => v.availability_status === 'OFF_DUTY').length} icon={Truck} color="neutral" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const dept = departments.find((d) => d.department_id === v.department_id);
          return (
            <Card key={v.vehicle_id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-neutral-600" />
                </div>
                <span className={`badge ${v.availability_status === 'AVAILABLE' ? 'bg-success-100 text-success-700' : v.availability_status === 'ON_DUTY' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-200 text-neutral-600'}`}>
                  {v.availability_status}
                </span>
              </div>
              <p className="font-mono font-bold text-neutral-900">{v.vehicle_number}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{v.vehicle_type}</p>
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-100">
                <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-500">{dept?.department_name}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
