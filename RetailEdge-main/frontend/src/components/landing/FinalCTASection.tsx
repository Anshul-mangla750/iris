import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LANDING_DATA } from '../../data/landingData';

export interface FinalCTASectionProps {
  onRequestDemo: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onRequestDemo }) => {
  const navigate = useNavigate();
  const { finalCta } = LANDING_DATA;

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <section className="relative overflow-hidden bg-[#0c3120] text-white py-14 sm:py-16 my-8">
      {/* Background retail image with heavy forest green translucent overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
        style={{ backgroundImage: `url(${finalCta.bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c3120]/95 via-[#0c3120]/90 to-[#0c3120]/95" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text Block */}
          <div className="text-center md:text-left space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight leading-tight">
              {finalCta.heading}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 font-normal">
              {finalCta.subtitle}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <button
              type="button"
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <span>{finalCta.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 text-slate-800" />
            </button>

            <button
              type="button"
              onClick={onRequestDemo}
              className="px-6 py-3 bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white/50 font-bold text-sm rounded-lg transition-all active:scale-[0.98]"
            >
              {finalCta.ctaSecondary}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
