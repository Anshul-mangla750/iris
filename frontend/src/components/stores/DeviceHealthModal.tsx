import React from 'react';
import { X, Camera, Cpu, Calculator, Wifi, CheckCircle, AlertTriangle } from 'lucide-react';
import type { DeviceCategoryHealth } from '../../types/store';

interface DeviceHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: DeviceCategoryHealth[];
}

export const DeviceHealthModal: React.FC<DeviceHealthModalProps> = ({
  isOpen,
  onClose,
  devices,
}) => {
  if (!isOpen) return null;

  const renderIcon = (key: string) => {
    switch (key) {
      case 'cameras':
        return <Camera className="w-5 h-5 text-emerald-600" />;
      case 'edgeDevices':
        return <Cpu className="w-5 h-5 text-emerald-600" />;
      case 'posSystems':
        return <Calculator className="w-5 h-5 text-emerald-600" />;
      case 'network':
      default:
        return <Wifi className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Device Health Overview (All Stores)
            </h3>
            <p className="text-[11px] text-slate-500">
              Comprehensive telemetry across edge IoT devices and store infrastructure
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {devices.map((device) => (
              <div
                key={device.category}
                className="p-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    {renderIcon(device.key)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {device.category}
                    </div>
                    <div className="text-[10.5px] text-slate-500">
                      Total Deployed: <span className="font-semibold text-slate-700">{device.total}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                      <CheckCircle className="w-3 h-3" />
                      <span>{device.online} Online</span>
                    </div>
                    {device.offline > 0 ? (
                      <div className="text-[10px] font-semibold text-red-500 flex items-center gap-1 justify-end">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{device.offline} Offline</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400">0 Offline</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-4 py-2.5 border-t border-slate-100 bg-slate-50/40">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceHealthModal;
