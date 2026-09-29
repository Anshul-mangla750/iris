import React from 'react';
import { Calendar, Sun, RefreshCw, Download, Video, PackageCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export interface GreetingHeaderProps {
  userName?: string;
  message?: string;
  dateFormatted?: string;
  timeFormatted?: string;
  temperature?: string;
  location?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  userName = 'Admin',
  message = "Here's what's happening in your store today.",
  dateFormatted: initialDate,
  timeFormatted: initialTime,
  temperature = '28°C',
  location = 'Delhi, India',
  onRefresh,
  isRefreshing = false,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [liveTime, setLiveTime] = React.useState(() =>
    initialTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  );
  const [liveDate, setLiveDate] = React.useState(() =>
    initialDate || new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  );
  const [latency, setLatency] = React.useState(14);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setLiveDate(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
      setLatency(12 + Math.floor(Math.random() * 6));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExportSummary = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Trend\n' +
      'Total Footfall,1482,+12% vs yesterday\n' +
      'Avg Dwell Time,8.4 min,+6%\n' +
      'Active Queues,2 / 5,Normal\n' +
      'Out of Stock Items,4 items,Needs Restock\n' +
      'Planogram Compliance,96%,+3%\n' +
      'System Health,Online,All AI Models Operational\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `retailedge_summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Daily executive summary exported to CSV', 'success');
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 mb-3.5 select-none">
      {/* Left: Greeting text & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {userName}!
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold text-emerald-700 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE AI EDGE</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
            {message}
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs active:scale-95 disabled:opacity-50"
            title="Refresh Live Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportSummary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs active:scale-95"
            title="Export CSV Report"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/cameras')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-700 hover:bg-emerald-100/80 transition-all shadow-2xs active:scale-95"
          >
            <Video className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Streams</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs font-bold text-amber-700 hover:bg-amber-100/80 transition-all shadow-2xs active:scale-95"
          >
            <PackageCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Stock Audit</span>
          </button>
        </div>
      </div>

      {/* Right: Live Ticking Date/Time & Weather Widgets */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Live Date & Time with seconds ticking */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="text-[11px] leading-tight text-right sm:text-left">
            <span className="font-bold text-slate-800">{liveDate}</span>
            <span className="block text-[10.5px] text-emerald-600 font-mono font-bold">
              {liveTime} <span className="text-[9px] text-slate-400 font-sans font-normal">({latency}ms)</span>
            </span>
          </div>
        </div>

        {/* Weather Card */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
          <Sun className="w-4 h-4 text-amber-500 shrink-0 fill-amber-400" />
          <div className="text-[11px] leading-tight text-right sm:text-left">
            <span className="font-bold text-slate-800">{temperature}</span>
            <span className="block text-[10px] text-slate-400 font-normal">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingHeader;
