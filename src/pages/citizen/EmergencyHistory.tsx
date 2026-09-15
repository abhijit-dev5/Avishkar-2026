import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Eye, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { apiGetAllEmergencies } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { EmergencyReport } from '@/types/models';

export function EmergencyHistory() {
  const { user } = useAuth();
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    if (!user) return;
    apiGetAllEmergencies().then((all) => {
      setReports(all.filter((r) => r.user_id === user.user_id));
    });
  }, [user]);

  const filtered = reports.filter((r) => {
    const matchText = filter === '' ||
      r.type_name!.toLowerCase().includes(filter.toLowerCase()) ||
      String(r.emergency_id).includes(filter);
    const matchStatus = statusFilter === 'ALL' || r.status_name === statusFilter;
    return matchText && matchStatus;
  });

  return (
    <DashboardLayout title="Emergency History">
      <p className="text-sm text-neutral-500 mb-4">All your emergency reports in one place.</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
          <input
            type="text" value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input pl-10" placeholder="Search by type or ID..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input sm:w-48"
        >
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
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">
            <History className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm">No emergency reports found.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    {['Emergency ID', 'Type', 'Date', 'Priority', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-neutral-500 uppercase px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((r) => (
                    <tr key={r.emergency_id} className="hover:bg-neutral-50 transition">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-semibold text-sm text-neutral-900">#{String(r.emergency_id).padStart(3, '0')}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-neutral-700">{r.type_name}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-neutral-500">{new Date(r.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="px-5 py-3.5"><PriorityBadge priority={r.priority} /></td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status_name!} /></td>
                      <td className="px-5 py-3.5">
                        <Link to={`/citizen/track?id=${r.emergency_id}`}
                          className="inline-flex items-center gap-1.5 text-sm text-primary-600 font-semibold hover:text-primary-700">
                          <Eye className="w-4 h-4" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-neutral-100">
              {filtered.map((r) => (
                <div key={r.emergency_id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-semibold text-sm text-neutral-900">#{String(r.emergency_id).padStart(3, '0')}</span>
                    <StatusBadge status={r.status_name!} />
                  </div>
                  <p className="text-sm font-medium text-neutral-700">{r.type_name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-neutral-400">{new Date(r.created_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={r.priority} />
                      <Link to={`/citizen/track?id=${r.emergency_id}`}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 font-semibold">
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </DashboardLayout>
  );
}
