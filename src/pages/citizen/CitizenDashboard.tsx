import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Siren, Clock, CheckCircle2, Bell, FilePlus, ArrowRight,
  AlertTriangle, type LucideIcon,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { apiGetAllEmergencies, apiGetNotifications } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { EmergencyReport, Notification } from '@/types/models';

export function CitizenDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    apiGetAllEmergencies().then((all) => {
      setReports(all.filter((r) => r.user_id === user.user_id));
    });
    apiGetNotifications(user.user_id).then(setNotifs);
  }, [user]);

  if (!user) return null;

  const total = reports.length;
  const active = reports.filter((r) => !['RESOLVED', 'REJECTED'].includes(r.status_name!)).length;
  const resolved = reports.filter((r) => r.status_name === 'RESOLVED').length;
  const unread = notifs.filter((n) => !n.is_read).length;

  return (
    <DashboardLayout title="My Dashboard">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-neutral-900">Welcome back, {user.name.split(' ')[0]}</h2>
        <p className="text-sm text-neutral-500">Here's an overview of your emergency reports and notifications.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Reports" value={total} icon={Siren} color="info" />
        <StatCard label="Active Emergencies" value={active} icon={Clock} color="accent" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} color="success" />
        <StatCard label="Unread Notifications" value={unread} icon={Bell} color="primary" />
      </div>

      {/* Quick action */}
      <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-display font-bold text-lg">Need to report an emergency?</h3>
          <p className="text-primary-100 text-sm mt-0.5">Submit a report with photo and location — AI will analyze it instantly.</p>
        </div>
        <Link to="/citizen/report" className="btn bg-white text-primary-700 hover:bg-primary-50 font-semibold">
          <FilePlus className="w-4 h-4" /> Report Now
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent reports */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Recent Reports" subtitle="Your latest emergency reports" action={
              <Link to="/citizen/history" className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            } />
            <div className="divide-y divide-neutral-100">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  <Siren className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
                  <p className="text-sm">No emergency reports yet.</p>
                </div>
              ) : (
                reports.slice(0, 5).map((r) => (
                  <Link key={r.emergency_id} to={`/citizen/track?id=${r.emergency_id}`}
                    className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-neutral-900">#{String(r.emergency_id).padStart(3, '0')} · {r.type_name}</p>
                      <p className="text-xs text-neutral-500 truncate">{r.location?.area}, {r.location?.city}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={r.status_name!} />
                      <PriorityBadge priority={r.priority} />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <Card>
            <CardHeader title="Notifications" subtitle={`${unread} unread`} action={
              <Link to="/citizen/notifications" className="text-sm text-primary-600 font-semibold hover:text-primary-700">
                View All
              </Link>
            } />
            <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                  <p className="text-sm">No notifications.</p>
                </div>
              ) : (
                notifs.slice(0, 6).map((n) => (
                  <div key={n.notification_id} className={`p-4 ${!n.is_read ? 'bg-primary-50/40' : ''}`}>
                    <div className="flex items-start gap-2.5">
                      {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />}
                      <div className={!n.is_read ? 'ml-0' : 'ml-4.5'}>
                        <p className="text-sm text-neutral-700 leading-snug">{n.message}</p>
                        <p className="text-xs text-neutral-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
