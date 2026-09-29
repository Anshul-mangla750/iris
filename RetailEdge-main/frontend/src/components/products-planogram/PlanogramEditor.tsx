import React from 'react';
import type { PlanogramItem, PlanogramComplianceSummary } from '../../types/planogram';
import { PlanogramVisualView } from './PlanogramVisualView';
import { PlanogramTableView } from './PlanogramTableView';
import { PlanogramComplianceView } from './PlanogramComplianceView';

interface PlanogramEditorProps {
  planogram: PlanogramItem | null;
  viewMode: 'visual' | 'table' | 'compliance';
  onViewModeChange: (mode: 'visual' | 'table' | 'compliance') => void;
  complianceData: PlanogramComplianceSummary;
}

export const PlanogramEditor: React.FC<PlanogramEditorProps> = ({
  planogram,
  viewMode,
  onViewModeChange,
  complianceData,
}) => {
  if (!planogram) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-8 text-center text-slate-400">
        No planogram selected.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 flex flex-col h-full min-h-[300px]">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Planogram Editor - {planogram.name}
        </h3>

        {/* View Mode Tabs */}
        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange('visual')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
              viewMode === 'visual'
                ? 'bg-[#0FA968] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visual View
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-[#0FA968] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Table View
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('compliance')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
              viewMode === 'compliance'
                ? 'bg-[#0FA968] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compliance View
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex flex-col justify-center">
        {viewMode === 'visual' && <PlanogramVisualView planogram={planogram} />}
        {viewMode === 'table' && <PlanogramTableView planogram={planogram} />}
        {viewMode === 'compliance' && <PlanogramComplianceView compliance={complianceData} />}
      </div>
    </div>
  );
};

export default PlanogramEditor;
