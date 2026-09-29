import React from 'react';
import { Star } from 'lucide-react';
import type { TestimonialItem } from '../../data/landingData';

export interface TestimonialCardProps {
  item: TestimonialItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ item }) => {
  return (
    <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 min-w-0">
      <div className="flex items-start gap-3.5">
        {/* Customer Avatar on the Left */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 mt-0.5">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content on the Right */}
        <div className="flex-1 min-w-0">
          {/* Quote */}
          <p className="text-xs sm:text-[12.5px] text-slate-700 leading-relaxed font-normal mb-2.5">
            "{item.quote}"
          </p>

          {/* Bottom Info: Name & Role on Left, Stars on Right */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <h4 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
                {item.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                {item.role}
              </p>
            </div>

            {/* 5 Small Gold Stars */}
            <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
