import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import HeroDashboardPreview from './HeroDashboardPreview';
import FloatingFeatureCard from './FloatingFeatureCard';
import { LANDING_DATA } from '../../data/landingData';

export interface HeroSectionProps {
  onWatchDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onWatchDemo }) => {
  const navigate = useNavigate();
  const { hero, heroFloatingCards } = LANDING_DATA;

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <section
      id="home"
      className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-white via-emerald-50/20 to-white"
    >
      {/* Subtle organic green background decorative curves */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-40" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ========================================================
              LEFT COLUMN: Headline, Pill, Description, CTAs, Trust
              ======================================================== */}
          <div className="lg:col-span-6 space-y-6 text-left z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0fa968] border border-emerald-200/70 text-xs font-semibold select-none">
              <Sparkles className="w-3.5 h-3.5 text-[#0fa968]" />
              <span>{hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.08]">
              {hero.headlinePart1}
              <br />
              <span className="text-[#0fa968]">{hero.headlinePart2}</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              {hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0fa968] hover:bg-[#0d945b] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>{hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onWatchDemo}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-semibold rounded-lg shadow-2xs hover:border-slate-300 transition-all active:scale-[0.98]"
              >
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
                </div>
                <span>{hero.ctaSecondary}</span>
              </button>
            </div>

            {/* Trust & Value Checklist */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-700">
              {hero.trustPoints.map((point, index) => (
                <div key={index} className="inline-flex items-center gap-1.5 select-none">
                  <CheckCircle2 className="w-4 h-4 text-[#0fa968] fill-emerald-100 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Hero Retail Image & Floating Overlay Cards
              ======================================================== */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Green Organic Curve Behind Image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-100/60 via-emerald-50/40 to-teal-50/30 rounded-[40px] -rotate-1 pointer-events-none" />

            {/* Main Supermarket Retail Store Container */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/11] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white z-0">
              <img
                src={hero.storeImage}
                alt="Modern Retail Store with Checkout and Shelves"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Overlay 1: Live Store Overview Dashboard (Top-Left of Image) */}
            <div className="absolute -top-6 left-2 sm:left-4 z-20 hidden sm:block">
              <HeroDashboardPreview />
            </div>

            {/* Overlay 2: Floating Card 1 - Real-time Inventory */}
            <div className="absolute top-1/4 -left-6 z-20 hidden md:block">
              <FloatingFeatureCard item={heroFloatingCards[0]} />
            </div>

            {/* Overlay 3: Floating Card 2 - Multi-Store Management */}
            <div className="absolute top-12 -right-4 z-20 hidden md:block">
              <FloatingFeatureCard item={heroFloatingCards[1]} />
            </div>

            {/* Overlay 4: Floating Card 3 - AI Analytics & Insights */}
            <div className="absolute -bottom-4 left-6 z-20 hidden sm:block">
              <FloatingFeatureCard item={heroFloatingCards[2]} />
            </div>

            {/* Overlay 5: Floating Card 4 - Secure & Compliant */}
            <div className="absolute -bottom-3 -right-4 z-20 hidden sm:block">
              <FloatingFeatureCard item={heroFloatingCards[3]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
