import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { StorePerformanceItem } from '../../types/store';
import { formatCurrencyINR, formatNumberIN } from '../../utils/formatters';

interface StorePerformanceProps {
  data: StorePerformanceItem[];
  metric?: string;
  onMetricChange?: (metric: string) => void;
}

export const StorePerformance: React.FC<StorePerformanceProps> = ({
  data,
  metric = 'Sales Revenue (₹)',
  onMetricChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(metric);

  const metricOptions = [
    'Sales Revenue (₹)',
    'Footfall',
    'Orders',
    'Average Transaction Value',
    'Conversion Rate',
  ];

  const handleSelectMetric = (m: string) => {
    setSelectedMetric(m);
    setDropdownOpen(false);
    if (onMetricChange) onMetricChange(m);
  };

  const getMetricValue = (item: StorePerformanceItem) => {
    switch (selectedMetric) {
      case 'Footfall':
        return item.footfall;
      case 'Orders':
        return item.orders;
      case 'Average Transaction Value':
        return item.averageTransactionValue;
      case 'Conversion Rate':
        return item.conversionRate;
      case 'Sales Revenue (₹)':
      default:
        return item.salesRevenue;
    }
  };

  const formatMetricDisplay = (val: number) => {
    switch (selectedMetric) {
      case 'Footfall':
      case 'Orders':
        return formatNumberIN(val);
      case 'Average Transaction Value':
        return `₹ ${val}`;
      case 'Conversion Rate':
        return `${val}%`;
      case 'Sales Revenue (₹)':
      default:
        return formatCurrencyINR(val);
    }
  };

  // Find max value for bar width calculation
  const maxVal = Math.max(...data.map((d) => getMetricValue(d)), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          Store Performance
        </h3>

        {/* Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 hover:border-slate-300 shadow-2xs"
          >
            <span>{selectedMetric}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-[11px]">
              {metricOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectMetric(opt)}
                  className={`w-full text-left px-2.5 py-1 hover:bg-slate-50 transition-colors ${
                    selectedMetric === opt ? 'text-emerald-600 font-bold' : 'text-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Bars List (10 rows) */}
      <div className="space-y-1.5 py-0.5">
        {data.slice(0, 10).map((item) => {
          const val = getMetricValue(item);
          const widthPercent = Math.min(100, Math.round((val / maxVal) * 100));

          return (
            <div key={item.storeId} className="flex items-center gap-2 text-[10.5px]">
              {/* Store Name */}
              <div className="w-32 shrink-0 truncate text-slate-600 font-medium">
                {item.storeName}
              </div>

              {/* Bar track */}
              <div className="flex-1 bg-slate-100 rounded-sm h-3 overflow-hidden flex items-center">
                <div
                  className="h-full bg-emerald-500 rounded-r-xs transition-all duration-300 ease-out"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              {/* Value aligned right */}
              <div className="w-20 text-right font-bold text-slate-800 shrink-0 text-[10.5px]">
                {formatMetricDisplay(val)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorePerformance;
