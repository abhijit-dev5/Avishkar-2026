// Lightweight chart components built with pure SVG.
// No external chart library needed for the prototype.

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="w-full">
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2">
            <span className="text-xs font-bold text-neutral-700">{d.value}</span>
            <div
              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
              style={{
                height: `${(d.value / max) * 100}%`,
                backgroundColor: d.color ?? '#3b82f6',
                minHeight: '4px',
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-xs text-neutral-500 font-medium leading-tight block">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 160 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {data.map((d, i) => {
            const dash = (d.value / total) * circumference;
            const seg = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={16}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                className="transition-all duration-500"
              />
            );
            offset += dash;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-display text-neutral-900">{total}</span>
          <span className="text-xs text-neutral-500">Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-neutral-600 font-medium">{d.label}</span>
            <span className="text-sm text-neutral-400 ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function LineChart({ data, height = 180, color = '#dc2626' }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 100;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (d.value / max) * (height - 20) - 10,
  ...d,
  }));

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="w-full">
      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#lineGrad)" />
          <path d={path} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-neutral-500">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
