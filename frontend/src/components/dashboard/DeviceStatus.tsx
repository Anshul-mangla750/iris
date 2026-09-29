import React from 'react';
import { Camera, Cpu, CreditCard } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { DeviceStatusItem } from '../../types/dashboard';

interface DeviceStatusProps {
  devices: DeviceStatusItem[];
  loading?: boolean;
  className?: string;
}

export const DeviceStatus: React.FC<DeviceStatusProps> = ({ devices, loading, className = '' }) => {
  const getDeviceIcon = (type: DeviceStatusItem['type']) => {
    switch (type) {
      case 'camera':
        return <Camera className="w-3.5 h-3.5 text-slate-500" />;
      case 'edge':
        return <Cpu className="w-3.5 h-3.5 text-slate-500" />;
      case 'pos':
        return <CreditCard className="w-3.5 h-3.5 text-slate-500" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <DashboardCard
      title="System & Device Status"
      className={`h-full flex flex-col ${className}`}
      headerAction={
        <button className="text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
          View All
        </button>
      }
      loading={loading}
    >
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              <th className="pb-2 font-medium">Devices</th>
              <th className="pb-2 font-medium text-center">Status</th>
              <th className="pb-2 font-medium text-right">Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {devices.map((device) => {
              const isConnected = device.status === 'Connected';
              const isOnline = device.status === 'Online';

              return (
                <tr key={device.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-1.5 pr-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                        {getDeviceIcon(device.type)}
                      </div>
                      <span className="font-medium text-slate-800 truncate" title={device.name}>
                        {device.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-1.5 px-1 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        isConnected
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                          : isOnline
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isConnected
                            ? 'bg-blue-600'
                            : isOnline
                            ? 'bg-emerald-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      {device.status}
                    </span>
                  </td>
                  <td className="py-1.5 pl-2 text-right font-semibold text-slate-700">
                    {device.uptime}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default DeviceStatus;
