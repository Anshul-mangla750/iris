import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, PlusCircle } from 'lucide-react';
import type { PlanogramComplianceSummary } from '../../types/planogram';

interface PlanogramComplianceViewProps {
  compliance: PlanogramComplianceSummary;
}

export const PlanogramComplianceView: React.FC<PlanogramComplianceViewProps> = ({ compliance }) => {
  return (
    <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-200/80 min-h-[220px] flex flex-col justify-between">
      {/* Top Overview */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Overall Compliance
          </span>
          <span className="text-3xl font-extrabold text-emerald-600">
            {compliance.complianceRate}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-48">
          <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${compliance.complianceRate}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block text-right">
            Target: 95%+
          </span>
        </div>
      </div>

      {/* Grid of 4 Breakdown Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* Correct */}
        <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Correct</span>
            <span className="text-base font-bold text-slate-900">{compliance.correct}</span>
          </div>
        </div>

        {/* Misplaced */}
        <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Misplaced</span>
            <span className="text-base font-bold text-amber-600">{compliance.misplaced}</span>
          </div>
        </div>

        {/* Missing */}
        <div className="bg-white p-3 rounded-lg border border-rose-100 shadow-2xs flex items-center gap-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Missing</span>
            <span className="text-base font-bold text-rose-600">{compliance.missing}</span>
          </div>
        </div>

        {/* Extra */}
        <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs flex items-center gap-3">
          <PlusCircle className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Extra</span>
            <span className="text-base font-bold text-purple-600">{compliance.extra}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanogramComplianceView;
