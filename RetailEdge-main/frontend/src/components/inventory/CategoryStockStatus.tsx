import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { CategoryStockStatus as CategoryStockStatusType } from '../../types/inventory';

interface CategoryStockStatusProps {
  categories: CategoryStockStatusType[];
  loading?: boolean;
}

export const CategoryStockStatus: React.FC<CategoryStockStatusProps> = ({
  categories,
  loading,
}) => {
  const [filter, setFilter] = useState('All Categories');

  return (
    <DashboardCard
      title="Category-wise Stock Status"
      className="h-full"
      loading={loading}
      action={
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md py-1 pl-2.5 pr-6 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
          >
            <option value="All Categories">All Categories</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Household">Household</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      }
    >
      <div className="pt-1">
        {/* Legend */}
        <div className="flex items-center gap-3 text-[10.5px] mb-2.5">
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            In Stock
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            Low Stock
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            Out of Stock
          </span>
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          {categories.map((item) => (
            <div key={item.category} className="flex items-center gap-2.5 text-[11px]">
              <span className="w-22 sm:w-24 text-slate-700 font-medium truncate shrink-0">
                {item.category}
              </span>

              {/* Stacked Progress Bar */}
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-100 flex items-center">
                <div
                  className="h-full bg-[#10B981] transition-all"
                  style={{ width: `${item.inStock}%` }}
                />
                <div
                  className="h-full bg-[#F59E0B] transition-all"
                  style={{ width: `${item.lowStock}%` }}
                />
                <div
                  className="h-full bg-[#EF4444] transition-all"
                  style={{ width: `${item.outOfStock}%` }}
                />
              </div>

              <span className="w-8 text-right font-bold text-slate-800 shrink-0">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default CategoryStockStatus;
