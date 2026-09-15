import { useEffect, useState } from 'react';
import {
  Bell, CheckCircle2, AlertCircle, Info, UserCheck, Siren,
  type LucideIcon,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { apiGetNotifications } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { Notification } from '@/types/models';

const typeConfig: Record<Notification['notification_type'], { icon: LucideIcon; color: string; bg: string }> = {
  STATUS_CHANGE: { icon: AlertCircle, color: 'text-accent-600', bg: 'bg-accent-50' },
  ASSIGNMENT:    { icon: UserCheck,    color: 'text-info-600',    bg: 'bg-info-50' },
  VERIFICATION:  { icon: CheckCircle2, color: 'text-warning-600', bg: 'bg-warning-50' },
  RESOLUTION:    { icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
  AI_ANALYSIS:   { icon: Siren,        color: 'text-primary-600', bg: 'bg-primary-50' },
};

export function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    apiGetNotifications(user.user_id).then(setNotifs);
  }, [user]);

  const unread = notifs.filter((n) => !n.is_read).length;

  return (
    <DashboardLayout title="Notifications">
      <p className="text-sm text-neutral-500 mb-4">Stay updated on your emergency reports.</p>

      <Card>
        <CardHeader title="All Notifications" subtitle={`${unread} unread · ${notifs.length} total`} />
        {notifs.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">
            <Bell className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifs.map((n) => {
              const cfg = typeConfig[n.notification_type];
              const Icon = cfg.icon;
              return (
                <div key={n.notification_id} className={`flex items-start gap-4 p-4 ${!n.is_read ? 'bg-primary-50/30' : ''}`}>
                  <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700 leading-snug">{n.message}</p>
                    <p className="text-xs text-neutral-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
