import { Star, MessageSquare } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { StatCard } from '@/components/ui/StatCard';
import { feedbacks, emergencyReports, users } from '@/data/mockData';

export function AdminFeedback() {
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0';

  return (
    <DashboardLayout title="Feedback Management">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Feedback" value={feedbacks.length} icon={MessageSquare} color="info" />
        <StatCard label="Average Rating" value={`${avgRating} / 5`} icon={Star} color="warning" />
        <StatCard label="5-Star Reviews" value={feedbacks.filter((f) => f.rating === 5).length} icon={Star} color="success" />
      </div>

      <Card>
        <CardHeader title="All Feedback" subtitle="Citizen feedback on emergency response" />
        {feedbacks.length === 0 ? (
          <div className="p-8 text-center text-neutral-400">
            <Star className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
            <p className="text-sm">No feedback submitted yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {feedbacks.map((f) => {
              const report = emergencyReports.find((r) => r.emergency_id === f.emergency_id);
              const citizen = users.find((u) => u.user_id === f.user_id);
              return (
                <div key={f.feedback_id} className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-600">
                        {citizen?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-neutral-900">{citizen?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-neutral-500">
                          Emergency #{String(f.emergency_id).padStart(3, '0')} · {report?.type_name} · {new Date(f.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= f.rating ? 'fill-warning-400 text-warning-400' : 'text-neutral-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">{f.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
