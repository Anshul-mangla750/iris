import React, { useState } from 'react';
import type { PlanogramItem } from '../../types/planogram';

interface PlanogramVisualViewProps {
  planogram: PlanogramItem;
}

export const PlanogramVisualView: React.FC<PlanogramVisualViewProps> = ({ planogram }) => {
  const [activeShelf, setActiveShelf] = useState<number | null>(null);

  const shelfLabels = [
    { num: 4, name: 'Shelf 4', subtitle: 'Premium' },
    { num: 3, name: 'Shelf 3', subtitle: 'Core' },
    { num: 2, name: 'Shelf 2', subtitle: 'High Turnover' },
    { num: 1, name: 'Shelf 1', subtitle: 'Value' },
  ];

  return (
    <div className="flex items-stretch gap-2.5 h-full min-h-[220px]">
      {/* Left Shelf Labels Column */}
      <div className="flex flex-col justify-between gap-1.5 py-0.5 w-24 shrink-0">
        {shelfLabels.map((shelf) => (
          <div
            key={shelf.num}
            onClick={() => setActiveShelf(activeShelf === shelf.num ? null : shelf.num)}
            className={`flex-1 flex flex-col justify-center px-2 py-1 rounded-lg border transition-all cursor-pointer text-center ${
              activeShelf === shelf.num
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                : 'bg-slate-50 border-slate-200/90 hover:bg-slate-100/70 text-slate-700'
            }`}
          >
            <div className="text-[11px] font-bold leading-tight">{shelf.name}</div>
            <div className="text-[9px] font-medium text-slate-500 leading-tight">
              {shelf.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Main Gondola Visual Display */}
      <div className="flex-1 relative rounded-lg border border-slate-200/90 bg-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
        <img
          src="/images/products-planogram/shelf_visual.png"
          alt={`${planogram.name} Visual Layout`}
          className="w-full h-full object-cover object-center max-h-[220px]"
        />

        {/* Overlay hover guide */}
        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
          4 Shelves • 48 SKUs
        </div>
      </div>
    </div>
  );
};

export default PlanogramVisualView;
