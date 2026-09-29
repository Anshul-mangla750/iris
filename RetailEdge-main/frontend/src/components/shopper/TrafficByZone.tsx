import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { ZoneTrafficItem } from '../../types/shopper';

interface TrafficByZoneProps {
  zones: ZoneTrafficItem[];
  loading?: boolean;
}

export const TrafficByZone: React.FC<TrafficByZoneProps> = ({ zones, loading }) => {
  const [filter, setFilter] = useState('All Zones');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const maxCount = Math.max(...zones.map((z) => z.count), 350);

  return (
    <DashboardCard
      title="Traffic by Zone"
      headerAction={
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>{filter}</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-[11px]">
              {['All Zones', 'Main Aisles', 'Checkout'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setFilter(item);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1 hover:bg-slate-50 font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      }
      className="h-full"
      loading={loading}
    >
      <div className="space-y-1.5 h-40 sm:h-44 pt-0.5 overflow-y-auto pr-1 scrollbar-thin">
        {zones.map((zone) => {
          const widthPercent = (zone.count / maxCount) * 100;
          return (
            <div key={zone.id} className="flex items-center gap-2 text-[10.5px]">
              <span className="w-24 text-slate-600 font-medium truncate" title={zone.zoneName}>
                {zone.zoneName}
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0fa968] rounded-full transition-all duration-300"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
              <span className="w-7 text-right font-bold text-slate-800 text-[10.5px]">
                {zone.count}
              </span>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export default TrafficByZone;
