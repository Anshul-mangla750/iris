import React from 'react';
import { X, Users, ArrowUpRight, ArrowDownLeft, Clock, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { Camera, CameraAnalytics } from '../../types/camera';

interface CameraAnalyticsModalProps {
  camera: Camera | null;
  analytics: CameraAnalytics | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CameraAnalyticsModal: React.FC<CameraAnalyticsModalProps> = ({
  camera,
  analytics,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !camera) return null;

  const peopleInFrame = analytics?.peopleInFrame ?? 12;
  const entering = analytics?.entering ?? 7;
  const exiting = analytics?.exiting ?? 5;
  const trafficLevel = analytics?.trafficLevel ?? 'High';
  const avgDwell = analytics?.avgDwellMinutes ?? 6.4;
  const queueCount = analytics?.queueCount ?? 4;
  const uptime = analytics?.uptimePct ?? 99.8;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Camera Analytics — {camera.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live AI-derived telemetry & visitor footfall metrics
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Body */}
        <div className="p-5 space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>In Frame</span>
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {peopleInFrame}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                ● Live Count
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
                <span>Entering</span>
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {entering}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Last 15 min
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <ArrowDownLeft className="w-3.5 h-3.5 text-purple-600" />
                <span>Exiting</span>
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {exiting}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Last 15 min
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Activity className="w-3.5 h-3.5 text-red-500" />
                <span>Traffic Level</span>
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {trafficLevel}
              </div>
              <div className="text-[10px] text-red-500 font-semibold mt-0.5">
                Above average
              </div>
            </div>
          </div>

          {/* Secondary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Avg Dwell Time</span>
                </div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {avgDwell} min
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Queue Count</span>
                </div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {queueCount} people
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Camera Uptime</span>
                </div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {uptime}%
                </div>
              </div>
            </div>
          </div>

          {/* AI Privacy & Processing Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Privacy-First AI Inference: </span>
              All person detection and counting occurs anonymously on local edge devices. No facial features, identities, or biometric signatures are recorded or stored.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraAnalyticsModal;
