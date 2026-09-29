import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, MoreHorizontal } from 'lucide-react';

interface PlanogramManagementHeaderProps {
  selectedStore: string;
  onSelectStore: (store: string) => void;
  selectedAisle: string;
  onSelectAisle: (aisle: string) => void;
  onCreatePlanogram: () => void;
  onMoreActions?: () => void;
}

export const PlanogramManagementHeader: React.FC<PlanogramManagementHeaderProps> = ({
  selectedStore,
  onSelectStore,
  selectedAisle,
  onSelectAisle,
  onCreatePlanogram,
}) => {
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [aisleMenuOpen, setAisleMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const storeRef = useRef<HTMLDivElement>(null);
  const aisleRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (storeRef.current && !storeRef.current.contains(e.target as Node)) {
        setStoreMenuOpen(false);
      }
      if (aisleRef.current && !aisleRef.current.contains(e.target as Node)) {
        setAisleMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const storeOptions = [
    'Store 001 - City Mall, Delhi',
    'Store 002 - Cyber Hub, Gurugram',
    'Store 003 - Indiranagar, Bengaluru',
  ];

  const aisleOptions = [
    'Aisle 2 - Snacks',
    'Aisle 4 - Beverages',
    'Aisle 3 - Dairy',
    'Aisle 5 - Personal Care',
    'Aisle 6 - Home Care',
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6 mb-4">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Planogram Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Create, assign and monitor planograms for optimal product placement and shelf compliance.
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Store Selector */}
        <div className="relative" ref={storeRef}>
          <button
            type="button"
            onClick={() => setStoreMenuOpen(!storeMenuOpen)}
            className="h-9 px-3.5 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>{selectedStore}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {storeMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30">
              {storeOptions.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    onSelectStore(st);
                    setStoreMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                    selectedStore === st
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Aisle Selector */}
        <div className="relative" ref={aisleRef}>
          <button
            type="button"
            onClick={() => setAisleMenuOpen(!aisleMenuOpen)}
            className="h-9 px-3.5 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>{selectedAisle}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {aisleMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30">
              {aisleOptions.map((aisle) => (
                <button
                  key={aisle}
                  type="button"
                  onClick={() => {
                    onSelectAisle(aisle);
                    setAisleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                    selectedAisle === aisle
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {aisle}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* + Create Planogram Button */}
        <button
          type="button"
          onClick={onCreatePlanogram}
          className="h-9 px-4 bg-[#0FA968] hover:bg-[#0d925a] active:bg-[#0b804e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Planogram</span>
        </button>

        {/* More Actions Dropdown */}
        <div className="relative" ref={moreRef}>
          <button
            type="button"
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="h-9 px-3.5 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>More Actions</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {moreMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30">
              <button
                type="button"
                onClick={() => {
                  alert('Bulk compliance check initiated.');
                  setMoreMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Bulk Compliance Check</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Exporting all planograms metadata...');
                  setMoreMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Planogram Data</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanogramManagementHeader;
