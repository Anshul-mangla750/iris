import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';

interface PathAnalysisProps {
  mapUrl?: string;
  loading?: boolean;
}

export const PathAnalysis: React.FC<PathAnalysisProps> = ({
  mapUrl = '/images/shopper/path_map.jpg',
  loading,
}) => {
  const legendItems = [
    { label: 'Entry', color: '#10B981' },
    { label: 'Main Path', color: '#2563EB' },
    { label: 'Popular Path', color: '#F59E0B' },
    { label: 'Exit', color: '#EF4444' },
  ];

  return (
    <DashboardCard title="Path Analysis" className="h-full" loading={loading}>
      <div className="flex items-center gap-2 h-40 sm:h-44 pt-1">
        {/* Floor Plan with Paths */}
        <div className="flex-1 h-full rounded-lg bg-slate-50 border border-slate-200/70 overflow-hidden relative flex items-center justify-center p-1">
          <img
            src={mapUrl}
            alt="Customer Path Analysis Floorplan"
            className="w-full h-full object-contain select-none"
          />
        </div>

        {/* Legend Aligned to Right */}
        <div className="flex flex-col justify-center space-y-2 shrink-0 pr-1 text-[10.5px]">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 font-medium whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default PathAnalysis;
