import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import type { CameraHealthItem } from '../../types/camera';

interface CameraHealthDrawerProps {
  healthItems: CameraHealthItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const CameraHealthDrawer: React.FC<CameraHealthDrawerProps> = ({
  healthItems,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  All Cameras Health & Telemetry
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive hardware status, uptime & storage breakdown
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/80">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Camera</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Resolution</th>
                    <th className="py-2.5 px-3 font-semibold text-right">FPS</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Uptime</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Storage</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Last Checked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {healthItems.map((item) => {
                    const isOffline = item.status === 'OFFLINE';

                    return (
                      <tr key={item.cameraId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-3 font-bold text-slate-800">
                          {item.cameraName}
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isOffline
                                ? 'bg-red-50 text-red-700 border border-red-200/80'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isOffline ? 'bg-red-500' : 'bg-emerald-500'
                              }`}
                            />
                            <span>{isOffline ? 'Offline' : 'Online'}</span>
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-slate-600">
                          {item.resolution}
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-slate-600">
                          {item.fps}
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-slate-600">
                          {item.uptime}
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-slate-600">
                          {item.storageUsage}
                        </td>
                        <td
                          className={`py-2 px-3 text-right whitespace-nowrap ${
                            isOffline ? 'text-red-500 font-semibold' : 'text-slate-500'
                          }`}
                        >
                          {item.lastCheckedAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CameraHealthDrawer;
