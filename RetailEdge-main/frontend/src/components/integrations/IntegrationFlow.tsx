import React from 'react';
import {
  Calculator,
  Database,
  Cog,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Package,
  Boxes,
  BarChart3,
  Store,
  CheckCircle,
} from 'lucide-react';
import RetailEdgeLogo from '../common/RetailEdgeLogo';

export const IntegrationFlow: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Integration Flow
          </h2>
          <p className="text-[11.5px] text-slate-500 mt-0.5">
            Real-time sync between POS, ERP and RetailEdge AI modules.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f8f0] text-[#0fa968] text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] animate-pulse" />
          Live Syncing
        </span>
      </div>

      {/* Main Flow Diagram Area */}
      <div className="flex-1 flex flex-col justify-between py-1">
        {/* Top 3 Systems Row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 lg:gap-3">
          {/* 1. POS System (Left) */}
          <div
            className="bg-[#f0faf5] border border-emerald-200/90 rounded-xl p-3.5 hover:shadow-xs transition-all group"
            title="Sales, payments, returns"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0fa968] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Calculator className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-slate-900 mb-2">POS System</h3>
                <ul className="space-y-1 text-[11px] text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] shrink-0" />
                    <span>Sales Transactions</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] shrink-0" />
                    <span>Payments</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] shrink-0" />
                    <span>Returns</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] shrink-0" />
                    <span>Daily Closing</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] shrink-0" />
                    <span>Customer Data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Connector 1: POS <-> Middleware */}
          <div className="hidden md:flex flex-col items-center justify-center gap-1 px-1">
            <div className="flex items-center text-[#0fa968]">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center text-[#0fa968]">
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* 2. Integration Middleware (Center) */}
          <div
            className="bg-white border-2 border-emerald-400 rounded-xl p-3.5 shadow-xs flex flex-col items-center justify-center text-center hover:border-emerald-500 transition-all group"
            title="API/Webhooks/Scheduled Sync"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0fa968] flex items-center justify-center mb-1.5">
              <Cog className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
              Integration Middleware
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
              API / Webhooks /<br />Scheduled Sync
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#0fa968] text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968]" />
              Running
            </div>
          </div>

          {/* Connector 2: Middleware <-> ERP */}
          <div className="hidden md:flex flex-col items-center justify-center gap-1 px-1">
            <div className="flex items-center text-[#0fa968]">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center text-[#0fa968]">
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* 3. ERP System (Right) */}
          <div
            className="bg-[#f0f6ff] border border-blue-200/90 rounded-xl p-3.5 hover:shadow-xs transition-all group"
            title="Products, inventory, suppliers"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Database className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-slate-900 mb-2">ERP System</h3>
                <ul className="space-y-1 text-[11px] text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Product Master</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Inventory Stock</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Purchase Orders</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Supplier Data</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Store Master</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Flow Downwards to RetailEdge AI */}
        <div className="flex flex-col items-center my-2 relative">
          <div className="w-0.5 h-2.5 bg-emerald-400" />
          <div className="text-emerald-500 -my-1">
            <ArrowDown className="w-3 h-3 stroke-[2.5]" />
          </div>

          {/* Central RetailEdge AI Hub Pill */}
          <div
            className="px-3.5 py-1 rounded-xl bg-[#e8f8f0] border border-emerald-300 flex items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-emerald-100/70 transition-colors"
            title="Unified retail intelligence"
          >
            <RetailEdgeLogo size="sm" showTagline={false} />
          </div>

          {/* Connecting Branching Lines */}
          <div className="w-full max-w-[84%] relative mt-2">
            <div className="h-0.5 bg-slate-200 w-full" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-slate-300 bg-white" />
          </div>
        </div>

        {/* 5 Connected RetailEdge AI Modules in Single Row */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {/* Module 1: Inventory Monitoring */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-lg p-1.5 sm:p-2 flex items-center gap-2 hover:bg-white hover:shadow-2xs transition-all">
            <div className="w-6 h-6 rounded-md bg-[#f5eeff] text-[#8b5cf6] flex items-center justify-center shrink-0">
              <Package className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold text-slate-800 leading-tight">
                Inventory
              </div>
              <div className="text-[9.5px] text-slate-500 leading-tight truncate">
                Monitoring
              </div>
            </div>
          </div>

          {/* Module 2: Products & Planogram */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-lg p-1.5 sm:p-2 flex items-center gap-2 hover:bg-white hover:shadow-2xs transition-all">
            <div className="w-6 h-6 rounded-md bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
              <Boxes className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold text-slate-800 leading-tight">
                Products &
              </div>
              <div className="text-[9.5px] text-slate-500 leading-tight truncate">
                Planogram
              </div>
            </div>
          </div>

          {/* Module 3: Analytics & Reports */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-lg p-1.5 sm:p-2 flex items-center gap-2 hover:bg-white hover:shadow-2xs transition-all">
            <div className="w-6 h-6 rounded-md bg-[#fffbeb] text-[#f59e0b] flex items-center justify-center shrink-0">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold text-slate-800 leading-tight">
                Analytics &
              </div>
              <div className="text-[9.5px] text-slate-500 leading-tight truncate">
                Reports
              </div>
            </div>
          </div>

          {/* Module 4: Store Management */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-lg p-1.5 sm:p-2 flex items-center gap-2 hover:bg-white hover:shadow-2xs transition-all">
            <div className="w-6 h-6 rounded-md bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold text-slate-800 leading-tight">
                Store
              </div>
              <div className="text-[9.5px] text-slate-500 leading-tight truncate">
                Management
              </div>
            </div>
          </div>

          {/* Module 5: Compliance & Alerts */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-lg p-1.5 sm:p-2 flex items-center gap-2 hover:bg-white hover:shadow-2xs transition-all">
            <div className="w-6 h-6 rounded-md bg-[#fff1f2] text-[#e11d48] flex items-center justify-center shrink-0">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold text-slate-800 leading-tight">
                Compliance
              </div>
              <div className="text-[9.5px] text-slate-500 leading-tight truncate">
                & Alerts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationFlow;
