import React from 'react';
import type { PricingPlan } from '../../data/landingData';

export interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (planId: string) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect }) => {
  const isHighlighted = plan.isPopular;

  return (
    <div
      className={`relative flex flex-col justify-between p-4 rounded-xl transition-all duration-150 min-w-0 w-full text-center ${
        isHighlighted
          ? 'bg-[#f4fbf7] border-2 border-[#0fa968] shadow-[0_4px_16px_rgba(15,169,104,0.12)] -translate-y-0.5'
          : 'bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300'
      }`}
    >
      {/* Most Popular Badge on Top */}
      {plan.popularBadge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#0fa968] text-white text-[10px] font-bold tracking-normal shadow-xs whitespace-nowrap select-none">
          {plan.popularBadge}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center">
        {/* Plan Name */}
        <h4 className="text-[13px] font-bold text-slate-800 tracking-tight mb-1">
          {plan.name}
        </h4>

        {/* Price Row */}
        <div className="flex items-baseline justify-center gap-0.5 mb-2.5">
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-xs text-slate-500 font-normal">
              {plan.period}
            </span>
          )}
        </div>

        {/* Feature Specs */}
        <div className="w-full space-y-0.5 py-2 text-xs border-t border-slate-100 mb-4 text-center">
          <div className="font-bold text-slate-800">{plan.storeCount}</div>
          <div className="text-slate-500 font-normal text-[11.5px]">{plan.featuresSummary}</div>
        </div>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={() => onSelect(plan.id)}
        className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all mt-auto ${
          isHighlighted
            ? 'bg-[#0fa968] hover:bg-[#0d945b] active:bg-[#0a7c4c] text-white shadow-xs'
            : 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs'
        }`}
      >
        {plan.buttonText}
      </button>
    </div>
  );
};

export default PricingCard;
