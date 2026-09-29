import React from 'react';
import type { SolutionItem } from '../../data/landingData';

export interface SolutionCardProps {
  solution: SolutionItem;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
      {/* Upper Image Portion */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={solution.image}
          alt={solution.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Category Name Underneath */}
      <div className="p-2 sm:p-2.5 text-center flex-1 flex items-center justify-center bg-white">
        <h4 className="text-xs sm:text-[12.5px] font-bold text-slate-800 tracking-tight leading-snug group-hover:text-[#0fa968] transition-colors line-clamp-2">
          {solution.name}
        </h4>
      </div>
    </div>
  );
};

export default SolutionCard;
