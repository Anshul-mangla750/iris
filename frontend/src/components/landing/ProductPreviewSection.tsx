import React from 'react';
import { LayoutDashboard, Users, Package, Eye, Bell, TrendingUp, CheckCircle2 } from 'lucide-react';

export const ProductPreviewSection: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center lg:justify-end w-full min-w-0 pt-2 select-none">
      {/* ========================================================
          LAPTOP CONTAINER MOCKUP
          ======================================================== */}
      <div className="relative w-full max-w-[400px] 2xl:max-w-[440px] bg-slate-900 rounded-t-2xl p-2 sm:p-2.5 shadow-2xl border border-slate-700/80">
        {/* Laptop Camera dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mx-auto mb-1.5" />

        {/* Laptop Screen Content (RetailEdge AI Dashboard) */}
        <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-800 text-left select-none text-[10px]">
          {/* Dashboard Header Bar */}
          <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0fa968]" />
              <span className="font-bold text-slate-800 text-[11px]">Dashboard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#0fa968] font-bold text-[9px]">
                ● Live 24 Stores
              </span>
            </div>
          </div>

          <div className="flex h-48 bg-slate-50">
            {/* Mini Sidebar */}
            <div className="w-24 bg-white border-r border-slate-200 p-2 space-y-1.5 shrink-0 hidden sm:block">
              <div className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-emerald-50 text-[#0fa968] font-bold">
                <LayoutDashboard className="w-3 h-3" />
                <span>Overview</span>
              </div>
              <div className="flex items-center gap-1.5 px-1.5 py-1 rounded text-slate-500 hover:text-slate-900">
                <Users className="w-3 h-3" />
                <span>Shoppers</span>
              </div>
              <div className="flex items-center gap-1.5 px-1.5 py-1 rounded text-slate-500 hover:text-slate-900">
                <Package className="w-3 h-3" />
                <span>Inventory</span>
              </div>
              <div className="flex items-center gap-1.5 px-1.5 py-1 rounded text-slate-500 hover:text-slate-900">
                <Eye className="w-3 h-3" />
                <span>Queues</span>
              </div>
              <div className="flex items-center gap-1.5 px-1.5 py-1 rounded text-slate-500 hover:text-slate-900">
                <Bell className="w-3 h-3" />
                <span>Alerts</span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-2.5 space-y-2 overflow-hidden">
              {/* Mini KPI row */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="bg-white p-1.5 rounded-md border border-slate-200">
                  <div className="text-[8.5px] text-slate-400">Total Sales</div>
                  <div className="font-bold text-slate-900 text-[10.5px]">₹ 4,28,760</div>
                  <div className="text-[8px] text-[#0fa968] font-semibold">↑ 12%</div>
                </div>
                <div className="bg-white p-1.5 rounded-md border border-slate-200">
                  <div className="text-[8.5px] text-slate-400">Footfall</div>
                  <div className="font-bold text-slate-900 text-[10.5px]">12,840</div>
                  <div className="text-[8px] text-[#0fa968] font-semibold">↑ 8%</div>
                </div>
                <div className="bg-white p-1.5 rounded-md border border-slate-200">
                  <div className="text-[8.5px] text-slate-400">Accuracy</div>
                  <div className="font-bold text-slate-900 text-[10.5px]">99.2%</div>
                  <div className="text-[8px] text-[#0fa968] font-semibold">Optimal</div>
                </div>
              </div>

              {/* Chart & Donut Row */}
              <div className="grid grid-cols-5 gap-1.5">
                {/* Simulated Area Chart */}
                <div className="col-span-3 bg-white p-2 rounded-md border border-slate-200">
                  <div className="text-[9px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Sales Overview</span>
                    <TrendingUp className="w-2.5 h-2.5 text-[#0fa968]" />
                  </div>
                  <svg className="w-full h-14" viewBox="0 0 100 40" fill="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 35 Q 20 25, 40 28 T 80 12 T 100 8 L 100 40 L 0 40 Z"
                      fill="url(#chartGrad)"
                    />
                    <path
                      d="M0 35 Q 20 25, 40 28 T 80 12 T 100 8"
                      stroke="#10B981"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Simulated Donut Chart */}
                <div className="col-span-2 bg-white p-2 rounded-md border border-slate-200 flex flex-col items-center justify-center">
                  <div className="text-[8.5px] font-bold text-slate-700 mb-1">Categories</div>
                  <div className="relative w-10 h-10">
                    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="4"
                        strokeDasharray="45 100"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeDasharray="25 100"
                        strokeDashoffset="-45"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="4"
                        strokeDasharray="15 100"
                        strokeDashoffset="-70"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop Base Stand */}
        <div className="h-2 bg-slate-800 rounded-b-md mx-auto w-[105%] -ml-[2.5%] mt-0.5 shadow-sm" />
      </div>

      {/* ========================================================
          MOBILE PHONE CONTAINER MOCKUP (Overlapping right)
          ======================================================== */}
      <div className="absolute -bottom-3 right-0 sm:right-1 w-24 sm:w-28 bg-slate-900 rounded-[20px] p-1.5 shadow-2xl border-2 border-slate-700 select-none z-20">
        {/* Speaker notch */}
        <div className="w-8 h-1 rounded-full bg-slate-800 mx-auto mb-1" />

        {/* Phone screen */}
        <div className="bg-white rounded-[16px] overflow-hidden p-2 space-y-1.5 text-[8.5px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
            <span className="font-bold text-slate-800">RetailEdge</span>
            <span className="text-[7px] text-[#0fa968] font-bold">LIVE</span>
          </div>

          <div className="bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-100">
            <div className="text-[7.5px] text-slate-500">Today Sales</div>
            <div className="font-extrabold text-slate-900 text-[10px]">₹ 12,450</div>
            <div className="text-[7px] text-[#0fa968] font-bold">↑ 14% growth</div>
          </div>

          <div className="space-y-1 pt-0.5">
            <div className="text-[7.5px] font-bold text-slate-700">Recent Activity</div>
            <div className="flex items-center gap-1 text-[7.5px] text-slate-600">
              <CheckCircle2 className="w-2.5 h-2.5 text-[#0fa968]" />
              <span className="truncate">Cashier Line 2 Balanced</span>
            </div>
            <div className="flex items-center gap-1 text-[7.5px] text-slate-600">
              <CheckCircle2 className="w-2.5 h-2.5 text-[#0fa968]" />
              <span className="truncate">Shelf A4 Restocked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewSection;
