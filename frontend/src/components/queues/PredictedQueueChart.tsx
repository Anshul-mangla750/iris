import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { PredictedQueuePoint } from '../../types/queue';

interface PredictedQueueChartProps {
  data: PredictedQueuePoint[];
  loading?: boolean;
}

export const PredictedQueueChart: React.FC<PredictedQueueChartProps> = ({ data, loading }) => {
  const [horizon, setHorizon] = useState('Next 2 Hours');

  return (
    <DashboardCard
      title="Predicted Queue Length (XGBoost)"
      className="h-full"
      loading={loading}
      headerAction={
        <div className="relative">
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md py-1 pl-2.5 pr-6 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
          >
            <option value="Next 2 Hours">Next 2 Hours</option>
            <option value="Next 4 Hours">Next 4 Hours</option>
            <option value="Today">Today</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      }
    >
      <div className="w-full pt-1">
        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] mb-2 font-medium">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Predicted Queue
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-3 h-2 rounded-xs bg-[#10B981]/20 border border-[#10B981]/40" />
            Confidence Range
          </span>
        </div>

        {/* Chart */}
        <div className="h-36 sm:h-40 w-full">
          <ResponsiveContainer width="100%" height={150}>
            <ComposedChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                domain={[0, 20]}
                ticks={[0, 5, 10, 15, 20]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '6px',
                  fontSize: '11px',
                }}
              />
              <Area
                type="monotone"
                dataKey="upperBound"
                fill="#10B981"
                fillOpacity={0.15}
                stroke="transparent"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted Queue"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#10B981' }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  );
};

export default PredictedQueueChart;
