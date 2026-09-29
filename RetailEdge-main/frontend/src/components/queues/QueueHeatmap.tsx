import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { QueueHeatmapData } from '../../types/queue';

interface QueueHeatmapProps {
  data: QueueHeatmapData;
  loading?: boolean;
}

export const QueueHeatmap: React.FC<QueueHeatmapProps> = ({ data, loading }) => {
  const [zone, setZone] = useState('Checkout Area');

  return (
    <DashboardCard
      title="Queue Heatmap"
      className="h-full"
      loading={loading}
      headerAction={
        <div className="relative">
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md py-1 pl-2.5 pr-6 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
          >
            <option value="Checkout Area">Checkout Area</option>
            <option value="Self Checkout">Self Checkout</option>
            <option value="Express Counters">Express Counters</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      }
    >
      <div className="flex flex-col justify-between h-full pt-1">
        {/* Heatmap Image */}
        <div className="relative w-full rounded-lg overflow-hidden border border-slate-200/80 bg-slate-950">
          <img
            src={data.imageUrl || '/images/queues/queue_heatmap.png'}
            alt="Queue Density Heatmap"
            className="w-full h-auto object-cover block aspect-16/10"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10.5px] mt-2.5 font-medium">
          {data.legend.map((item) => (
            <span key={item.name} className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default QueueHeatmap;
