import React from 'react';
import { X, Bell, AlertTriangle } from 'lucide-react';
import type { RecentQueueEventItem } from '../../types/queue';

interface QueueEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: RecentQueueEventItem[];
}

export const QueueEventsModal: React.FC<QueueEventsModalProps> = ({
  isOpen,
  onClose,
  events,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">All Queue Activity & Events</h2>
              <p className="text-[11px] text-slate-400">
                Chronological checkout counter queue logs and staffing actions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200/90 bg-white hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{evt.event}</span>
                    <span className="text-[10px] font-mono text-slate-400">• {evt.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {evt.counter}: {evt.details}
                  </p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  evt.status === 'Open'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}
              >
                {evt.status}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Showing {events.length} logged queue events
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0fa968] text-white text-xs font-bold hover:bg-emerald-600 shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueEventsModal;
