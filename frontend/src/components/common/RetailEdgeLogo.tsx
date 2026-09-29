import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface RetailEdgeLogoProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: 'horizontal' | 'stacked' | 'badge';
}

export const RetailEdgeLogo: React.FC<RetailEdgeLogoProps> = ({
  theme = 'light',
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
  variant = 'horizontal',
}) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const dimensions = {
    sm: { icon: 'w-7 h-7', text: 'text-base', tagline: 'text-[9.5px]' },
    md: { icon: 'w-8 h-8', text: 'text-xl', tagline: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', tagline: 'text-xs' },
    xl: { icon: 'w-12 h-12', text: 'text-3xl', tagline: 'text-sm' },
  }[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/dashboard');
    }
  };

  if (variant === 'stacked') {
    return (
      <div
        onClick={handleClick}
        className={`flex flex-col items-center text-center cursor-pointer select-none group ${className}`}
      >
        <img
          src="/iris_icon_transparent.png"
          alt="IRIS Logo"
          className={`${dimensions.icon} object-contain transition-transform group-hover:scale-105 duration-200 mb-1.5`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/iris_logo.jpg';
          }}
        />
        <span className={`font-black tracking-wider leading-none ${dimensions.text} ${isDark ? 'text-white' : 'text-[#0a192f]'}`}>
          IRIS
        </span>
        {showTagline && (
          <span className={`font-medium tracking-tight text-slate-400 mt-1 ${dimensions.tagline}`}>
            Intelligent Retail Insight System
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      {/* Official IRIS Eye Aperture Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src="/iris_icon_transparent.png"
          alt="IRIS Logo"
          className={`${dimensions.icon} object-contain transition-transform group-hover:scale-105 duration-200 drop-shadow-xs`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/iris_logo.jpg';
          }}
        />
      </div>

      {/* Typography: IRIS + Intelligent Retail Insight System */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`font-black tracking-tight ${dimensions.text} ${isDark ? 'text-white' : 'text-[#0a192f]'} font-sans`}>
            IRIS
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
        </div>
        {showTagline && (
          <span className={`font-semibold tracking-tight text-slate-400 mt-0.5 truncate ${dimensions.tagline} font-sans`}>
            Intelligent Retail Insight System
          </span>
        )}
      </div>
    </div>
  );
};

export default RetailEdgeLogo;
