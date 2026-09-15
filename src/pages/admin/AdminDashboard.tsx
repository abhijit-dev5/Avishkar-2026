import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Siren, Clock, CheckCircle2, AlertTriangle, Activity, TrendingUp,
  ArrowRight, type LucideIcon,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { BarChart, DonutChart, LineChart } from '@/components/ui/Charts';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { apiGetAllEmergencies } from '@/services/api';
import { emergencyTypes, departments } from '@/data/mockData';
import type { EmergencyReport } from '@/types/models';

const typeColors = ['#dc2626', '#ea580c', '#ef4444', '#3b82f6', '#f59e0b', '#fbbf24', '#64748b', '#b91c1c'];
const statusColors: Record<string, string> = {
  REPORTED: '#3b82f6', VERIFIED: '#f59e0b', DISPATCHED: '#ea580c',
  RESPONDER_ASSIGNED: '#dc2626', IN_PROGRESS: '#dc2626', RESOLVED: '#22c55e', REJECTED: '#94a3b8',
};

export function AdminDashboard() {
  const [reports, setReports] = useState<EmergencyReport[]>([]);

  useEffect(() => {
    apiGetAllEmergencies().then(setReports);
  }, []);

  const total = reports.length;
  const pending = reports.filter((r) => r.status_name === 'REPORTED').length;
  const verified = reports.filter((r) => r.status_name === 'VERIFIED').length;
  const active = reports.filter((r) => ['DISPATCHED', 'RESPONDER_ASSIGNED', 'IN_PROGRESS'].includes(r.status_name!)).length;
  const resolved = reports.filter((r) => r.status_name === 'RESOLVED').length;
  const critical = reports.filter((r) => r.priority === 'CRITICAL').length;

  // Chart data
  const byType = emergencyTypes.map((t, i) => ({
    label: t.type_name.split(' ')[0],
    value: reports.filter((r) => r.emergency_type_id === t.emergency_type_id).length,
    color: typeColors[i],
  }));

  const byStatus = ['REPORTED', 'VERIFIED', 'DISPATCHED', 'RESPONDER_ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((s) => ({
    label: s.replace('_', ' ').split(' ')[0],
    value: reports.filter((r) => r.status_name === s).length,
    color: statusColors[s],
  })).filter((d) => d.value > 0);

  const monthlyData = [
    { label: 'Apr', value: 8 }, { label: 'May', value: 12 }, { label: 'Jun', value: 6 },
    { label: 'Jul', value: 15 }, { label: 'Aug', value: 10 }, { label: 'Sep', value: total },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-neutral-900">Emergency Response Overview</h2>
        <p className="text-sm text-neutral-500">Monitor all emergencies, verify reports, and manage dispatch operations.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total Emergencies" value={total} icon={Siren} color="info" />
        <StatCard label="Pending" value={pending} icon={Clock} color="warning" />
        <StatCard label="Verified" value={verified} icon={CheckCircle2} color="accent" />
        <StatCard label="Active" value={active} icon={Activity} color="primary" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} color="success" />
        <StatCard label="Critical" value={critical} icon={AlertTriangle} color="error" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader title="Emergencies by Type" />
          <div className="p-5"><BarChart data={byType} height={180} /></div>
        </Card>
        <Card>
          <CardHeader title="Emergencies by Status" />
          <div className="p-5"><DonutChart data={byStatus} /></div>
        </Card>
        <Card>
          <CardHeader title="Monthly Statistics" />
          <div className="p-5"><LineChart data={monthlyData} /></div>
        </Card>
      </div>

      {/* Recent emergencies table */}
      <Card>
        <CardHeader
          title="Emergency Management"
          subtitle="All emergency reports"
          action={
            <Link to="/admin/emergencies" className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                {['ID', 'Citizen', 'Type', 'Location', 'Severity', 'Priority', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-neutral-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {reports.slice(0, 8).map((r) => (
                <tr key={r.emergency_id} className="hover:bg-neutral-50 transition">
                  <td className="px-4 py-3"><span className="font-mono font-semibold text-sm text-neutral-900">#{String(r.emergency_id).padStart(3, '0')}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-neutral-700">{r.citizen_name}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-neutral-700">{r.type_name}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-neutral-500">{r.location?.area}</span></td>
                  <td className="px-4 py-3"><span className="text-sm font-semibold text-neutral-700">{r.ai_analysis?.severity ?? '—'}</span></td>
                  <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status_name!} /></td>
                  <td className="px-4 py-3"><span className="text-sm text-neutral-500">{new Date(r.created_at).toLocaleDateString()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
