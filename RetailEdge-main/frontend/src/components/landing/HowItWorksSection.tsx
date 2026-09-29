import React from 'react';
import { LANDING_DATA } from '../../data/landingData';
import ProcessStep from './ProcessStep';

export const HowItWorksSection: React.FC = () => {
  const { howItWorks } = LANDING_DATA;

  return (
    <div className="flex flex-col h-full select-none min-w-0">
      {/* Section Header */}
      <div className="mb-4 text-left">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {howItWorks.heading}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          {howItWorks.subtitle}
        </p>
      </div>

      {/* Lightweight Process Timeline (Vertical on mobile, horizontal on sm+) */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3 items-start w-full">
          {howItWorks.steps.map((step, idx) => (
            <ProcessStep
              key={step.stepNumber}
              step={step}
              isLast={idx === howItWorks.steps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
