import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'primary' | 'info' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
  trend?: string;
}

const colorMap = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', ring: 'ring-primary-100' },
  info:    { bg: 'bg-info-50',    icon: 'text-info-600',    ring: 'ring-info-100' },
  accent:  { bg: 'bg-accent-50',  icon: 'text-accent-600',   ring: 'ring-accent-100' },
  success: { bg: 'bg-success-50', icon: 'text-success-600', ring: 'ring-success-100' },
  warning: { bg: 'bg-warning-50', icon: 'text-warning-600', ring: 'ring-warning-100' },
  error:   { bg: 'bg-error-50',   icon: 'text-error-600',   ring: 'ring-error-100' },
  neutral: { bg: 'bg-neutral-100',icon: 'text-neutral-600', ring: 'ring-neutral-200' },
};

export function StatCard({ label, value, icon: Icon, color = 'info', trend }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1 font-display">{value}</p>
          {trend && <p className="text-xs text-neutral-400 mt-1">{trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ring-4 ${c.ring}`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between p-5 border-b border-neutral-100">
      <div>
        <h3 className="font-display font-bold text-neutral-900">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
