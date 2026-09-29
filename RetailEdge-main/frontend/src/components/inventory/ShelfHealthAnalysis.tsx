import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';
import type { ShelfHealthAnalysisData } from '../../types/inventory';

interface ShelfHealthAnalysisProps {
  data: ShelfHealthAnalysisData;
  loading?: boolean;
}

export const ShelfHealthAnalysis: React.FC<ShelfHealthAnalysisProps> = ({ data, loading }) => {
  return (
    <DashboardCard title="Shelf Health - AI Analysis" className="h-full" loading={loading}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Heatmap overlay image */}
        <div className="relative flex-1 w-full rounded-lg overflow-hidden border border-slate-200/80 bg-slate-950">
          <img
            src={data.imageUrl || '/images/inventory/shelf_health.png'}
            alt="Shelf Health AI Thermal Map"
            className="w-full h-auto object-cover block aspect-16/10"
          />
        </div>

        {/* Legend side panel */}
        <div className="flex sm:flex-col flex-wrap gap-2 sm:gap-2.5 shrink-0 sm:w-28 text-[11px]">
          {data.legend.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-200/80"
            >
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700 font-medium text-[10.5px] truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default ShelfHealthAnalysis;
