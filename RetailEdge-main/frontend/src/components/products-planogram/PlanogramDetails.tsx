import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlanogramItem } from '../../types/planogram';

interface PlanogramDetailsProps {
  planogram: PlanogramItem | null;
}

export const PlanogramDetails: React.FC<PlanogramDetailsProps> = ({ planogram }) => {
  const navigate = useNavigate();

  if (!planogram) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 text-center text-slate-400">
        No details available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 flex flex-col justify-between h-full min-h-[300px]">
      <div>
        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
          Planogram Details
        </h3>

        {/* Detail rows */}
        <div className="space-y-2.5 text-xs">
          {/* Status */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Status</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                planogram.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  planogram.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {planogram.status}
            </span>
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Last Updated</span>
            <span className="font-semibold text-slate-800">
              {planogram.lastUpdated || '24 Sep 2024, 10:30 AM'}
            </span>
          </div>

          {/* Total Shelves */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Total Shelves</span>
            <span className="font-bold text-slate-900">
              {planogram.shelfCount}
            </span>
          </div>

          {/* Total SKUs */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Total SKUs</span>
            <span className="font-bold text-slate-900">
              {planogram.totalSkus}
            </span>
          </div>

          {/* Assigned To */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Assigned To</span>
            <span className="font-semibold text-slate-800 truncate max-w-[130px] text-right">
              {planogram.assignedTo}
            </span>
          </div>

          {/* Compliance Rate & Progress Bar */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-500 font-medium">Compliance Rate</span>
              <span className="font-extrabold text-emerald-600 text-xs">
                {planogram.complianceRate}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0FA968] rounded-full transition-all duration-500"
                style={{ width: `${planogram.complianceRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* View Compliance Report Button */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => navigate('/planogram')}
          className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs text-center"
        >
          View Compliance Report
        </button>
      </div>
    </div>
  );
};

export default PlanogramDetails;
