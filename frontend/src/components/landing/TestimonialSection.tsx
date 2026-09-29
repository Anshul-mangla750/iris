import React, { useState } from 'react';
import { LANDING_DATA } from '../../data/landingData';
import TestimonialCard from './TestimonialCard';

export const TestimonialSection: React.FC = () => {
  const { testimonials } = LANDING_DATA;
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = testimonials.items[currentIndex] || testimonials.items[0];

  return (
    <div className="flex flex-col h-full select-none">
      {/* Section Header */}
      <div className="mb-4 text-left">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {testimonials.heading}
        </h3>
      </div>

      {/* Compact Testimonial Card */}
      <div className="flex-1 flex flex-col justify-between">
        <TestimonialCard item={current} />

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          {testimonials.items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-150 focus:outline-none ${
                currentIndex === idx
                  ? 'w-4 bg-[#0fa968]'
                  : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
