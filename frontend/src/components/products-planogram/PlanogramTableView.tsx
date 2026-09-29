import React from 'react';
import type { PlanogramItem } from '../../types/planogram';

interface PlanogramTableViewProps {
  planogram: PlanogramItem;
}

export const PlanogramTableView: React.FC<PlanogramTableViewProps> = ({ planogram }) => {
  const allPositions =
    planogram.shelves?.flatMap((shelf) =>
      shelf.positions.map((pos) => ({
        ...pos,
        shelfLabel: shelf.label,
      }))
    ) || [];

  return (
    <div className="overflow-x-auto max-h-[260px] overflow-y-auto border border-slate-200/80 rounded-lg">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
          <tr className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-2 px-3">Shelf</th>
            <th className="py-2 px-3">Position</th>
            <th className="py-2 px-3">Product</th>
            <th className="py-2 px-3">SKU</th>
            <th className="py-2 px-3">Category</th>
            <th className="py-2 px-3 text-center">Expected Qty</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {allPositions.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-slate-400">
                No positions configured.
              </td>
            </tr>
          ) : (
            allPositions.map((pos) => (
              <tr key={pos.id} className="hover:bg-slate-50/80">
                <td className="py-2 px-3 font-medium text-slate-900">{pos.shelfLabel}</td>
                <td className="py-2 px-3 font-mono text-[11px]">Pos {pos.position}</td>
                <td className="py-2 px-3 font-semibold text-slate-800">{pos.productName}</td>
                <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">{pos.sku}</td>
                <td className="py-2 px-3 text-slate-600">{pos.category}</td>
                <td className="py-2 px-3 text-center font-bold text-slate-800">
                  {pos.expectedQuantity}
                </td>
                <td className="py-2 px-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      pos.status === 'Correct'
                        ? 'bg-emerald-100 text-emerald-700'
                        : pos.status === 'Misplaced'
                        ? 'bg-amber-100 text-amber-700'
                        : pos.status === 'Missing'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {pos.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlanogramTableView;
