import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LANDING_DATA } from '../../data/landingData';
import PricingCard from './PricingCard';

export interface PricingSectionProps {
  onContactSales: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onContactSales }) => {
  const navigate = useNavigate();
  const { pricing } = LANDING_DATA;

  const handleAction = (planId: string) => {
    if (planId === 'enterprise') {
      onContactSales();
    } else {
      navigate('/login');
    }
  };

  return (
    <div id="pricing" className="flex flex-col h-full select-none w-full min-w-0">
      {/* Section Header */}
      <div className="mb-4 text-left">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {pricing.heading}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          {pricing.subtitle}
        </p>
      </div>

      {/* 3 Compact Pricing Cards in Horizontal Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-1 items-stretch w-full min-w-0">
        {pricing.plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} onSelect={handleAction} />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
