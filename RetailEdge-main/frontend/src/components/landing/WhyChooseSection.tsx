import React from 'react';
import { LANDING_DATA } from '../../data/landingData';
import WhyChooseCard from './WhyChooseCard';

export const WhyChooseSection: React.FC = () => {
  const { whyChoose } = LANDING_DATA;

  return (
    <div className="flex flex-col h-full select-none">
      {/* Section Header */}
      <div className="mb-4 text-left">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {whyChoose.heading}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          {whyChoose.subtitle}
        </p>
      </div>

      {/* 2x2 Grid of Compact Cards (1 col on mobile, 2 cols on tablet/desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {whyChoose.cards.map((card, idx) => (
          <WhyChooseCard key={idx} item={card} />
        ))}
      </div>
    </div>
  );
};

export default WhyChooseSection;
