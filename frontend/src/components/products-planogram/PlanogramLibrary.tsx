import React from 'react';
import { Search } from 'lucide-react';
import type { PlanogramItem } from '../../types/planogram';
import { PlanogramLibraryItem } from './PlanogramLibraryItem';

interface PlanogramLibraryProps {
  planograms: PlanogramItem[];
  selectedPlanogramId: string;
  onSelectPlanogram: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onDuplicate: (id: string) => void;
}

export const PlanogramLibrary: React.FC<PlanogramLibraryProps> = ({
  planograms,
  selectedPlanogramId,
  onSelectPlanogram,
  searchQuery,
  onSearchChange,
  onDuplicate,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 flex flex-col h-full min-h-[300px]">
      {/* Header with Title and Search Input */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight shrink-0">
          Planogram Library
        </h3>

        <div className="relative w-36 sm:w-40">
          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search planograms..."
            className="w-full h-7 pl-7 pr-2 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Planogram List */}
      <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
        {planograms.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No planograms found.
          </div>
        ) : (
          planograms.map((plano) => (
            <PlanogramLibraryItem
              key={plano.id}
              planogram={plano}
              isSelected={selectedPlanogramId === plano.id}
              onSelect={onSelectPlanogram}
              onDuplicate={onDuplicate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PlanogramLibrary;
