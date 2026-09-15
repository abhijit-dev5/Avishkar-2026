import { useEffect, useState } from 'react';
import { Building2, Phone, MapPin, Users, Truck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { StatCard } from '@/components/ui/StatCard';
import { departments, responders, vehicles } from '@/data/mockData';

const typeColors: Record<string, string> = {
  POLICE: 'bg-primary-100 text-primary-700',
  FIRE: 'bg-accent-100 text-accent-700',
  MEDICAL: 'bg-error-100 text-error-700',
  DISASTER: 'bg-warning-100 text-warning-700',
  ELECTRICITY: 'bg-warning-100 text-warning-700',
};

export function AdminDepartments() {
  return (
    <DashboardLayout title="Departments">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Departments" value={departments.length} icon={Building2} color="info" />
        <StatCard label="Total Responders" value={responders.length} icon={Users} color="success" />
        <StatCard label="Total Vehicles" value={vehicles.length} icon={Truck} color="accent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((d) => {
          const deptResponders = responders.filter((r) => r.department_id === d.department_id);
          const deptVehicles = vehicles.filter((v) => v.department_id === d.department_id);
          const available = deptResponders.filter((r) => r.availability_status === 'AVAILABLE').length;
          const vehAvailable = deptVehicles.filter((v) => v.availability_status === 'AVAILABLE').length;

          return (
            <Card key={d.department_id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-neutral-900">{d.department_name}</h3>
                    <span className={`badge ${typeColors[d.department_type]} mt-1`}>{d.department_type}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="w-4 h-4 text-neutral-400" /> {d.contact}
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="w-4 h-4 text-neutral-400" /> {d.address}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-neutral-100">
                <div className="text-center p-3 rounded-lg bg-neutral-50">
                  <p className="text-2xl font-bold font-display text-neutral-900">{available}/{deptResponders.length}</p>
                  <p className="text-xs text-neutral-500">Responders Available</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-neutral-50">
                  <p className="text-2xl font-bold font-display text-neutral-900">{vehAvailable}/{deptVehicles.length}</p>
                  <p className="text-xs text-neutral-500">Vehicles Available</p>
                </div>
              </div>

              {/* Responder list */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">Responders</p>
                <div className="space-y-1.5">
                  {deptResponders.map((r) => (
                    <div key={r.responder_id} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700">{r.name}</span>
                      <span className={`badge ${r.availability_status === 'AVAILABLE' ? 'bg-success-100 text-success-700' : r.availability_status === 'ON_DUTY' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-200 text-neutral-600'}`}>
                        {r.availability_status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle list */}
              <div className="mt-3">
                <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">Vehicles</p>
                <div className="space-y-1.5">
                  {deptVehicles.map((v) => (
                    <div key={v.vehicle_id} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700 font-mono">{v.vehicle_number}</span>
                      <span className="text-xs text-neutral-500">{v.vehicle_type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
