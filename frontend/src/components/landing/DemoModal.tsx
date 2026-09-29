import React, { useEffect } from 'react';
import { X, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  title = 'RetailEdge AI Demo',
  subtitle = 'Interactive product demo and simulated store floor walkthrough will be available here.',
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0fa968]">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 id="demo-modal-title" className="text-xl font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-[#0fa968] font-medium mt-0.5">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Store Engine
            </span>
          </div>
        </div>

        {/* Content Preview Box */}
        <div className="my-5 p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100/70 flex items-center justify-center text-[#0fa968]">
            <Play className="w-6 h-6 ml-0.5 fill-current" />
          </div>
          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0fa968]" /> Shopper Analytics
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0fa968]" /> Queue & Shelf AI
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0fa968]" /> Real-time Billing
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0fa968] hover:bg-[#0d945b] text-white text-sm font-medium rounded-lg shadow-sm transition-all"
          >
            Access Platform & Sign In →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
