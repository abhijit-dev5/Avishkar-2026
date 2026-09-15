import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Brain, Loader2, CheckCircle2, AlertTriangle, Activity, Siren,
  TrendingUp, ArrowRight, MapPin, type LucideIcon,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SeverityBadge, PriorityBadge } from '@/components/ui/Badges';
import { apiAnalyzeEmergency } from '@/services/api';
import { emergencyTypes, departments } from '@/data/mockData';
import type { AiAnalysis as AiAnalysisType, DepartmentType } from '@/types/models';

const deptTypeMap: Record<DepartmentType, string> = {
  POLICE: 'Police Department',
  FIRE: 'Fire Department',
  MEDICAL: 'Ambulance / Medical Dept',
  DISASTER: 'Disaster Management Dept',
  ELECTRICITY: 'Electricity Department',
};

const deptIconMap: Record<DepartmentType, LucideIcon> = {
  POLICE: Siren,
  FIRE: AlertTriangle,
  MEDICAL: Activity,
  DISASTER: AlertTriangle,
  ELECTRICITY: AlertTriangle,
};

const processingSteps = [
  'Uploading image to analysis server...',
  'Running image classification model...',
  'Detecting emergency type...',
  'Calculating confidence score...',
  'Assessing severity level...',
  'Determining response priority...',
  'Matching recommended departments...',
];

export function AiAnalysis() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const emergencyId = params.get('id');
  const typeId = parseInt(params.get('type') || '1');
  const [phase, setPhase] = useState<'processing' | 'result'>('processing');
  const [stepIdx, setStepIdx] = useState(0);
  const [analysis, setAnalysis] = useState<AiAnalysisType | null>(null);

  const emergencyType = emergencyTypes.find((t) => t.emergency_type_id === typeId);

  useEffect(() => {
    // Animate processing steps
    const interval = setInterval(() => {
      setStepIdx((i) => {
        if (i >= processingSteps.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, 280);

    // Fetch AI analysis
    apiAnalyzeEmergency(typeId).then((result) => {
      if (result) {
        setTimeout(() => {
          setAnalysis(result);
          setPhase('result');
        }, 2200);
      }
    });

    return () => clearInterval(interval);
  }, [typeId]);

  return (
    <DashboardLayout title="AI Analysis">
      <div className="max-w-3xl">
        {phase === 'processing' && (
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="relative inline-flex">
                <div className="absolute inset-0 w-20 h-20 rounded-full bg-info-500/20 animate-pulse-ring" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-info-500 to-info-700 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="font-display font-bold text-xl text-neutral-900 mt-4">AI Analyzing Your Report</h2>
              <p className="text-sm text-neutral-500 mt-1">
                {emergencyType?.type_name} · Emergency #{emergencyId}
              </p>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              {processingSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 transition-all ${i <= stepIdx ? 'opacity-100' : 'opacity-30'}`}>
                  {i < stepIdx ? (
                    <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />
                  ) : i === stepIdx ? (
                    <Loader2 className="w-5 h-5 text-info-500 shrink-0 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-200 shrink-0" />
                  )}
                  <span className={`text-sm ${i <= stepIdx ? 'text-neutral-700 font-medium' : 'text-neutral-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'result' && analysis && (
          <div className="animate-slide-up">
            {/* Success header */}
            <div className="card p-6 mb-6 bg-gradient-to-br from-success-50 to-white border-success-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success-500 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-neutral-900">AI Analysis Complete</h2>
                  <p className="text-sm text-neutral-500">Emergency #{emergencyId} · {new Date(analysis.analysis_time).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Uploaded image placeholder */}
            <div className="card p-5 mb-6">
              <p className="text-sm font-semibold text-neutral-700 mb-3">Uploaded Image</p>
              <div className="h-48 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-neutral-200 flex items-center justify-center mx-auto mb-2">
                    <Brain className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-sm text-neutral-400">Image preview (simulated)</p>
                </div>
              </div>
            </div>

            {/* Analysis results */}
            <div className="card p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <Brain className="w-5 h-5 text-info-600" />
                <h3 className="font-display font-bold text-neutral-900">AI Analysis Result</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Detected type */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold uppercase">
                    <Siren className="w-3.5 h-3.5" /> Detected Emergency
                  </div>
                  <p className="text-lg font-bold text-neutral-900 mt-1">{analysis.detected_type}</p>
                </div>

                {/* Confidence */}
                <div className="p-4 rounded-xl bg-info-50 border border-info-100">
                  <div className="flex items-center gap-2 text-info-600 text-xs font-semibold uppercase">
                    <TrendingUp className="w-3.5 h-3.5" /> Confidence Score
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-bold text-info-700">{analysis.confidence}%</p>
                    <div className="flex-1 h-2 rounded-full bg-info-100 overflow-hidden">
                      <div className="h-full bg-info-500 rounded-full transition-all duration-1000" style={{ width: `${analysis.confidence}%` }} />
                    </div>
                  </div>
                </div>

                {/* Severity */}
                <div className="p-4 rounded-xl bg-accent-50 border border-accent-100">
                  <div className="flex items-center gap-2 text-accent-600 text-xs font-semibold uppercase">
                    <AlertTriangle className="w-3.5 h-3.5" /> Severity
                  </div>
                  <div className="mt-1.5"><SeverityBadge severity={analysis.severity} /></div>
                </div>

                {/* Priority */}
                <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
                  <div className="flex items-center gap-2 text-primary-600 text-xs font-semibold uppercase">
                    <Activity className="w-3.5 h-3.5" /> Priority
                  </div>
                  <div className="mt-1.5"><PriorityBadge priority={analysis.priority} /></div>
                </div>
              </div>
            </div>

            {/* Recommended departments */}
            <div className="card p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary-600" />
                <h3 className="font-display font-bold text-neutral-900">Recommended Departments</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysis.recommended_departments.map((deptType) => {
                  const dept = departments.find((d) => d.department_type === deptType);
                  const Icon = deptIconMap[deptType] ?? Siren;
                  return (
                    <div key={deptType} className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/30 transition">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-neutral-900">{deptTypeMap[deptType]}</p>
                        <p className="text-xs text-neutral-500">{dept?.contact ?? '—'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next steps */}
            <div className="p-5 rounded-xl bg-info-50 border border-info-100 mb-6">
              <p className="text-sm text-info-800">
                <strong>What happens next?</strong> Your report has been submitted to the admin for verification.
                Once verified, the recommended department will be assigned and a responder will be dispatched.
                You'll receive notifications at every step.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/citizen/track?id=${emergencyId}`} className="btn-info text-base px-6 py-3">
                Track This Emergency <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/citizen/report" className="btn-ghost text-base px-6 py-3">
                Report Another Emergency
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
