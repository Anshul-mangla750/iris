import React from 'react';
import BrandLogo from './BrandLogo';
import FeatureCard from './FeatureCard';
import StatCard from './StatCard';
import {
  LOGIN_PAGE_CONFIG,
  LOGIN_FEATURES,
  LOGIN_STATS,
} from '../../config/pageData';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  // Split features into left column (4 items) and right column (3 items) as shown in the reference
  const leftColumnFeatures = [
    LOGIN_FEATURES[0], // Shopper Analytics
    LOGIN_FEATURES[2], // Queue Intelligence
    LOGIN_FEATURES[4], // Alerts & Notifications
    LOGIN_FEATURES[6], // Camera Management
  ];

  const rightColumnFeatures = [
    LOGIN_FEATURES[1], // Inventory Monitoring
    LOGIN_FEATURES[3], // Planogram Compliance
    LOGIN_FEATURES[5], // Reports & Analytics
  ];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc]">
      {/* ========================================================
          LEFT PANEL: Marketing, Retail Background & Features (~60%)
          ======================================================== */}
      <div className="relative w-full lg:w-[58%] xl:w-[60%] min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 p-6 sm:p-10 lg:p-12 xl:p-14 selection:bg-emerald-500 selection:text-white">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `url(${LOGIN_PAGE_CONFIG.backgroundImage})`,
          }}
        />

        {/* Dark Vignette Overlay for Crisp Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/65 backdrop-brightness-[0.85]" />

        {/* Subdued ambient glow highlights */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content Container (Layered above background and overlay) */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-8 my-auto">
          {/* Top Bar: Brand Logo (Left) and Tagline (Right) */}
          <div className="flex items-center justify-between w-full">
            <BrandLogo theme="dark" size="md" />
            <div className="hidden sm:block text-gray-300/80 text-xs md:text-[13px] font-normal tracking-wide">
              {LOGIN_PAGE_CONFIG.tagline}
            </div>
          </div>

          {/* Main Content Area: Headline, Subtitle, and Feature Cards Grid */}
          <div className="my-auto py-2 space-y-6 max-w-xl">
            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl xl:text-[44px] font-extrabold text-white tracking-tight leading-[1.12]">
                {LOGIN_PAGE_CONFIG.headline.line1}
                <br />
                {LOGIN_PAGE_CONFIG.headline.line2}
                <br />
                <span className="text-white">
                  {LOGIN_PAGE_CONFIG.headline.line3Prefix}
                </span>
                <span className="text-[#3edc85]">
                  {LOGIN_PAGE_CONFIG.headline.line3Highlight}
                </span>
              </h1>
            </div>

            {/* Supporting Description */}
            <p className="text-gray-300/90 text-sm sm:text-[14.5px] leading-relaxed max-w-lg">
              {LOGIN_PAGE_CONFIG.description}
            </p>

            {/* Feature Cards: 2 Columns Matching Reference Composition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Left Column Features */}
              <div className="space-y-3">
                {leftColumnFeatures.map((feature) => (
                  <FeatureCard key={feature.id} feature={feature} />
                ))}
              </div>

              {/* Right Column Features */}
              <div className="space-y-3">
                {rightColumnFeatures.map((feature) => (
                  <FeatureCard key={feature.id} feature={feature} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Statistics: 4 Stat Cards in a Single Translucent Glass Row */}
          <div className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {LOGIN_STATS.map((stat) => (
                <StatCard key={stat.id} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          RIGHT PANEL: Centered White Authentication Card (~40%)
          ======================================================== */}
      <div className="w-full lg:w-[42%] xl:w-[40%] flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#f8fafc]">
        <div className="w-full max-w-[440px] bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-7 sm:p-9 md:p-10 transition-all">
          {/* Card Header: Brand Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <BrandLogo theme="light" size="lg" className="mb-4" />
            <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight">
              {LOGIN_PAGE_CONFIG.card.heading}
            </h2>
            <p className="text-xs sm:text-[13px] text-gray-500 mt-1 font-normal">
              {LOGIN_PAGE_CONFIG.card.subtitle}
            </p>
          </div>

          {/* Embedded Form */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
