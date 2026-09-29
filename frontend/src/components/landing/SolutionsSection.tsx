import React from 'react';
import { LANDING_DATA } from '../../data/landingData';
import SolutionCard from './SolutionCard';

export const SolutionsSection: React.FC = () => {
  const { solutions } = LANDING_DATA;

  return (
    <div id="solutions" className="flex flex-col w-full select-none">
      {/* Section Header */}
      <div className="mb-4 text-left">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {solutions.heading}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          {solutions.subtitle}
        </p>
      </div>

      {/* Row of 5 Horizontal Solution Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-stretch">
        {solutions.items.map((solution) => (
          <SolutionCard key={solution.id} solution={solution} />
        ))}
      </div>
    </div>
  );
};

export default SolutionsSection;
