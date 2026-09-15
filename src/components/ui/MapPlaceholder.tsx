import { MapPin, Navigation } from 'lucide-react';
import type { Location } from '@/types/models';

export function MapPlaceholder({ location, height = 'h-64' }: { location?: Location; height?: string }) {
  return (
    <div className={`relative ${height} rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200`}>
      {/* Simulated map grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Simulated roads */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path d="M 0 60% Q 50% 40%, 100% 70%" stroke="#94a3b8" strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M 30% 0 L 35% 100%" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M 0 30% L 100% 35%" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.3" />
      </svg>

      {/* Pin */}
      {location && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary-500/20 animate-pulse-ring" />
            <div className="relative w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2 px-3 py-1.5 bg-white rounded-lg shadow-card text-xs font-medium text-neutral-700 whitespace-nowrap">
            {location.area}, {location.city}
          </div>
        </div>
      )}

      {/* Coordinates badge */}
      {location && (
        <div className="absolute bottom-3 left-3 px-2.5 py-1.5 bg-white/90 backdrop-blur rounded-lg text-xs font-mono text-neutral-600 shadow-sm">
          <Navigation className="w-3 h-3 inline mr-1" />
          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </div>
      )}

      {/* Map label */}
      <div className="absolute top-3 right-3 px-2.5 py-1.5 bg-white/90 backdrop-blur rounded-lg text-xs font-medium text-neutral-500 shadow-sm">
        Map View
      </div>
    </div>
  );
}
