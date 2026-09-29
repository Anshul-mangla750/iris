import React from 'react';
import type { HowItWorksStep } from '../../data/landingData';

export interface ProcessStepProps {
  step: HowItWorksStep;
  isLast?: boolean;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({ step, isLast = false }) => {
  return (
    <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-0 min-w-0">
      {/* Badge & Connector: Vertical on mobile, Horizontal on tablet/desktop */}
      <div className="flex flex-col sm:flex-row items-center shrink-0 sm:w-full mb-0 sm:mb-2.5">
        <div className="w-8 h-8 rounded-full bg-[#0fa968] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ring-4 ring-white select-none">
          {step.stepNumber}
        </div>
        {!isLast ? (
          <>
            {/* Mobile Vertical Connector Line */}
            <div className="w-0 sm:hidden h-6 border-l-2 border-dashed border-emerald-300 my-1" />
            {/* Desktop/Tablet Horizontal Connector Line */}
            <div className="hidden sm:block flex-1 h-0 border-t-2 border-dashed border-emerald-300 mx-1.5 sm:mx-2" />
          </>
        ) : (
          <div className="hidden sm:block flex-1 invisible" />
        )}
      </div>

      {/* Step Content: Beside badge on mobile, below on tablet/desktop */}
      <div className="min-w-0 flex-1 pt-0.5 sm:pt-0">
        <h4 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
          {step.title}
        </h4>
        <p className="text-[11px] text-slate-500 leading-snug mt-0.5 sm:mt-1 font-normal">
          {step.description}
        </p>
      </div>
    </div>
  );
};

export default ProcessStep;
