import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Copy, Edit, Eye, FolderInput, Archive } from 'lucide-react';
import type { PlanogramItem } from '../../types/planogram';

interface PlanogramLibraryItemProps {
  planogram: PlanogramItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const PlanogramLibraryItem: React.FC<PlanogramLibraryItemProps> = ({
  planogram,
  isSelected,
  onSelect,
  onDuplicate,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      onClick={() => onSelect(planogram.id)}
      className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/20'
          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Thumbnail */}
        <div className="w-10 h-7 rounded border border-slate-200/90 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
          <img
            src={planogram.thumbnail}
            alt={planogram.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">
            {planogram.name}
          </h4>
          <p className="text-[10px] text-slate-500 truncate mt-0.5">
            {planogram.location} • {planogram.shelfCount} Shelves • {planogram.totalSkus} SKUs
          </p>
        </div>
      </div>

      {/* Right: Badge & 3-dot Menu */}
      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            planogram.status === 'Active'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {planogram.status}
        </span>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-left">
              <button
                type="button"
                onClick={() => {
                  onSelect(planogram.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Edit planogram ${planogram.name}`);
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Edit className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onDuplicate(planogram.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Duplicate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Assign ${planogram.name} to store`);
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <FolderInput className="w-3.5 h-3.5 text-slate-400" />
                <span>Assign</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Archived ${planogram.name}`);
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
              >
                <Archive className="w-3.5 h-3.5 text-rose-500" />
                <span>Archive</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanogramLibraryItem;
