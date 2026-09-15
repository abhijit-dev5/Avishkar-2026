import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star, Loader2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { apiGetAllEmergencies, apiSubmitFeedback } from '@/services/api';
import { feedbacks as initialFeedbacks } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { EmergencyReport, Feedback as FeedbackType } from '@/types/models';

export function Feedback() {
  const { user } = useAuth();
  const toast = useToast();
  const [params] = useSearchParams();
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<FeedbackType[]>([]);

  useEffect(() => {
    if (!user) return;
    apiGetAllEmergencies().then((all) => {
      const userReports = all.filter((r) => r.user_id === user.user_id && r.status_name === 'RESOLVED');
      setReports(userReports);
      const idParam = params.get('id');
      if (idParam) setSelectedId(parseInt(idParam));
      else if (userReports.length > 0) setSelectedId(userReports[0].emergency_id);
    });
    setExistingFeedback(initialFeedbacks.filter((f) => f.user_id === user.user_id));
  }, [user, params]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) {
      toast('Please select an emergency to rate.', 'error');
      return;
    }
    if (rating === 0) {
      toast('Please select a star rating.', 'error');
      return;
    }
    setLoading(true);
    const res = await apiSubmitFeedback(user.user_id, selectedId, rating, comment);
    setLoading(false);
    if (res.success) {
      toast('Thank you for your feedback!');
      setExistingFeedback([
        { feedback_id: Date.now(), user_id: user.user_id, emergency_id: selectedId, rating, comment, created_at: new Date().toISOString() },
        ...existingFeedback,
      ]);
      setRating(0);
      setComment('');
    } else {
      toast(res.message, 'error');
    }
  };

  return (
    <DashboardLayout title="Feedback">
      <p className="text-sm text-neutral-500 mb-4">Rate your experience and help us improve emergency response.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback form */}
        <Card>
          <CardHeader title="Submit Feedback" subtitle="Rate your emergency response experience" />
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            <div>
              <label className="label">Select Emergency</label>
              <select
                value={selectedId ?? ''}
                onChange={(e) => setSelectedId(parseInt(e.target.value))}
                className="input"
              >
                {reports.length === 0 && <option value="">No resolved emergencies</option>}
                {reports.map((r) => (
                  <option key={r.emergency_id} value={r.emergency_id}>
                    #{String(r.emergency_id).padStart(3, '0')} · {r.type_name} · {new Date(r.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-warning-400 text-warning-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-semibold text-neutral-600">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="label">Comment</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 w-4.5 h-4.5 text-neutral-400" />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="input pl-10 resize-none"
                  placeholder="Share your experience with the response team..."
                />
              </div>
            </div>

            <button type="submit" disabled={loading || reports.length === 0} className="btn-primary w-full py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </Card>

        {/* Previous feedback */}
        <div>
          <Card>
            <CardHeader title="Your Previous Feedback" subtitle={`${existingFeedback.length} submissions`} />
            {existingFeedback.length === 0 ? (
              <div className="p-8 text-center text-neutral-400">
                <Star className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
                <p className="text-sm">No feedback submitted yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {existingFeedback.map((f) => (
                  <div key={f.feedback_id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-semibold text-neutral-700">
                        Emergency #{String(f.emergency_id).padStart(3, '0')}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${s <= f.rating ? 'fill-warning-400 text-warning-400' : 'text-neutral-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 leading-snug">{f.comment}</p>
                    <p className="text-xs text-neutral-400 mt-1">{new Date(f.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
