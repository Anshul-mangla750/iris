import React from 'react';
import { Camera, Cpu, Calculator, Wifi, ChevronRight } from 'lucide-react';
import type { DeviceCategoryHealth } from '../../types/store';
import { DEVICE_HEALTH_DATA } from '../../data/storeMockData';

interface DeviceHealthProps {
  data?: DeviceCategoryHealth[];
  onViewDetailsClick: () => void;
}

export const DeviceHealth: React.FC<DeviceHealthProps> = ({
  data,
  onViewDetailsClick,
}) => {
  const safeData = Array.isArray(data) && data.length > 0 ? data : DEVICE_HEALTH_DATA;

  const renderIcon = (key: string) => {
    switch (key) {
      case 'cameras':
        return <Camera className="w-4 h-4 text-emerald-600" />;
      case 'edgeDevices':
        return <Cpu className="w-4 h-4 text-emerald-600" />;
      case 'posSystems':
        return <Calculator className="w-4 h-4 text-emerald-600" />;
      case 'network':
      default:
        return <Wifi className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
        <h3 className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight">
          Device Health (All Stores)
        </h3>
        <button
          type="button"
          onClick={onViewDetailsClick}
          className="text-[10.5px] font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-0.5"
        >
          <span>View Details</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 4 Category Metric Boxes */}
      <div className="grid grid-cols-4 gap-1.5 py-0.5">
        {safeData.map((item) => {
          const isWarning = item.status === 'WARNING';

          return (
            <div
              key={item.category}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-center"
            >
              {/* Icon */}
              <div className="mb-0.5">{renderIcon(item.key)}</div>

              {/* Title */}
              <div className="text-[9.5px] font-medium text-slate-500 truncate w-full">
                {item.category}
              </div>

              {/* Counts */}
              <div className="text-xs font-bold text-slate-900 tracking-tight leading-tight my-0.5">
                {item.online} / {item.total}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1 text-[9px] font-semibold">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                <span className={isWarning ? 'text-amber-600' : 'text-emerald-600'}>
                  {item.statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceHealth;
