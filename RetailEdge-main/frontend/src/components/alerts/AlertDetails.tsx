import React from 'react';
import {
  AlertTriangle,
  Lightbulb,
  Clock,
  UserPlus,
  Play,
  CheckCircle,
  Camera,
} from 'lucide-react';
import type { Alert } from '../../types/alert';
import { getAlertSeverityMeta, getAlertSourceMeta } from '../../utils/alertMeta';

interface AlertDetailsProps {
  alert: Alert | null;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  onOpenAssignModal: (alert: Alert) => void;
}

export const AlertDetails: React.FC<AlertDetailsProps> = ({
  alert,
  onAcknowledge,
  onResolve,
  onOpenAssignModal,
}) => {
  if (!alert) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs text-center text-slate-400 text-xs">
        No alert selected. Click &quot;View&quot; on any alert in the table.
      </div>
    );
  }

  const severityMeta = getAlertSeverityMeta(alert.severity);
  const sourceMeta = getAlertSourceMeta(alert.sourceModule);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between space-y-2.5">
      {/* 1. Header with Title and Severity Badge */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          Alert Details
        </h3>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${severityMeta.badgeBg} ${severityMeta.badgeText}`}
        >
          {severityMeta.label}
        </span>
      </div>

      {/* 2. Alert Subject & Timestamp */}
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg ${severityMeta.iconBg} ${severityMeta.iconColor} flex items-center justify-center shrink-0`}
        >
          <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
        </div>
        <div className="min-w-0">
          <h4 className="text-[12.5px] font-bold text-slate-900 leading-tight truncate">
            {alert.message}
          </h4>
          <p className="text-[10px] text-slate-400">
            Detected at {alert.createdAt}
          </p>
        </div>
      </div>

      {/* 3. Metadata Grid & Shelf/Camera Feed Preview */}
      <div className="flex items-start justify-between gap-3">
        {/* Left Info Table */}
        <div className="flex-1 space-y-0.5 text-[10.5px] min-w-0">
          <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
            <span className="text-slate-400 font-medium">Category</span>
            <span className="text-slate-800 font-semibold">{sourceMeta.label}</span>
          </div>
          <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
            <span className="text-slate-400 font-medium">Store</span>
            <span className="text-slate-800 font-semibold truncate max-w-[150px]">
              {alert.storeName}
            </span>
          </div>
          <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
            <span className="text-slate-400 font-medium">Location</span>
            <span className="text-slate-800 font-semibold truncate max-w-[150px]">
              {alert.location || 'Store Floor'}
            </span>
          </div>
          {alert.product && (
            <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Product</span>
              <span className="text-slate-800 font-semibold truncate max-w-[150px]">
                {alert.product}
              </span>
            </div>
          )}
          {alert.currentStock !== undefined && (
            <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Current Stock</span>
              <span className="text-slate-800 font-semibold">{alert.currentStock}</span>
            </div>
          )}
          {alert.expectedStock !== undefined && (
            <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Expected Stock</span>
              <span className="text-slate-800 font-semibold">{alert.expectedStock}</span>
            </div>
          )}
          <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
            <span className="text-slate-400 font-medium">Camera</span>
            <span className="text-slate-800 font-semibold flex items-center gap-1">
              <Camera className="w-3 h-3 text-slate-400" />
              {alert.camera || 'Camera 1'}
            </span>
          </div>
          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-400 font-medium">Confidence</span>
            <span className="text-slate-800 font-semibold">{alert.confidence || '96%'}</span>
          </div>
        </div>

        {/* Right Preview Image */}
        <div className="w-28 sm:w-32 h-[106px] shrink-0 relative rounded-lg overflow-hidden border border-slate-200/90 bg-slate-900 shadow-2xs flex items-center justify-center">
          {alert.image ? (
            <img
              src={alert.image}
              alt="Alert Camera View"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-2 text-slate-400 text-[10px]">
              <Camera className="w-5 h-5 mx-auto mb-1 text-slate-500" />
              Live Visual
            </div>
          )}
        </div>
      </div>

      {/* 4. Recommended Actions & Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center pt-1.5 border-t border-slate-100">
        {/* Recommended Actions List */}
        <div className="sm:col-span-7 space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 stroke-[2.2]" />
            <span>Recommended Actions</span>
          </div>
          <ol className="text-[10px] text-slate-600 space-y-0.5 pl-4 list-decimal marker:text-slate-400 font-medium">
            {alert.recommendations?.length > 0 ? (
              alert.recommendations.map((rec, i) => (
                <li key={i} className="line-clamp-1">
                  {rec}
                </li>
              ))
            ) : (
              <li>{alert.recommendation || 'Investigate aisle and restock as required.'}</li>
            )}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="sm:col-span-5 space-y-1.5">
          {alert.status === 'OPEN' ? (
            <button
              type="button"
              onClick={() => onAcknowledge(alert.id)}
              className="w-full py-1.5 px-2 bg-[#0fa968] hover:bg-[#0d8f58] text-white text-[10.5px] font-bold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Mark as In Progress</span>
            </button>
          ) : alert.status === 'ACKNOWLEDGED' ? (
            <button
              type="button"
              onClick={() => onResolve(alert.id)}
              className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Mark as Resolved</span>
            </button>
          ) : (
            <div className="w-full py-1.5 px-2 bg-emerald-50 text-emerald-700 text-[10.5px] font-bold rounded-lg text-center border border-emerald-200 flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Resolved</span>
            </div>
          )}

          {/* Assign to Staff button */}
          <button
            type="button"
            onClick={() => onOpenAssignModal(alert)}
            className="w-full py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-700 text-[10.5px] font-semibold rounded-lg border border-slate-200/90 shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3 h-3 text-slate-500" />
            <span className="truncate">Assign to Staff</span>
          </button>
        </div>
      </div>

      {/* 5. Alert History Timeline */}
      <div className="pt-1.5 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 mb-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Alert History</span>
        </div>

        <div className="relative pl-4 space-y-1.5 border-l border-slate-200 ml-2">
          {alert.history.map((h, i) => {
            const dotBg =
              h.dotColor === 'red'
                ? 'bg-red-500'
                : h.dotColor === 'green'
                ? 'bg-emerald-500'
                : h.dotColor === 'amber'
                ? 'bg-amber-500'
                : 'bg-blue-500';

            return (
              <div key={h.id || i} className="relative text-[10px] leading-tight">
                {/* Dot */}
                <span
                  className={`absolute -left-[20px] top-1 w-2 h-2 rounded-full ${dotBg} ring-2 ring-white`}
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 font-semibold">{h.timestamp}</span>
                  <span className="text-slate-800 font-bold">{h.action}</span>
                  <span className="text-slate-500 font-medium">({h.description})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertDetails;
