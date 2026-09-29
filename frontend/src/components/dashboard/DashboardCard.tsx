import React from 'react';

export interface DashboardCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  isLoading?: boolean;
  loading?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  headerAction,
  action,
  children,
  className = '',
  bodyClassName = '',
  isLoading = false,
  loading,
}) => {
  const showLoading = loading ?? isLoading;
  const cardAction = headerAction || action;
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden ${className}`}
    >
      {(title || cardAction) && (
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
          <div className="min-w-0">
            {typeof title === 'string' ? (
              <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 tracking-tight truncate">
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-[10.5px] text-slate-400 font-normal leading-tight mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {cardAction && <div className="shrink-0 flex items-center gap-1.5">{cardAction}</div>}
        </div>
      )}

      <div className={`p-3.5 sm:p-4 flex-1 flex flex-col justify-between min-w-0 ${bodyClassName}`}>
        {showLoading ? (
          <div className="flex-1 flex items-center justify-center py-6">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
