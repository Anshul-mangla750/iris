import React, { useState } from 'react';
import LandingHeader from '../../components/landing/LandingHeader';
import HeroSection from '../../components/landing/HeroSection';
import FeatureStrip from '../../components/landing/FeatureStrip';
import TrustStats from '../../components/landing/TrustStats';
import WhyChooseSection from '../../components/landing/WhyChooseSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection';
import ProductPreviewSection from '../../components/landing/ProductPreviewSection';
import SolutionsSection from '../../components/landing/SolutionsSection';
import TestimonialSection from '../../components/landing/TestimonialSection';
import PricingSection from '../../components/landing/PricingSection';
import FinalCTASection from '../../components/landing/FinalCTASection';
import LandingFooter from '../../components/landing/LandingFooter';
import DemoModal from '../../components/landing/DemoModal';

export const LandingPage: React.FC = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoModalConfig, setDemoModalConfig] = useState<{
    title?: string;
    subtitle?: string;
  }>({});

  const handleOpenDemo = (title?: string, subtitle?: string) => {
    setDemoModalConfig({ title, subtitle });
    setDemoModalOpen(true);
  };

  const handleCloseDemo = () => {
    setDemoModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0fa968] selection:text-white flex flex-col">
      {/* Fixed Sticky Header Navigation */}
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onWatchDemo={() =>
            handleOpenDemo(
              'RetailEdge AI Product Walkthrough',
              'Experience our autonomous retail analytics, shelf tracking, and cashier queue balancing simulation.'
            )
          }
        />

        {/* 7-Card Horizontal Capability Feature Strip */}
        <FeatureStrip />

        {/* Adoption Metrics & Platform Trust */}
        <TrustStats />

        {/* ========================================================
            UNIFIED MIDDLE SECTIONS CONTAINER
            Preserves the exact rhythm of the reference:
            Tier 1: Why Choose (Left), How It Works (Center), Product Preview (Right)
            Tier 2: Our Solutions (5 Horizontal Cards)
            Tier 3: What Our Customers Say (Left) & Pricing (Right)
            ======================================================== */}
        <section id="product" className="py-12 sm:py-14 bg-white relative overflow-hidden">
          {/* Subtle pale green organic background decoration */}
          <div className="absolute top-1/3 left-0 w-80 h-80 bg-emerald-100/25 rounded-full blur-3xl pointer-events-none -ml-24" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none -mr-24" />

          <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14 relative z-10">
            {/* TIER 1: Why Choose (Left ~40%), How It Works (Center ~29%), Product Preview (Right ~31%) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr_1.05fr] gap-6 xl:gap-8 items-start">
              {/* Left Column: Why Choose RetailEdge AI? */}
              <div className="min-w-0 w-full h-full">
                <WhyChooseSection />
              </div>

              {/* Center Column: How It Works */}
              <div className="min-w-0 w-full h-full">
                <HowItWorksSection />
              </div>

              {/* Right Column: Product Preview Laptop & Phone */}
              <div className="min-w-0 w-full h-full flex items-center justify-center lg:justify-end pt-2 lg:pt-0">
                <ProductPreviewSection />
              </div>
            </div>

            {/* TIER 2: Our Solutions (Horizontal row of 5 compact image cards) */}
            <div className="pt-2 w-full">
              <SolutionsSection />
            </div>

            {/* TIER 3: What Our Customers Say (Left ~33%) & Pricing (Right ~67%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start pt-2">
              {/* Left Column: What Our Customers Say (4 cols = 33.3%) */}
              <div className="lg:col-span-4 min-w-0 w-full">
                <TestimonialSection />
              </div>

              {/* Right Column: Pricing Plans (8 cols = 66.7%) */}
              <div className="lg:col-span-8 min-w-0 w-full">
                <PricingSection
                  onContactSales={() =>
                    handleOpenDemo(
                      'Contact Enterprise Sales',
                      'Connect with a RetailEdge AI enterprise retail architect for custom multi-store rollouts, dedicated servers, and custom vision models.'
                    )
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final Conversion Banner */}
        <FinalCTASection
          onRequestDemo={() =>
            handleOpenDemo(
              'Schedule a Live Retail Demo',
              'Reserve a personalized live demonstration tailored to your grocery, supermarket, or retail chain operations.'
            )
          }
        />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Interactive Demo/Contact Modal */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={handleCloseDemo}
        title={demoModalConfig.title}
        subtitle={demoModalConfig.subtitle}
      />
    </div>
  );
};

export default LandingPage;
